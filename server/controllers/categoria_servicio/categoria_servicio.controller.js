const categoriaServicioService = require('../../services/categoria_servicio/categoria_servicio.service');
const {
  validarIdCategoria,
  validarCrearCategoria,
  validarActualizarCategoria,
  validarActualizarEstadoCategoria
} = require('../../validators/categoria_servicio/categoria_servicio.validator');

function manejarErrorCategoriaServicio(error, res) {
  if (error.code === 'CATEGORY_EXISTS') {
    return res.status(409).json({
      ok: false,
      message: 'La categoria ya existe'
    });
  }

  if (error.code === 'CATEGORY_NOT_FOUND') {
    return res.status(404).json({
      ok: false,
      message: 'Categoria no encontrada'
    });
  }

  console.error('Error en categoria_servicio:', {
    name: error.name,
    message: error.message,
    sqlMessage: error.original?.sqlMessage
  });

  return res.status(500).json({
    ok: false,
    message: 'Error interno del servidor'
  });
}

async function obtenerCategorias(req, res) {
  try {
    const categorias = await categoriaServicioService.obtenerCategoriasDisponibles();

    return res.status(200).json({
      ok: true,
      message: 'Categorias obtenidas correctamente',
      data: categorias
    });
  } catch (error) {
    return manejarErrorCategoriaServicio(error, res);
  }
}

async function obtenerCategoriaPorId(req, res) {
  try {
    const { errores, idCategoria } = validarIdCategoria(req.params.id);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const categoria = await categoriaServicioService.obtenerCategoriaPorId(idCategoria);

    return res.status(200).json({
      ok: true,
      message: 'Categoria obtenida correctamente',
      data: categoria
    });
  } catch (error) {
    return manejarErrorCategoriaServicio(error, res);
  }
}

async function crearCategoria(req, res) {
  try {
    const { errores, data } = validarCrearCategoria(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const categoria = await categoriaServicioService.crearCategoria(data);

    return res.status(201).json({
      ok: true,
      message: 'Categoria creada correctamente',
      data: categoria
    });
  } catch (error) {
    return manejarErrorCategoriaServicio(error, res);
  }
}

async function actualizarCategoria(req, res) {
  try {
    const validacionId = validarIdCategoria(req.params.id);

    if (validacionId.errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores: validacionId.errores
      });
    }

    const { errores, data } = validarActualizarCategoria(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const categoria = await categoriaServicioService.actualizarCategoria(validacionId.idCategoria, data);

    return res.status(200).json({
      ok: true,
      message: 'Categoria actualizada correctamente',
      data: categoria
    });
  } catch (error) {
    return manejarErrorCategoriaServicio(error, res);
  }
}

async function actualizarEstadoCategoria(req, res) {
  try {
    const validacionId = validarIdCategoria(req.params.id);

    if (validacionId.errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores: validacionId.errores
      });
    }

    const { errores, data } = validarActualizarEstadoCategoria(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    const categoria = await categoriaServicioService.actualizarEstadoCategoria(
      validacionId.idCategoria,
      data.estado
    );

    return res.status(200).json({
      ok: true,
      message: 'Estado de categoria actualizado correctamente',
      data: categoria
    });
  } catch (error) {
    return manejarErrorCategoriaServicio(error, res);
  }
}

module.exports = {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  actualizarEstadoCategoria
};
