const servicioService = require('../../services/servicio/servicio.service');
const {
  validarCrearServicio,
  validarIdServicio,
  validarActualizarServicio,
  validarActualizarEstadoServicio
} = require('../../validators/servicio/servicio.validator');

function manejarErrorServicio(error, res) {
  if (error.code === 'ONLY_PROFESSIONAL_ACCOUNT') {
    return res.status(403).json({
      ok: false,
      message: 'Solo una cuenta profesional puede crear servicios'
    });
  }

  if (error.code === 'PROFESSIONAL_NOT_FOUND') {
    return res.status(404).json({
      ok: false,
      message: 'Perfil profesional no encontrado'
    });
  }

  if (error.code === 'CATEGORY_NOT_FOUND') {
    return res.status(404).json({
      ok: false,
      message: 'Categoria no encontrada o inactiva'
    });
  }

  if (error.code === 'SERVICE_NOT_FOUND') {
    return res.status(404).json({
      ok: false,
      message: 'Servicio no encontrado'
    });
  }

  if (error.code === 'SERVICE_NOT_OWNER') {
    return res.status(403).json({
      ok: false,
      message: 'No puede actualizar un servicio que no le pertenece'
    });
  }

  console.error('Error en servicio:', {
    name: error.name,
    message: error.message,
    sqlMessage: error.original?.sqlMessage
  });

  return res.status(500).json({
    ok: false,
    message: 'Error interno del servidor'
  });
}

function obtenerIdProfesionalToken(req) {
  if (req.auth?.tipo_cuenta !== 'profesional' || !req.auth?.id_profesional) {
    const error = new Error();
    error.code = 'ONLY_PROFESSIONAL_ACCOUNT';
    throw error;
  }

  return req.auth.id_profesional;
}

async function crearServicio(req, res) {
  try {
    const id_profesional = obtenerIdProfesionalToken(req);
    const { errores, data } = validarCrearServicio(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const servicio = await servicioService.crearServicio(id_profesional, data);

    return res.status(201).json({
      ok: true,
      message: 'Servicio creado correctamente',
      data: servicio
    });
  } catch (error) {
    return manejarErrorServicio(error, res);
  }
}

async function listarServicios(req, res) {
  try {
    const servicios = await servicioService.listarServicios();

    return res.status(200).json({
      ok: true,
      message: 'Servicios obtenidos correctamente',
      data: servicios
    });
  } catch (error) {
    return manejarErrorServicio(error, res);
  }
}

async function obtenerServicioPorId(req, res) {
  try {
    const { errores, idServicio } = validarIdServicio(req.params.id);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const servicio = await servicioService.obtenerServicioPorId(idServicio);

    return res.status(200).json({
      ok: true,
      message: 'Servicio obtenido correctamente',
      data: servicio
    });
  } catch (error) {
    return manejarErrorServicio(error, res);
  }
}

async function listarMisServicios(req, res) {
  try {
    const id_profesional = obtenerIdProfesionalToken(req);
    const servicios = await servicioService.listarMisServicios(id_profesional);

    return res.status(200).json({
      ok: true,
      message: 'Servicios del profesional obtenidos correctamente',
      data: servicios
    });
  } catch (error) {
    return manejarErrorServicio(error, res);
  }
}

async function actualizarServicio(req, res) {
  try {
    const id_profesional = obtenerIdProfesionalToken(req);
    const validacionId = validarIdServicio(req.params.id);

    if (validacionId.errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores: validacionId.errores
      });
    }

    const { errores, data } = validarActualizarServicio(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const servicio = await servicioService.actualizarServicio(
      id_profesional,
      validacionId.idServicio,
      data
    );

    return res.status(200).json({
      ok: true,
      message: 'Servicio actualizado correctamente',
      data: servicio
    });
  } catch (error) {
    return manejarErrorServicio(error, res);
  }
}

async function actualizarEstadoServicio(req, res) {
  try {
    const id_profesional = obtenerIdProfesionalToken(req);
    const validacionId = validarIdServicio(req.params.id);

    if (validacionId.errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores: validacionId.errores
      });
    }

    const { errores, data } = validarActualizarEstadoServicio(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const servicio = await servicioService.actualizarEstadoServicio(
      id_profesional,
      validacionId.idServicio,
      data.estado
    );

    return res.status(200).json({
      ok: true,
      message: 'Estado del servicio actualizado correctamente',
      data: servicio
    });
  } catch (error) {
    return manejarErrorServicio(error, res);
  }
}

module.exports = {
  crearServicio,
  listarServicios,
  obtenerServicioPorId,
  listarMisServicios,
  actualizarServicio,
  actualizarEstadoServicio
};
