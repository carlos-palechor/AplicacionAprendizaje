const express = require('express');
const router = express.Router();
const profesionalController = require('../../controllers/profesional/profesional.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');
const { verificarProfesional } = require('../../middlewares/profesional.middleware');

router.get('/obtenerprofesional', verificarToken, verificarProfesional, profesionalController.obtenerPerfilProfesional);
router.put('/actualizarprofesional', verificarToken, verificarProfesional, profesionalController.actualizarPerfilProfesional);

module.exports = router;
