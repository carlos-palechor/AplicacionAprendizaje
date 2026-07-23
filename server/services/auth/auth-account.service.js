const bcrypt = require('bcryptjs');
const { TIPOS_CUENTA } = require('./auth.config');

function obtenerCuentaSegura(cuenta) {
  const cuentaPlana = cuenta.toJSON();
  delete cuentaPlana.contrasena;
  return cuentaPlana;
}

async function validarCorreoDisponible(correo) {
  const consultas = Object.values(TIPOS_CUENTA).map((cuenta) => {
    return cuenta.modelo.findOne({ where: { correo } });
  });
  const cuentas = await Promise.all(consultas);

  if (cuentas.some(Boolean)) {
    const error = new Error();
    error.code = 'EMAIL_EXISTS';
    throw error;
  }
}

async function obtenerCuentaPorCorreo(correo, configCuenta, include = []) {
  return configCuenta.modelo.findOne({
    where: { correo },
    include
  });
}

async function existeCorreoEnOtraCuenta(correo, configCuenta) {
  const consultas = Object.values(TIPOS_CUENTA)
    .filter((cuenta) => cuenta.nombreRol !== configCuenta.nombreRol)
    .map((cuenta) => cuenta.modelo.findOne({ where: { correo } }));
  const cuentas = await Promise.all(consultas);

  return cuentas.some(Boolean);
}

async function crearCuenta(data, configCuenta) {
  const contrasenaHasheada = await bcrypt.hash(data.contrasena, 10);
  const datosCuenta = {
    id_rol: configCuenta.idRol,
    nombres: data.nombres,
    apellidos: data.apellidos,
    correo: data.correo,
    contrasena: contrasenaHasheada
  };

  if (configCuenta.nombreRol === 'profesional') {
    Object.assign(datosCuenta, {
      universidad: data.universidad || null,
      titulo_profesional: data.titulo_profesional || null,
      especializacion: data.especializacion || null,
      descripcion_perfil: data.descripcion_perfil || null,
      linkedin_url: data.linkedin_url || null,
      disponibilidad: data.disponibilidad || null,
      verificado: data.verificado === undefined ? false : Boolean(data.verificado)
    });
  }

  const cuenta = await configCuenta.modelo.create(datosCuenta);
  return obtenerCuentaSegura(cuenta);
}

module.exports = {
  crearCuenta,
  existeCorreoEnOtraCuenta,
  obtenerCuentaPorCorreo,
  obtenerCuentaSegura,
  validarCorreoDisponible
};
