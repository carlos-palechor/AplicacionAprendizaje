const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../../models/associations');

function obtenerUsuarioSeguro(usuario) {
  const usuarioPlano = usuario.toJSON();
  delete usuarioPlano.contrasena;
  return usuarioPlano;
}

//registrar Usuario
async function registrarUsuario(data) {
  const {
    nombres,apellidos,correo,contrasena,telefono,foto_perfil} = data;

  const usuarioExistente = await Usuario.findOne({where: { correo }
  });
  if (usuarioExistente) {
    const error = new Error();
    error.code = 'EMAIL_EXISTS';
    throw error;
  }
  const rolUsuario = await Rol.findOne({
    where: { nombre_rol: 'usuario' }
  });
  if (!rolUsuario) {
    const error = new Error();
    error.code = 'DEFAULT_ROLE_NOT_FOUND';
    throw error;
  }

  const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

  const nuevoUsuario = await Usuario.create({
    nombres,apellidos,correo,
    contrasena: contrasenaHasheada,
    telefono: telefono || null,
    foto_perfil: foto_perfil || null,
    fecha_registro: new Date(),
    estado: 'activo',
     id_rol: rolUsuario.id_rol
  });
  return obtenerUsuarioSeguro(nuevoUsuario);
}
//Login Usuario
async function loginUsuario(data) {
  const { correo, contrasena } = data;

  const usuario = await Usuario.findOne({
    where: { correo },
    include: [{model: Rol}]});

  if (!usuario) {
    const error = new Error();
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  if (usuario.estado !== 'activo') {
    const error = new Error();
    error.code = 'USER_INACTIVE';
    throw error;
  }

  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

  if (!contrasenaValida) {
    const error = new Error();
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    const error = new Error();
    error.code = 'JWT_SECRET_NOT_DEFINED';
    throw error;
  }

  const token = jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      correo: usuario.correo,
      id_rol: usuario.id_rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  return {
    usuario: obtenerUsuarioSeguro(usuario),
    token
  };
}

module.exports = {
  registrarUsuario,
  loginUsuario
};
