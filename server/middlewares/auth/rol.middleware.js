function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          ok: false,
          message: 'Usuario no autenticado'
        });
      }

      const rolUsuario = req.usuario.id_rol;

      if (!rolesPermitidos.includes(rolUsuario)) {
        return res.status(403).json({
          ok: false,
          message: 'No tiene permisos para acceder a este recurso'
        });
      }

      next();

    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: 'Error al validar permisos del usuario'
      });
    }
  };
}

module.exports = {
  verificarRol
};