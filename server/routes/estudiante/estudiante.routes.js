const express = require('express');
const router = express.Router();
const estudianteController = require('../../controllers/estudiante/estudiante.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');

router.get('/obtenerestudiante', verificarToken, estudianteController.obtenerPerfil);
router.put('/actualizarestudiante', verificarToken, estudianteController.actualizarPerfil);

module.exports = router;
