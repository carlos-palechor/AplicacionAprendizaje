const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../../configs/database');
const { Profesional, Usuario, Rol } = require('../../models/associations');

function obtenerUsuarioSeguro(usuario) {
  const usuarioPlano = usuario.toJSON();
  delete usuarioPlano.contrasena;
  return usuarioPlano;
}

async function obtenerRolProfesional() {
  const rolProfesional = await Rol.findOne({
    where: { nombre_rol: 'profesional' }
  });

  if (!rolProfesional) {
    const error = new Error();
    error.code = 'ROLE_NOT_FOUND';
    throw error;
  }

  return rolProfesional;
}

async function registrarProfesional(data) {
  const { nombres, apellidos, correo, contrasena, telefono, foto_perfil } = data;

  const usuarioExistente = await Usuario.findOne({
    where: { correo }
  });

  if (usuarioExistente) {
    const error = new Error();
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const rolProfesional = await obtenerRolProfesional();
  const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

  return sequelize.transaction(async (transaction) => {
    const nuevoUsuario = await Usuario.create({
      nombres,
      apellidos,
      correo,
      contrasena: contrasenaHasheada,
      telefono: telefono || null,
      foto_perfil: foto_perfil || null,
      fecha_registro: new Date(),
      estado: 'activo',
      id_rol: rolProfesional.id_rol
    }, { transaction });

    await Profesional.create({
      id_usuario: nuevoUsuario.id_usuario,
      universidad: null,
      titulo_profesional: null,
      especializacion: null,
      descripcion_perfil: null,
      linkedin_url: null,
      disponibilidad: null,
      verificado: false
    }, { transaction });

    return obtenerUsuarioSeguro(nuevoUsuario);
  });
}

async function loginProfesional(data) {
  const { correo, contrasena } = data;

  const usuario = await Usuario.findOne({
    where: { correo },
    include: [{ model: Rol }]
  });

  if (!usuario) {
    const error = new Error();
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  if (!usuario.rol || usuario.rol.nombre_rol !== 'profesional') {
    const error = new Error();
    error.code = 'ROLE_NOT_ALLOWED';
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
      id_rol: usuario.id_rol,
      nombre_rol: usuario.rol.nombre_rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    usuario: obtenerUsuarioSeguro(usuario),
    token
  };
}

async function validarUsuarioProfesional(id_usuario) {
  const usuario = await Usuario.findByPk(id_usuario, {
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

  if (!usuario.rol || usuario.rol.nombre_rol !== 'profesional') {
    const error = new Error();
    error.code = 'ONLY_PROFESSIONAL_ACCOUNT';
    throw error;
  }

  return usuario;
}

async function obtenerPerfilProfesional(id_usuario) {
  await validarUsuarioProfesional(id_usuario);

  const profesional = await Profesional.findOne({
    where: { id_usuario },
    include: [
      {
        model: Usuario,
        attributes: { exclude: ['contrasena'] },
        include: [
          {
            model: Rol,
            attributes: ['id_rol', 'nombre_rol']
          }
        ]
      }
    ]
  });

  if (!profesional) {
    const error = new Error();
    error.code = 'PROFESSIONAL_PROFILE_NOT_FOUND';
    throw error;
  }

  return profesional;
}

async function actualizarPerfilProfesional(id_usuario, data) {
  await validarUsuarioProfesional(id_usuario);

  const profesional = await obtenerPerfilProfesional(id_usuario);

  const datosPermitidos = {};
  const camposPermitidos = [
    'universidad',
    'titulo_profesional',
    'especializacion',
    'descripcion_perfil',
    'linkedin_url',
    'disponibilidad'
  ];

  camposPermitidos.forEach((campo) => {
    if (data[campo] !== undefined) {
      datosPermitidos[campo] = data[campo];
    }
  });

  await profesional.update(datosPermitidos);

  return profesional;
}

module.exports = {
  registrarProfesional,
  loginProfesional,
  obtenerPerfilProfesional,
  actualizarPerfilProfesional
};
