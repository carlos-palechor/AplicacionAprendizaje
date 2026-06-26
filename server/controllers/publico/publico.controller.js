const publicoService = require('../../services/publico/publico.service');
const {
  asyncHandler,
  responderExito
} = require('../../helpers/controller.helper');

async function obtenerEstadisticas(req, res) {
  const estadisticas = await publicoService.obtenerEstadisticas();

  return responderExito(res, 200, 'Estadisticas publicas obtenidas correctamente', estadisticas);
}

async function obtenerCategorias(req, res) {
  const categorias = await publicoService.obtenerCategorias();

  return responderExito(res, 200, 'Categorias publicas obtenidas correctamente', categorias);
}

async function obtenerServiciosDestacados(req, res) {
  const servicios = await publicoService.obtenerServiciosDestacados();

  return responderExito(res, 200, 'Servicios destacados obtenidos correctamente', servicios);
}

async function obtenerProfesionalesDestacados(req, res) {
  const profesionales = await publicoService.obtenerProfesionalesDestacados();

  return responderExito(res, 200, 'Profesionales destacados obtenidos correctamente', profesionales);
}

module.exports = {
  obtenerEstadisticas: asyncHandler(obtenerEstadisticas),
  obtenerCategorias: asyncHandler(obtenerCategorias),
  obtenerServiciosDestacados: asyncHandler(obtenerServiciosDestacados),
  obtenerProfesionalesDestacados: asyncHandler(obtenerProfesionalesDestacados)
};
