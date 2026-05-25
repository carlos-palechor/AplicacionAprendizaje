const calificacionService = require('../../services/calificacion/calificacion.service');
const {
  validarCrearCalificacion,
  validarIdServicio,
  validarIdProfesional
} = require('../../validators/calificacion/calificacion.validator');
const {
  asyncHandler,
  responderExito,
  validarPeticion,
  obtenerIdCuenta
} = require('../../helpers/controller.helper');

function obtenerIdEstudianteToken(req) {
  return obtenerIdCuenta(req, 'estudiante', 'id_estudiante', 'RATING_ACCESS_DENIED');
}

async function crearCalificacion(req, res) {
  const id_estudiante = obtenerIdEstudianteToken(req);
  const { errores, data } = validarCrearCalificacion(req.body);
  validarPeticion(errores);

  const calificacion = await calificacionService.crearCalificacion(id_estudiante, data);

  return responderExito(res, 201, 'Calificacion creada correctamente', calificacion);
}

async function listarCalificacionesPorServicio(req, res) {
  const { errores, idServicio } = validarIdServicio(req.params.id_servicio);
  validarPeticion(errores);

  const resultado = await calificacionService.listarCalificacionesPorServicio(idServicio);

  return responderExito(res, 200, 'Calificaciones del servicio obtenidas correctamente', resultado);
}

async function obtenerReputacionProfesional(req, res) {
  const { errores, idProfesional } = validarIdProfesional(req.params.id_profesional);
  validarPeticion(errores);

  const resultado = await calificacionService.obtenerReputacionProfesional(idProfesional);

  return responderExito(res, 200, 'Reputacion del profesional obtenida correctamente', resultado);
}

module.exports = {
  crearCalificacion: asyncHandler(crearCalificacion),
  listarCalificacionesPorServicio: asyncHandler(listarCalificacionesPorServicio),
  obtenerReputacionProfesional: asyncHandler(obtenerReputacionProfesional)
};
