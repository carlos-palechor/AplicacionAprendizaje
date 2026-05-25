const administradorService = require('../../services/administrador/administrador.service');
const {
  asyncHandler,
  responderExito,
  obtenerIdCuenta
} = require('../../helpers/controller.helper');

function obtenerIdAdministradorToken(req) {
  return obtenerIdCuenta(req, 'administrador', 'id_administrador', 'ADMIN_NOT_FOUND');
}

async function obtenerPerfil(req, res) {
  const id_administrador = obtenerIdAdministradorToken(req);
  const administrador = await administradorService.obtenerPerfil(id_administrador);

  return responderExito(res, 200, 'Administrador obtenido correctamente', administrador);
}

async function listarCategorias(req, res) {
  const id_administrador = obtenerIdAdministradorToken(req);
  const categorias = await administradorService.listarCategorias(id_administrador);

  return responderExito(res, 200, 'Categorias obtenidas correctamente', categorias);
}

async function listarMisCategorias(req, res) {
  const id_administrador = obtenerIdAdministradorToken(req);
  const categorias = await administradorService.listarMisCategorias(id_administrador);

  return responderExito(res, 200, 'Categorias creadas por el administrador obtenidas correctamente', categorias);
}

module.exports = {
  obtenerPerfil: asyncHandler(obtenerPerfil),
  listarCategorias: asyncHandler(listarCategorias),
  listarMisCategorias: asyncHandler(listarMisCategorias)
};
