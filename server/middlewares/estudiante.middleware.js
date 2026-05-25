function verificarEstudiante(req, res, next) {
  if (!req.auth || req.auth.tipo_cuenta !== 'estudiante' || req.auth.id_rol !== 1) {
    const error = new Error();
    error.code = 'ONLY_STUDENT_ACCOUNT';
    return next(error);
  }

  return next();
}

module.exports = {
  verificarEstudiante
};
