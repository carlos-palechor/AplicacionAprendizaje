const { CategoriaServicio } = require('../../models/associations');
const { Op } = require('sequelize');

async function obtenerCategoriasDisponibles() {
  return CategoriaServicio.findAll({
    where: {
      estado: 'activo'
    },
    attributes: ['id_categoria', 'nombre_categoria', 'descripcion', 'estado'],
    order: [['nombre_categoria', 'ASC']]
  });
}

async function obtenerCategoriaPorId(id_categoria) {
  const categoria = await CategoriaServicio.findOne({
    where: {
      id_categoria,
      estado: 'activo'
    },
    attributes: ['id_categoria', 'nombre_categoria', 'descripcion', 'estado']
  });

  if (!categoria) {
    const error = new Error();
    error.code = 'CATEGORY_NOT_FOUND';
    throw error;
  }

  return categoria;
}

async function crearCategoria(data) {
  const categoriaExistente = await CategoriaServicio.findOne({
    where: {
      nombre_categoria: data.nombre_categoria
    }
  });

  if (categoriaExistente) {
    const error = new Error();
    error.code = 'CATEGORY_EXISTS';
    throw error;
  }

  return CategoriaServicio.create({
    nombre_categoria: data.nombre_categoria,
    descripcion: data.descripcion,
    estado: data.estado || 'activo'
  });
}

async function actualizarCategoria(id_categoria, data) {
  const categoria = await CategoriaServicio.findByPk(id_categoria);

  if (!categoria) {
    const error = new Error();
    error.code = 'CATEGORY_NOT_FOUND';
    throw error;
  }

  if (data.nombre_categoria) {
    const categoriaExistente = await CategoriaServicio.findOne({
      where: {
        nombre_categoria: data.nombre_categoria,
        id_categoria: {
          [Op.ne]: id_categoria
        }
      }
    });

    if (categoriaExistente) {
      const error = new Error();
      error.code = 'CATEGORY_EXISTS';
      throw error;
    }
  }

  await categoria.update(data);

  return categoria;
}

async function actualizarEstadoCategoria(id_categoria, estado) {
  const categoria = await CategoriaServicio.findByPk(id_categoria);

  if (!categoria) {
    const error = new Error();
    error.code = 'CATEGORY_NOT_FOUND';
    throw error;
  }

  await categoria.update({ estado });

  return categoria;
}

module.exports = {
  obtenerCategoriasDisponibles,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  actualizarEstadoCategoria
};
