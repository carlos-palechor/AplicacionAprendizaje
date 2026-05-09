const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/usuario/usuario.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');

router.post('/register', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.get('/perfil', verificarToken, usuarioController.obtenerPerfil);
router.put('/perfil', verificarToken, usuarioController.actualizarPerfil);

module.exports = router;
