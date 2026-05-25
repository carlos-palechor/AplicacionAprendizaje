const profesionalService = require('../../services/profesional/profesional.service');
const {
  validarPerfilProfesional
} = require('../../validators/profesional/profesional.validator');
const {
  asyncHandler,
  responderExito,
  validarPeticion,
  obtenerIdCuenta
} = require('../../helpers/controller.helper');

function obtenerIdProfesionalToken(req) {
  return obtenerIdCuenta(req, 'profesional', 'id_profesional', 'ONLY_PROFESSIONAL_ACCOUNT');
}

async function obtenerPerfilProfesional(req, res) {
  const id_profesional = obtenerIdProfesionalToken(req);
  const perfil = await profesionalService.obtenerPerfilProfesional(id_profesional);

  return responderExito(res, 200, 'Perfil profesional obtenido correctamente', perfil);
}

async function actualizarPerfilProfesional(req, res) {
  const id_profesional = obtenerIdProfesionalToken(req);
  const { errores, data } = validarPerfilProfesional(req.body);
  validarPeticion(errores);

  const perfil = await profesionalService.actualizarPerfilProfesional(id_profesional, data);

  return responderExito(res, 200, 'Perfil profesional actualizado correctamente', perfil);
}

module.exports = {
  obtenerPerfilProfesional: asyncHandler(obtenerPerfilProfesional),
  actualizarPerfilProfesional: asyncHandler(actualizarPerfilProfesional)
};
