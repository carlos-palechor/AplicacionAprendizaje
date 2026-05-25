const express = require('express');
const router = express.Router();
const categoriaController = require('../../controllers/categoria/categoria.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');
const { verificarAdministrador } = require('../../middlewares/admin.middleware');

router.get('/obtenercategorias', categoriaController.obtenerCategorias);
router.get('/obtenercategoria/:id', categoriaController.obtenerCategoriaPorId);
router.post('/crearcategoria', verificarToken, verificarAdministrador, categoriaController.crearCategoria);
router.put('/actualizarcategoria/:id', verificarToken, verificarAdministrador, categoriaController.actualizarCategoria);
router.patch('/actualizarestadocategoria/:id', verificarToken, verificarAdministrador, categoriaController.actualizarEstadoCategoria);

module.exports = router;
