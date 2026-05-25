const express = require('express');
const router = express.Router();
const servicioController = require('../../controllers/servicio/servicio.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');
const { verificarEstudiante } = require('../../middlewares/estudiante.middleware');
const { verificarProfesional } = require('../../middlewares/profesional.middleware');

router.get('/listarservicios', verificarToken, verificarEstudiante, servicioController.listarServicios);
router.get('/listarservicio/:id', servicioController.obtenerServicioPorId);
router.get('/listarmisservicios', verificarToken, verificarProfesional, servicioController.listarMisServicios);
router.post('/crearservicio', verificarToken, verificarProfesional, servicioController.crearServicio);
router.put('/actualizarservicio/:id', verificarToken, verificarProfesional, servicioController.actualizarServicio);
router.patch('/actualizarestadoservicio/:id', verificarToken, verificarProfesional, servicioController.actualizarEstadoServicio);

module.exports = router;
