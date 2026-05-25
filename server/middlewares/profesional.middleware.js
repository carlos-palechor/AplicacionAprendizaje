function verificarProfesional(req, res, next) {
  if (!req.auth || req.auth.tipo_cuenta !== 'profesional' || req.auth.id_rol !== 2) {
    const error = new Error();
    error.code = 'ONLY_PROFESSIONAL_ACCOUNT';
    return next(error);
  }

  return next();
}

module.exports = {
  verificarProfesional
};
