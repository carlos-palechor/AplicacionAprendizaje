const categoriaService = require('../../services/categoria/categoria.service');
const {
  validarIdCategoria,
  validarCrearCategoria,
  validarActualizarCategoria,
  validarActualizarEstadoCategoria
} = require('../../validators/categoria/categoria.validator');
const {
  asyncHandler,
  responderExito,
  validarPeticion
} = require('../../helpers/controller.helper');

async function obtenerCategorias(req, res) {
  const categorias = await categoriaService.obtenerCategoriasDisponibles();

  return responderExito(res, 200, 'Categorias obtenidas correctamente', categorias);
}

async function obtenerCategoriaPorId(req, res) {
  const { errores, idCategoria } = validarIdCategoria(req.params.id);
  validarPeticion(errores);

  const categoria = await categoriaService.obtenerCategoriaPorId(idCategoria);

  return responderExito(res, 200, 'Categoria obtenida correctamente', categoria);
}

async function crearCategoria(req, res) {
  const { errores, data } = validarCrearCategoria(req.body);
  validarPeticion(errores);

  const categoria = await categoriaService.crearCategoria(data, req.auth.id_administrador);

  return responderExito(res, 201, 'Categoria creada correctamente', categoria);
}

async function actualizarCategoria(req, res) {
  const validacionId = validarIdCategoria(req.params.id);
  validarPeticion(validacionId.errores);

  const { errores, data } = validarActualizarCategoria(req.body);
  validarPeticion(errores);

  const categoria = await categoriaService.actualizarCategoria(validacionId.idCategoria, data);

  return responderExito(res, 200, 'Categoria actualizada correctamente', categoria);
}

async function actualizarEstadoCategoria(req, res) {
  const validacionId = validarIdCategoria(req.params.id);
  validarPeticion(validacionId.errores);

  const { errores, data } = validarActualizarEstadoCategoria(req.body);
  validarPeticion(errores);

  const categoria = await categoriaService.actualizarEstadoCategoria(
    validacionId.idCategoria,
    data.estado
  );

  return responderExito(res, 200, 'Estado de categoria actualizado correctamente', categoria);
}

module.exports = {
  obtenerCategorias: asyncHandler(obtenerCategorias),
  obtenerCategoriaPorId: asyncHandler(obtenerCategoriaPorId),
  crearCategoria: asyncHandler(crearCategoria),
  actualizarCategoria: asyncHandler(actualizarCategoria),
  actualizarEstadoCategoria: asyncHandler(actualizarEstadoCategoria)
};
