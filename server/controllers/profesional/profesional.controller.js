const profesionalService = require('../../services/profesional/profesional.service');
const {
  validarRegistroProfesional,
  validarLoginProfesional,
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
      message: 'El usuario no se encuentra activo'
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
      message: 'Usuario no encontrado'
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

async function registrar(req, res) {
  try {
    const errores = validarRegistroProfesional(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const profesional = await profesionalService.registrarProfesional(req.body);

    return res.status(201).json({
      ok: true,
      message: 'Profesional registrado correctamente',
      data: profesional
    });
  } catch (error) {
    return manejarErrorProfesional(error, res);
  }
}

async function login(req, res) {
  try {
    const errores = validarLoginProfesional(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const resultado = await profesionalService.loginProfesional(req.body);

    return res.status(200).json({
      ok: true,
      message: 'Inicio de sesion exitoso',
      data: resultado
    });
  } catch (error) {
    return manejarErrorProfesional(error, res);
  }
}

async function obtenerPerfilProfesional(req, res) {
  try {
    const { id_usuario } = req.usuario;
    const perfil = await profesionalService.obtenerPerfilProfesional(id_usuario);

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
    const { id_usuario } = req.usuario;
    const { errores, data } = validarPerfilProfesional(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const perfil = await profesionalService.actualizarPerfilProfesional(id_usuario, data);

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
  registrar,
  login,
  obtenerPerfilProfesional,
  actualizarPerfilProfesional
};
