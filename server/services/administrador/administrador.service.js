const {
  Administrador,
  CategoriaServicio,
  Rol
} = require('../../models/associations');

async function obtenerPerfil(id_administrador) {
  const administrador = await Administrador.findByPk(id_administrador, {
    attributes: { exclude: ['contrasena'] },
    include: [
      {
        model: Rol,
        attributes: ['id_rol', 'nombre_rol']
      }
    ]
  });

  if (!administrador) {
    const error = new Error();
    error.code = 'ADMIN_NOT_FOUND';
    throw error;
  }

  return administrador;
}

async function listarCategorias(id_administrador) {
  await obtenerPerfil(id_administrador);

  return CategoriaServicio.findAll({
    attributes: ['id_categoria', 'nombre_categoria', 'descripcion', 'estado', 'creado_por_admin'],
    order: [['id_categoria', 'DESC']]
  });
}

async function listarMisCategorias(id_administrador) {
  await obtenerPerfil(id_administrador);

  return CategoriaServicio.findAll({
    where: {
      creado_por_admin: id_administrador
    },
    attributes: ['id_categoria', 'nombre_categoria', 'descripcion', 'estado', 'creado_por_admin'],
    order: [['id_categoria', 'DESC']]
  });
}

module.exports = {
  obtenerPerfil,
  listarCategorias,
  listarMisCategorias
};
