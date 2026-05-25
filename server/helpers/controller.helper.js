function asyncHandler(controller) {
  return (req, res, next) => Promise.resolve(controller(req, res, next)).catch(next);
}

function responderExito(res, statusCode, message, data) {
  return res.status(statusCode).json({
    ok: true,
    message,
    data
  });
}

function validarPeticion(errores) {
  if (!errores || errores.length === 0) {
    return;
  }

  const error = new Error('La solicitud no es valida. Revise los datos enviados.');
  error.code = 'VALIDATION_ERROR';
  error.statusCode = 400;
  error.errores = errores;
  throw error;
}

function obtenerIdCuenta(req, tipoCuenta, campoId, codigoError) {
  if (req.auth?.tipo_cuenta !== tipoCuenta || !req.auth?.[campoId]) {
    const error = new Error();
    error.code = codigoError;
    throw error;
  }

  return req.auth[campoId];
}

module.exports = {
  asyncHandler,
  responderExito,
  validarPeticion,
  obtenerIdCuenta
};
