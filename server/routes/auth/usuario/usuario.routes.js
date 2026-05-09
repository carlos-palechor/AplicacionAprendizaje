const express = require('express');
const router = express.Router();
const usuarioController = require('../../../controllers/usuario/usuario.controller');
const { verificarToken } = require('../../../middlewares/auth/jwt.middleware');

router.get('/perfil', verificarToken, usuarioController.obtenerPerfil);
router.put('/actulizarPerfil', verificarToken, usuarioController.actualizarPerfil);

module.exports = router;
