const estudianteService = require('../../services/estudiante/estudiante.service');
const {
  validarActualizarPerfil
} = require('../../validators/estudiante/estudiante.validator');
const {
  asyncHandler,
  responderExito,
  validarPeticion,
  obtenerIdCuenta
} = require('../../helpers/controller.helper');

function obtenerIdEstudianteToken(req) {
  return obtenerIdCuenta(req, 'estudiante', 'id_estudiante', 'STUDENT_NOT_FOUND');
}

async function obtenerPerfil(req, res) {
  const id_estudiante = obtenerIdEstudianteToken(req);
  const perfil = await estudianteService.obtenerPerfil(id_estudiante);

  return responderExito(res, 200, 'Perfil obtenido correctamente', perfil);
}

async function actualizarPerfil(req, res) {
  const id_estudiante = obtenerIdEstudianteToken(req);
  const { errores, data } = validarActualizarPerfil(req.body);
  validarPeticion(errores);

  const estudiante = await estudianteService.actualizarPerfilEstudiante(id_estudiante, data);

  return responderExito(res, 200, 'Perfil actualizado correctamente', estudiante);
}

module.exports = {
  obtenerPerfil: asyncHandler(obtenerPerfil),
  actualizarPerfil: asyncHandler(actualizarPerfil)
};
