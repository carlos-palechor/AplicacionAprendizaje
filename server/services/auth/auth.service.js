const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Rol } = require('../../models/associations');
const { TIPOS_CUENTA } = require('./auth.config');
const {
  crearCuenta,
  existeCorreoEnOtraCuenta,
  obtenerCuentaPorCorreo,
  obtenerCuentaSegura,
  validarCorreoDisponible
} = require('./auth-account.service');
const { validarTokenGoogle } = require('./google-token.service');
const {
  separarNombreGoogle,
  validarDatosProfesionalGoogle
} = require('./google-profile.service');

function obtenerConfigCuenta(tipoCuenta) {
  const configCuenta = TIPOS_CUENTA[tipoCuenta];

  if (!configCuenta) {
    const error = new Error();
    error.code = 'TIPO_CUENTA_NO_VALIDO';
    throw error;
  }

  return configCuenta;
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

async function registrarCuentaGoogle(data, perfilGoogle, configCuenta) {
  const { nombres, apellidos } = separarNombreGoogle(perfilGoogle);
  const contrasenaTemporal = await bcrypt.hash(`google:${perfilGoogle.sub}:${Date.now()}`, 10);
  const datosCuenta = {
    ...data,
    nombres,
    apellidos,
    correo: perfilGoogle.email,
    contrasena: contrasenaTemporal
  };

  if (configCuenta.nombreRol === 'profesional') {
    validarDatosProfesionalGoogle(data);
  }

  await validarRolRegistro(configCuenta);
  return crearCuenta(datosCuenta, configCuenta);
}

async function google(tipoCuenta, data) {
  const configCuenta = obtenerConfigCuenta(tipoCuenta);
  const perfilGoogle = await validarTokenGoogle(data.id_token);
  const cuentaExistente = await obtenerCuentaPorCorreo(perfilGoogle.email, configCuenta);
  let cuenta = cuentaExistente;
  let statusCode = 200;
  let message = 'Inicio de sesion con Google exitoso';

  if (!cuenta) {
    if (await existeCorreoEnOtraCuenta(perfilGoogle.email, configCuenta)) {
      const error = new Error();
      error.code = 'GOOGLE_ACCOUNT_ROLE_CONFLICT';
      throw error;
    }

    await registrarCuentaGoogle(data, perfilGoogle, configCuenta);
    cuenta = await obtenerCuentaPorCorreo(perfilGoogle.email, configCuenta);
    statusCode = 201;
    message = `${configCuenta.mensajeRegistro} con Google`;
  }

  return {
    statusCode,
    message,
    data: {
      [configCuenta.nombreRol]: obtenerCuentaSegura(cuenta),
      token: generarToken(cuenta, configCuenta)
    }
  };
}

module.exports = {
  registrar,
  login,
  google
};
