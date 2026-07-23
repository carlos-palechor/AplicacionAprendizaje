const { Administrador, Estudiante, Profesional } = require('../../models/associations');

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

module.exports = {
  TIPOS_CUENTA
};
