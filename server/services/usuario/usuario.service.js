const { Usuario, Rol } = require('../../models/associations');

async function obtenerPerfil(id_usuario) {
  const usuario = await Usuario.findByPk(id_usuario, {
    attributes: { exclude: ['contrasena'] },
    include: [
      {
        model: Rol,
        attributes: ['id_rol', 'nombre_rol']
      }
    ]
  });

  if (!usuario) {
    const error = new Error();
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  return usuario;
}

async function actualizarPerfilUsuario(id_usuario, data) {
  const usuario = await Usuario.findByPk(id_usuario);

  if (!usuario) {
    const error = new Error();
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  const datosPermitidos = {};
  const camposPermitidos = ['nombres', 'apellidos', 'telefono', 'foto_perfil'];

  camposPermitidos.forEach((campo) => {
    if (data[campo] !== undefined) {
      datosPermitidos[campo] = data[campo];
    }
  });

  await usuario.update(datosPermitidos);

  return obtenerPerfil(id_usuario);
}

module.exports = {
  obtenerPerfil,
  actualizarPerfilUsuario
};
