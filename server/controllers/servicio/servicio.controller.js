const servicioService = require('../../services/servicio/servicio.service');
const {
  validarCrearServicio,
  validarIdServicio,
  validarActualizarServicio,
  validarActualizarEstadoServicio
} = require('../../validators/servicio/servicio.validator');
const {
  asyncHandler,
  responderExito,
  validarPeticion,
  obtenerIdCuenta
} = require('../../helpers/controller.helper');

function obtenerIdProfesionalToken(req) {
  return obtenerIdCuenta(req, 'profesional', 'id_profesional', 'ONLY_PROFESSIONAL_ACCOUNT');
}

async function crearServicio(req, res) {
  const id_profesional = obtenerIdProfesionalToken(req);
  const { errores, data } = validarCrearServicio(req.body);
  validarPeticion(errores);

  const servicio = await servicioService.crearServicio(id_profesional, data);

  return responderExito(res, 201, 'Servicio creado correctamente', servicio);
}

async function listarServicios(req, res) {
  const servicios = await servicioService.listarServicios();

  return responderExito(res, 200, 'Servicios obtenidos correctamente', servicios);
}

async function obtenerServicioPorId(req, res) {
  const { errores, idServicio } = validarIdServicio(req.params.id);
  validarPeticion(errores);

  const servicio = await servicioService.obtenerServicioPorId(idServicio);

  return responderExito(res, 200, 'Servicio obtenido correctamente', servicio);
}

async function listarMisServicios(req, res) {
  const id_profesional = obtenerIdProfesionalToken(req);
  const servicios = await servicioService.listarMisServicios(id_profesional);

  return responderExito(res, 200, 'Servicios del profesional obtenidos correctamente', servicios);
}

async function actualizarServicio(req, res) {
  const id_profesional = obtenerIdProfesionalToken(req);
  const validacionId = validarIdServicio(req.params.id);
  validarPeticion(validacionId.errores);

  const { errores, data } = validarActualizarServicio(req.body);
  validarPeticion(errores);

  const servicio = await servicioService.actualizarServicio(
    id_profesional,
    validacionId.idServicio,
    data
  );

  return responderExito(res, 200, 'Servicio actualizado correctamente', servicio);
}

async function actualizarEstadoServicio(req, res) {
  const id_profesional = obtenerIdProfesionalToken(req);
  const validacionId = validarIdServicio(req.params.id);
  validarPeticion(validacionId.errores);

  const { errores, data } = validarActualizarEstadoServicio(req.body);
  validarPeticion(errores);

  const servicio = await servicioService.actualizarEstadoServicio(
    id_profesional,
    validacionId.idServicio,
    data.estado
  );

  return responderExito(res, 200, 'Estado del servicio actualizado correctamente', servicio);
}

module.exports = {
  crearServicio: asyncHandler(crearServicio),
  listarServicios: asyncHandler(listarServicios),
  obtenerServicioPorId: asyncHandler(obtenerServicioPorId),
  listarMisServicios: asyncHandler(listarMisServicios),
  actualizarServicio: asyncHandler(actualizarServicio),
  actualizarEstadoServicio: asyncHandler(actualizarEstadoServicio)
};
