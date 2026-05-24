const solicitudServicioService = require('../../services/solicitud_servicio/solicitud_servicio.service');
const {
  validarCrearSolicitud,
  validarIdSolicitud,
  validarActualizarEstadoSolicitud
} = require('../../validators/solicitud_servicio/solicitud_servicio.validator');

function manejarErrorSolicitudServicio(error, res) {
  if (error.code === 'ONLY_STUDENT_ACCOUNT') {
    return res.status(403).json({
      ok: false,
      message: 'Solo un estudiante puede crear solicitudes'
    });
  }

  if (error.code === 'STUDENT_NOT_FOUND') {
    return res.status(404).json({
      ok: false,
      message: 'Estudiante no encontrado'
    });
  }

  if (error.code === 'ONLY_PROFESSIONAL_ACCOUNT') {
    return res.status(403).json({
      ok: false,
      message: 'Solo un profesional puede consultar estas solicitudes'
    });
  }

  if (error.code === 'PROFESSIONAL_NOT_FOUND') {
    return res.status(404).json({
      ok: false,
      message: 'Profesional no encontrado'
    });
  }

  if (error.code === 'SERVICE_NOT_FOUND') {
    return res.status(404).json({
      ok: false,
      message: 'Servicio no encontrado o inactivo'
    });
  }

  if (error.code === 'REQUEST_NOT_FOUND') {
    return res.status(404).json({
      ok: false,
      message: 'Solicitud no encontrada'
    });
  }

  if (error.code === 'REQUEST_ACCESS_DENIED') {
    return res.status(403).json({
      ok: false,
      message: 'No tiene permisos para consultar esta solicitud'
    });
  }

  if (error.code === 'INVALID_REQUEST_STATUS_TRANSITION') {
    return res.status(400).json({
      ok: false,
      message: 'Cambio de estado no permitido'
    });
  }

  console.error('Error en solicitud_servicio:', {
    name: error.name,
    message: error.message,
    sqlMessage: error.original?.sqlMessage
  });

  return res.status(500).json({
    ok: false,
    message: 'Error interno del servidor'
  });
}

function obtenerIdEstudianteToken(req) {
  if (req.auth?.tipo_cuenta !== 'estudiante' || !req.auth?.id_estudiante) {
    const error = new Error();
    error.code = 'ONLY_STUDENT_ACCOUNT';
    throw error;
  }

  return req.auth.id_estudiante;
}

function obtenerIdProfesionalToken(req) {
  if (req.auth?.tipo_cuenta !== 'profesional' || !req.auth?.id_profesional) {
    const error = new Error();
    error.code = 'ONLY_PROFESSIONAL_ACCOUNT';
    throw error;
  }

  return req.auth.id_profesional;
}

async function crearSolicitud(req, res) {
  try {
    const id_estudiante = obtenerIdEstudianteToken(req);
    const { errores, data } = validarCrearSolicitud(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const solicitud = await solicitudServicioService.crearSolicitud(id_estudiante, data);

    return res.status(201).json({
      ok: true,
      message: 'Solicitud creada correctamente',
      data: solicitud
    });
  } catch (error) {
    return manejarErrorSolicitudServicio(error, res);
  }
}

async function listarMisSolicitudes(req, res) {
  try {
    const id_estudiante = obtenerIdEstudianteToken(req);
    const solicitudes = await solicitudServicioService.listarMisSolicitudes(id_estudiante);

    return res.status(200).json({
      ok: true,
      message: 'Solicitudes del estudiante obtenidas correctamente',
      data: solicitudes
    });
  } catch (error) {
    return manejarErrorSolicitudServicio(error, res);
  }
}

async function listarSolicitudesRecibidas(req, res) {
  try {
    const id_profesional = obtenerIdProfesionalToken(req);
    const solicitudes = await solicitudServicioService.listarSolicitudesRecibidas(id_profesional);

    return res.status(200).json({
      ok: true,
      message: 'Solicitudes recibidas obtenidas correctamente',
      data: solicitudes
    });
  } catch (error) {
    return manejarErrorSolicitudServicio(error, res);
  }
}

async function obtenerDetalleSolicitud(req, res) {
  try {
    const { errores, idSolicitud } = validarIdSolicitud(req.params.id);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const solicitud = await solicitudServicioService.obtenerDetalleSolicitud(idSolicitud, req.auth);

    return res.status(200).json({
      ok: true,
      message: 'Detalle de solicitud obtenido correctamente',
      data: solicitud
    });
  } catch (error) {
    return manejarErrorSolicitudServicio(error, res);
  }
}

async function actualizarEstadoSolicitudProfesional(req, res) {
  try {
    const id_profesional = obtenerIdProfesionalToken(req);
    const validacionId = validarIdSolicitud(req.params.id);

    if (validacionId.errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores: validacionId.errores
      });
    }

    const { errores, data } = validarActualizarEstadoSolicitud(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const solicitud = await solicitudServicioService.actualizarEstadoSolicitudProfesional(
      id_profesional,
      validacionId.idSolicitud,
      data.estado
    );

    return res.status(200).json({
      ok: true,
      message: 'Estado de solicitud actualizado correctamente',
      data: solicitud
    });
  } catch (error) {
    return manejarErrorSolicitudServicio(error, res);
  }
}

async function cancelarSolicitudEstudiante(req, res) {
  try {
    const id_estudiante = obtenerIdEstudianteToken(req);
    const validacionId = validarIdSolicitud(req.params.id);

    if (validacionId.errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores: validacionId.errores
      });
    }

    const solicitud = await solicitudServicioService.cancelarSolicitudEstudiante(
      id_estudiante,
      validacionId.idSolicitud
    );

    return res.status(200).json({
      ok: true,
      message: 'Solicitud cancelada correctamente',
      data: solicitud
    });
  } catch (error) {
    return manejarErrorSolicitudServicio(error, res);
  }
}

module.exports = {
  crearSolicitud,
  listarMisSolicitudes,
  listarSolicitudesRecibidas,
  obtenerDetalleSolicitud,
  actualizarEstadoSolicitudProfesional,
  cancelarSolicitudEstudiante
};
