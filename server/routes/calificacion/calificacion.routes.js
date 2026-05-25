const express = require('express');
const router = express.Router();
const calificacionController = require('../../controllers/calificacion/calificacion.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');
const { verificarEstudiante } = require('../../middlewares/estudiante.middleware');

router.post('/crearcalificacion', verificarToken, verificarEstudiante, calificacionController.crearCalificacion);
router.get('/listarcalificaciones/:id_servicio', calificacionController.listarCalificacionesPorServicio);
router.get('/reputacionprofesional/:id_profesional', calificacionController.obtenerReputacionProfesional);

module.exports = router;
