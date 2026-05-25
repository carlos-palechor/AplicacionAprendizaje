const express = require('express');
const router = express.Router();
const estudianteController = require('../../controllers/estudiante/estudiante.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');
const { verificarEstudiante } = require('../../middlewares/estudiante.middleware');

router.get('/obtenerestudiante', verificarToken, verificarEstudiante, estudianteController.obtenerPerfil);
router.put('/actualizarestudiante', verificarToken, verificarEstudiante, estudianteController.actualizarPerfil);

module.exports = router;
