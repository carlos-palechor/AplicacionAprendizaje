const express = require('express');
const router = express.Router();
const administradorController = require('../../controllers/administrador/administrador.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');
const { verificarAdministrador } = require('../../middlewares/admin.middleware');

router.get('/obteneradministrador', verificarToken, verificarAdministrador, administradorController.obtenerPerfil);
router.get('/listarcategorias', verificarToken, verificarAdministrador, administradorController.listarCategorias);
router.get('/listarmiscategorias', verificarToken, verificarAdministrador, administradorController.listarMisCategorias);

module.exports = router;
