const express = require('express');
const router = express.Router();
const categoriaServicioController = require('../../controllers/categoria_servicio/categoria_servicio.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');
const { verificarAdministrador } = require('../../middlewares/admin.middleware');

router.get('/obtenercategorias', categoriaServicioController.obtenerCategorias);
router.get('/obtenercategoria/:id', categoriaServicioController.obtenerCategoriaPorId);
router.post('/crearcategoria', verificarToken, verificarAdministrador, categoriaServicioController.crearCategoria);
router.put('/actualizarcategoria/:id', verificarToken, verificarAdministrador, categoriaServicioController.actualizarCategoria);
router.patch('/actualizarestadocategoria/:id', verificarToken, verificarAdministrador, categoriaServicioController.actualizarEstadoCategoria);

module.exports = router;
