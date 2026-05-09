const express = require('express');
const router = express.Router();
const profesionalController = require('../../controllers/profesional/profesional.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');

router.get('/obtenerprofesional', verificarToken, profesionalController.obtenerPerfilProfesional);
router.put('/actualizarprofesional', verificarToken, profesionalController.actualizarPerfilProfesional);

module.exports = router;
