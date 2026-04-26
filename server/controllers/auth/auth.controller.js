const authService = require('../../services/auth/auth.service');
const {
  validarRegistro,
  validarLogin
} = require('../../validators/auth/auth.validator');

//controller Resgistar
async function registrar(req, res) {
  try {
    const errores = validarRegistro(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const usuario = await authService.registrarUsuario(req.body);

    return res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente',
      data: usuario
    });

  } catch (error) {

    if (error.code === 'EMAIL_EXISTS') {
      return res.status(409).json({
        ok: false,
        message: 'El correo ya está registrado'
      });
    }
    if (error.code === 'DEFAULT_ROLE_NOT_FOUND') {
      return res.status(500).json({
        ok: false,
        message: 'No existe el rol por defecto para registrar usuarios'
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
}

//controller Login
async function login(req, res) {
  try {
    const errores = validarLogin(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const resultado = await authService.loginUsuario(req.body);

    return res.status(200).json({
      ok: true,
      message: 'Inicio de sesión exitoso',
      data: resultado
    });

  } catch (error) {

    if (error.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        ok: false,
        message: 'Correo o contraseña incorrectos'
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
        message: 'Configuración JWT no definida'
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
}


module.exports = {
  registrar,
  login
};
