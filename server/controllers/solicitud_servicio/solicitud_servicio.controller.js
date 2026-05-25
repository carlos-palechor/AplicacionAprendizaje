const solicitudServicioService = require('../../services/solicitud_servicio/solicitud_servicio.service');
const {
  validarCrearSolicitud,
  validarIdSolicitud,
  validarActualizarEstadoSolicitud
} = require('../../validators/solicitud_servicio/solicitud_servicio.validator');
const {
  asyncHandler,
  responderExito,
  validarPeticion,
  obtenerIdCuenta
} = require('../../helpers/controller.helper');

function obtenerIdEstudianteToken(req) {
  return obtenerIdCuenta(req, 'estudiante', 'id_estudiante', 'ONLY_STUDENT_ACCOUNT');
}

function obtenerIdProfesionalToken(req) {
  return obtenerIdCuenta(req, 'profesional', 'id_profesional', 'ONLY_PROFESSIONAL_ACCOUNT');
}

async function crearSolicitud(req, res) {
  const id_estudiante = obtenerIdEstudianteToken(req);
  const { errores, data } = validarCrearSolicitud(req.body);
  validarPeticion(errores);

  const solicitud = await solicitudServicioService.crearSolicitud(id_estudiante, data);

  return responderExito(res, 201, 'Solicitud creada correctamente', solicitud);
}

async function listarMisSolicitudes(req, res) {
  const id_estudiante = obtenerIdEstudianteToken(req);
  const solicitudes = await solicitudServicioService.listarMisSolicitudes(id_estudiante);

  return responderExito(res, 200, 'Solicitudes del estudiante obtenidas correctamente', solicitudes);
}

async function listarSolicitudesRecibidas(req, res) {
  const id_profesional = obtenerIdProfesionalToken(req);
  const solicitudes = await solicitudServicioService.listarSolicitudesRecibidas(id_profesional);

  return responderExito(res, 200, 'Solicitudes recibidas obtenidas correctamente', solicitudes);
}

async function obtenerDetalleSolicitud(req, res) {
  const { errores, idSolicitud } = validarIdSolicitud(req.params.id);
  validarPeticion(errores);

  const solicitud = await solicitudServicioService.obtenerDetalleSolicitud(idSolicitud, req.auth);

  return responderExito(res, 200, 'Detalle de solicitud obtenido correctamente', solicitud);
}

async function actualizarEstadoSolicitudProfesional(req, res) {
  const id_profesional = obtenerIdProfesionalToken(req);
  const validacionId = validarIdSolicitud(req.params.id);
  validarPeticion(validacionId.errores);

  const { errores, data } = validarActualizarEstadoSolicitud(req.body);
  validarPeticion(errores);

  const solicitud = await solicitudServicioService.actualizarEstadoSolicitudProfesional(
    id_profesional,
    validacionId.idSolicitud,
    data.estado
  );

  return responderExito(res, 200, 'Estado de solicitud actualizado correctamente', solicitud);
}

async function cancelarSolicitudEstudiante(req, res) {
  const id_estudiante = obtenerIdEstudianteToken(req);
  const validacionId = validarIdSolicitud(req.params.id);
  validarPeticion(validacionId.errores);

  const solicitud = await solicitudServicioService.cancelarSolicitudEstudiante(
    id_estudiante,
    validacionId.idSolicitud
  );

  return responderExito(res, 200, 'Solicitud cancelada correctamente', solicitud);
}

module.exports = {
  crearSolicitud: asyncHandler(crearSolicitud),
  listarMisSolicitudes: asyncHandler(listarMisSolicitudes),
  listarSolicitudesRecibidas: asyncHandler(listarSolicitudesRecibidas),
  obtenerDetalleSolicitud: asyncHandler(obtenerDetalleSolicitud),
  actualizarEstadoSolicitudProfesional: asyncHandler(actualizarEstadoSolicitudProfesional),
  cancelarSolicitudEstudiante: asyncHandler(cancelarSolicitudEstudiante)
};
