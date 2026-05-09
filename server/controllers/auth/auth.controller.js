const authService = require('../../services/auth/auth.service');
const {
  validarRegistroAuth,
  validarLoginAuth
} = require('../../validators/auth/auth.validator');

function manejarErrorAuth(error, res) {
  if (error.code === 'EMAIL_EXISTS') {
    return res.status(409).json({
      ok: false,
      message: 'El correo ya esta registrado'
    });
  }

  if (error.code === 'ROLE_NOT_FOUND') {
    return res.status(500).json({
      ok: false,
      message: error.authMessage || 'No se encontro el rol en la base de datos'
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
      message: error.authMessage || 'Este endpoint no permite este tipo de cuenta'
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

  if (error.code === 'TIPO_CUENTA_NO_VALIDO') {
    return res.status(400).json({
      ok: false,
      message: 'Tipo de cuenta no valido. Use estudiante o profesional'
    });
  }

  console.error('Error en auth:', {
    code: error.code,
    name: error.name,
    message: error.message,
    sqlMessage: error.original?.sqlMessage
  });

  return res.status(500).json({
    ok: false,
    message: 'Error interno del servidor'
  });
}

async function registrar(req, res) {
  try {
    const errores = validarRegistroAuth(req.params.tipoCuenta, req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const resultado = await authService.registrar(req.params.tipoCuenta, req.body);

    return res.status(201).json({
      ok: true,
      message: resultado.message,
      data: resultado.data
    });
  } catch (error) {
    return manejarErrorAuth(error, res);
  }
}

async function login(req, res) {
  try {
    const errores = validarLoginAuth(req.params.tipoCuenta, req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const resultado = await authService.login(req.params.tipoCuenta, req.body);

    return res.status(200).json({
      ok: true,
      message: resultado.message,
      data: resultado.data
    });
  } catch (error) {
    return manejarErrorAuth(error, res);
  }
}

module.exports = {
  registrar,
  login
};
