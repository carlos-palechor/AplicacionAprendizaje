const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Administrador, Estudiante, Profesional, Rol } = require('../../models/associations');

const TIPOS_CUENTA = {
  estudiante: {
    modelo: Estudiante,
    idCampo: 'id_estudiante',
    idRol: 1,
    nombreRol: 'estudiante',
    mensajeRegistro: 'Estudiante registrado correctamente',
    mensajeRolNoEncontrado: 'No se encontro el rol estudiante en la base de datos',
    mensajeRolNoPermitido: 'Este endpoint solo permite cuentas de estudiante'
  },
  profesional: {
    modelo: Profesional,
    idCampo: 'id_profesional',
    idRol: 2,
    nombreRol: 'profesional',
    mensajeRegistro: 'Profesional registrado correctamente',
    mensajeRolNoEncontrado: 'No se encontro el rol profesional en la base de datos',
    mensajeRolNoPermitido: 'Este endpoint solo permite cuentas profesionales'
  },
  administrador: {
    modelo: Administrador,
    idCampo: 'id_administrador',
    idRol: 3,
    nombreRol: 'administrador',
    mensajeRegistro: 'Administrador registrado correctamente',
    mensajeRolNoEncontrado: 'No se encontro el rol administrador en la base de datos',
    mensajeRolNoPermitido: 'Este endpoint solo permite cuentas administradoras'
  }
};

function obtenerConfigCuenta(tipoCuenta) {
  const configCuenta = TIPOS_CUENTA[tipoCuenta];

  if (!configCuenta) {
    const error = new Error();
    error.code = 'TIPO_CUENTA_NO_VALIDO';
    throw error;
  }

  return configCuenta;
}

function obtenerCuentaSegura(cuenta) {
  const cuentaPlana = cuenta.toJSON();
  delete cuentaPlana.contrasena;
  return cuentaPlana;
}

async function obtenerRolPorNombre(nombreRol) {
  const rol = await Rol.findOne({
    where: { nombre_rol: nombreRol }
  });

  if (!rol) {
    const error = new Error();
    error.code = 'ROLE_NOT_FOUND';
    throw error;
  }

  return rol;
}

async function validarCorreoDisponible(correo) {
  const estudianteExistente = await Estudiante.findOne({
    where: { correo }
  });
  const profesionalExistente = await Profesional.findOne({
    where: { correo }
  });
  const administradorExistente = await Administrador.findOne({
    where: { correo }
  });

  if (estudianteExistente || profesionalExistente || administradorExistente) {
    const error = new Error();
    error.code = 'EMAIL_EXISTS';
    throw error;
  }
}

async function crearCuenta(data, configCuenta) {
  const {
    nombres,
    apellidos,
    correo,
    contrasena,
    universidad,
    titulo_profesional,
    especializacion,
    descripcion_perfil,
    linkedin_url,
    disponibilidad,
    verificado
  } = data;
  const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

  const datosCuenta = {
    id_rol: configCuenta.idRol,
    nombres,
    apellidos,
    correo,
    contrasena: contrasenaHasheada
  };

  if (configCuenta.nombreRol === 'profesional') {
    Object.assign(datosCuenta, {
      universidad: universidad || null,
      titulo_profesional: titulo_profesional || null,
      especializacion: especializacion || null,
      descripcion_perfil: descripcion_perfil || null,
      linkedin_url: linkedin_url || null,
      disponibilidad: disponibilidad || null,
      verificado: verificado === undefined ? false : Boolean(verificado)
    });
  }

  const cuenta = await configCuenta.modelo.create(datosCuenta);
  return obtenerCuentaSegura(cuenta);
}

function prepararErrorCuenta(error, configCuenta) {
  if (error.code === 'ROLE_NOT_FOUND') {
    error.authMessage = configCuenta.mensajeRolNoEncontrado;
  }

  if (error.code === 'ROLE_NOT_ALLOWED') {
    error.authMessage = configCuenta.mensajeRolNoPermitido;
  }
}

async function validarRolRegistro(configCuenta) {
  const rol = await obtenerRolPorNombre(configCuenta.nombreRol);

  if (rol.id_rol !== configCuenta.idRol) {
    const error = new Error();
    error.code = 'ROLE_NOT_FOUND';
    throw error;
  }
}

async function registrarCuenta(data, configCuenta) {
  await validarCorreoDisponible(data.correo);
  await validarRolRegistro(configCuenta);
  return crearCuenta(data, configCuenta);
}

function generarToken(cuenta, configCuenta) {
  if (!process.env.JWT_SECRET) {
    const error = new Error();
    error.code = 'JWT_SECRET_NOT_DEFINED';
    throw error;
  }

  return jwt.sign(
    {
      [configCuenta.idCampo]: cuenta[configCuenta.idCampo],
      correo: cuenta.correo,
      id_rol: cuenta.id_rol,
      nombre_rol: configCuenta.nombreRol,
      tipo_cuenta: configCuenta.nombreRol
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
}

async function registrar(tipoCuenta, data) {
  const configCuenta = obtenerConfigCuenta(tipoCuenta);

  try {
    const cuenta = await registrarCuenta(data, configCuenta);

    return {
      message: configCuenta.mensajeRegistro,
      data: cuenta
    };
  } catch (error) {
    prepararErrorCuenta(error, configCuenta);
    throw error;
  }
}

async function login(tipoCuenta, data) {
  const configCuenta = obtenerConfigCuenta(tipoCuenta);
  const { correo, contrasena } = data;

  try {
    const cuenta = await configCuenta.modelo.findOne({
      where: { correo },
      include: [{ model: Rol }]
    });

    if (!cuenta) {
      const error = new Error();
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    if (cuenta.id_rol !== configCuenta.idRol) {
      const error = new Error();
      error.code = 'ROLE_NOT_ALLOWED';
      throw error;
    }

    const contrasenaValida = await bcrypt.compare(contrasena, cuenta.contrasena);

    if (!contrasenaValida) {
      const error = new Error();
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    return {
      message: 'Inicio de sesion exitoso',
      data: {
        [configCuenta.nombreRol]: obtenerCuentaSegura(cuenta),
        token: generarToken(cuenta, configCuenta)
      }
    };
  } catch (error) {
    prepararErrorCuenta(error, configCuenta);
    throw error;
  }
}

module.exports = {
  registrar,
  login
};
