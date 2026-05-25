function verificarAdministrador(req, res, next) {
  if (!req.auth || req.auth.tipo_cuenta !== 'administrador' || req.auth.id_rol !== 3) {
    const error = new Error();
    error.code = 'ONLY_ADMIN_ACCOUNT';
    return next(error);
  }

  return next();
}

module.exports = {
  verificarAdministrador
};
