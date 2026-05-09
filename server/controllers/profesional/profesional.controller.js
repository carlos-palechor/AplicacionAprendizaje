const profesionalService = require('../../services/profesional/profesional.service');
const {
  validarPerfilProfesional
} = require('../../validators/profesional/profesional.validator');

function manejarErrorProfesional(error, res) {
  if (error.code === 'EMAIL_EXISTS') {
    return res.status(409).json({
      ok: false,
      message: 'El correo ya esta registrado'
    });
  }

  if (error.code === 'ROLE_NOT_FOUND') {
    return res.status(500).json({
      ok: false,
      message: 'No se encontro el rol profesional en la base de datos'
    });
  }

  if (error.code === 'INVALID_CREDENTIALS') {
    return res.status(401).json({
      ok: false,
      message: 'Correo o contrasena incorrectos'
    });
  }

  if (error.code === 'ROLE_NOT_ALLOWED') {
    return res.status(403).json({
      ok: false,
      message: 'Este endpoint solo permite cuentas profesionales'
    });
  }

  if (error.code === 'USER_INACTIVE') {
    return res.status(403).json({
      ok: false,
      message: 'La cuenta no se encuentra activa'
    });
  }

  if (error.code === 'JWT_SECRET_NOT_DEFINED') {
    return res.status(500).json({
      ok: false,
      message: 'Configuracion JWT no definida'
    });
  }

  if (error.code === 'USER_NOT_FOUND') {
    return res.status(404).json({
      ok: false,
      message: 'Profesional no encontrado'
    });
  }

  if (error.code === 'ONLY_PROFESSIONAL_ACCOUNT') {
    return res.status(403).json({
      ok: false,
      message: 'Solo una cuenta profesional puede gestionar un perfil profesional'
    });
  }

  if (error.code === 'PROFESSIONAL_PROFILE_NOT_FOUND') {
    return res.status(404).json({
      ok: false,
      message: 'Perfil profesional no encontrado'
    });
  }

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

async function obtenerPerfilProfesional(req, res) {
  try {
    const id_profesional = obtenerIdProfesionalToken(req);
    const perfil = await profesionalService.obtenerPerfilProfesional(id_profesional);

    return res.status(200).json({
      ok: true,
      message: 'Perfil profesional obtenido correctamente',
      data: perfil
    });
  } catch (error) {
    return manejarErrorProfesional(error, res);
  }
}

async function actualizarPerfilProfesional(req, res) {
  try {
    const id_profesional = obtenerIdProfesionalToken(req);
    const { errores, data } = validarPerfilProfesional(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const perfil = await profesionalService.actualizarPerfilProfesional(id_profesional, data);

    return res.status(200).json({
      ok: true,
      message: 'Perfil profesional actualizado correctamente',
      data: perfil
    });
  } catch (error) {
    return manejarErrorProfesional(error, res);
  }
}

module.exports = {
  obtenerPerfilProfesional,
  actualizarPerfilProfesional
};
