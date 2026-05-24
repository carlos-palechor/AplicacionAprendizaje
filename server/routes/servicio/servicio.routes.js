const express = require('express');
const router = express.Router();
const servicioController = require('../../controllers/servicio/servicio.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');
const { verificarEstudiante } = require('../../middlewares/estudiante.middleware');

router.get('/listarservicios', verificarToken, verificarEstudiante, servicioController.listarServicios);
router.get('/listarservicio/:id', servicioController.obtenerServicioPorId);
router.get('/listarmisservicios', verificarToken, servicioController.listarMisServicios);
router.post('/crearservicio', verificarToken, servicioController.crearServicio);
router.put('/actualizarservicio/:id', verificarToken, servicioController.actualizarServicio);
router.patch('/actualizarestadoservicio/:id', verificarToken, servicioController.actualizarEstadoServicio);

module.exports = router;
