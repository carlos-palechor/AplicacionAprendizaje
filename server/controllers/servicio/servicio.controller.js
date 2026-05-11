const servicioService = require('../../services/servicio/servicio.service');
const {
  validarCrearServicio
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

module.exports = {
  crearServicio
};
