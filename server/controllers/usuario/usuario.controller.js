const usuarioService = require('../../services/usuario/usuario.service');
const {
  validarActualizarPerfil
} = require('../../validators/auth/usuario/usuario.validator');

async function obtenerPerfil(req, res) {
  try {
    const { id_usuario } = req.usuario;

    const perfil = await usuarioService.obtenerPerfil(id_usuario);

    return res.status(200).json({
      ok: true,
      message: 'Perfil obtenido correctamente',
      data: perfil
    });
  } catch (error) {
    if (error.code === 'USER_NOT_FOUND') {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
}

async function actualizarPerfil(req, res) {
  try {
    const { id_usuario } = req.usuario;
    const { errores, data } = validarActualizarPerfil(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const usuario = await usuarioService.actualizarPerfilUsuario(id_usuario, data);

    return res.status(200).json({
      ok: true,
      message: 'Perfil actualizado correctamente',
      data: usuario
    });
  } catch (error) {
    if (error.code === 'USER_NOT_FOUND') {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
}

module.exports = {
  obtenerPerfil,
  actualizarPerfil
};
