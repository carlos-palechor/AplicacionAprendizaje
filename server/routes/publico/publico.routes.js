const express = require('express');
const router = express.Router();
const publicoController = require('../../controllers/publico/publico.controller');

router.get('/estadisticas', publicoController.obtenerEstadisticas);
router.get('/categorias', publicoController.obtenerCategorias);
router.get('/servicios-destacados', publicoController.obtenerServiciosDestacados);
router.get('/profesionales-destacados', publicoController.obtenerProfesionalesDestacados);

module.exports = router;
