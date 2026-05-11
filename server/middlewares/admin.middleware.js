function verificarAdministrador(req, res, next) {
  if (!req.auth || req.auth.id_rol !== 3) {
    return res.status(403).json({
      ok: false,
      message: 'Solo un administrador puede realizar esta accion'
    });
  }

  next();
}

module.exports = {
  verificarAdministrador
};
