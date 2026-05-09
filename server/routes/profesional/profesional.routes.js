const express = require('express');
const router = express.Router();
const profesionalController = require('../../controllers/profesional/profesional.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');

router.post('/register', profesionalController.registrar);
router.post('/login', profesionalController.login);
router.get('/perfil', verificarToken, profesionalController.obtenerPerfilProfesional);
router.put('/perfil', verificarToken, profesionalController.actualizarPerfilProfesional);

module.exports = router;
