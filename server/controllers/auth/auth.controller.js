const authService = require('../../services/auth/auth.service');
const {
  validarRegistroAuth,
  validarLoginAuth,
  validarGoogleAuth
} = require('../../validators/auth/auth.validator');
const {
  asyncHandler,
  responderExito,
  validarPeticion
} = require('../../helpers/controller.helper');

async function registrar(req, res) {
  const errores = validarRegistroAuth(req.params.tipoCuenta, req.body);
  validarPeticion(errores);

  const resultado = await authService.registrar(req.params.tipoCuenta, req.body);

  return responderExito(res, 201, resultado.message, resultado.data);
}

async function login(req, res) {
  const errores = validarLoginAuth(req.params.tipoCuenta, req.body);
  validarPeticion(errores);

  const resultado = await authService.login(req.params.tipoCuenta, req.body);

  return responderExito(res, 200, resultado.message, resultado.data);
}

async function google(req, res) {
  const errores = validarGoogleAuth(req.params.tipoCuenta, req.body);
  validarPeticion(errores);

  const resultado = await authService.google(req.params.tipoCuenta, req.body);

  return responderExito(res, resultado.statusCode, resultado.message, resultado.data);
}

module.exports = {
  registrar: asyncHandler(registrar),
  login: asyncHandler(login),
  google: asyncHandler(google)
};
