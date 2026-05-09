const estudianteService = require('../../services/estudiante/estudiante.service');
const {
  validarActualizarPerfil
} = require('../../validators/estudiante/estudiante.validator');

function manejarErrorEstudiante(error, res) {
  if (error.code === 'STUDENT_NOT_FOUND') {
    return res.status(404).json({
      ok: false,
      message: 'Estudiante no encontrado'
    });
  }

  return res.status(500).json({
    ok: false,
    message: 'Error interno del servidor'
  });
}

function obtenerIdEstudianteToken(req) {
  if (req.auth?.tipo_cuenta !== 'estudiante' || !req.auth?.id_estudiante) {
    const error = new Error();
    error.code = 'STUDENT_NOT_FOUND';
    throw error;
  }

  return req.auth.id_estudiante;
}

async function obtenerPerfil(req, res) {
  try {
    const id_estudiante = obtenerIdEstudianteToken(req);
    const perfil = await estudianteService.obtenerPerfil(id_estudiante);

    return res.status(200).json({
      ok: true,
      message: 'Perfil obtenido correctamente',
      data: perfil
    });
  } catch (error) {
    return manejarErrorEstudiante(error, res);
  }
}

async function actualizarPerfil(req, res) {
  try {
    const id_estudiante = obtenerIdEstudianteToken(req);
    const { errores, data } = validarActualizarPerfil(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const estudiante = await estudianteService.actualizarPerfilEstudiante(id_estudiante, data);

    return res.status(200).json({
      ok: true,
      message: 'Perfil actualizado correctamente',
      data: estudiante
    });
  } catch (error) {
    return manejarErrorEstudiante(error, res);
  }
}

module.exports = {
  obtenerPerfil,
  actualizarPerfil
};
