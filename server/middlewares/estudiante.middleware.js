function verificarEstudiante(req, res, next) {
  if (!req.auth || req.auth.tipo_cuenta !== 'estudiante' || req.auth.id_rol !== 1) {
    return res.status(403).json({
      ok: false,
      message: 'Solo un estudiante puede realizar esta accion'
    });
  }

  next();
}

module.exports = {
  verificarEstudiante
};
