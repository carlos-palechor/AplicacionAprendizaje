const express = require('express');
const router = express.Router();
const servicioController = require('../../controllers/servicio/servicio.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');

router.post('/crearservicio', verificarToken, servicioController.crearServicio);

module.exports = router;
