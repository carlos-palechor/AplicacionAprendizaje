const express = require('express');
const router = express.Router();
const solicitudServicioController = require('../../controllers/solicitud_servicio/solicitud_servicio.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');
const { verificarEstudiante } = require('../../middlewares/estudiante.middleware');
const { verificarProfesional } = require('../../middlewares/profesional.middleware');

router.post('/crearsolicitud', verificarToken, verificarEstudiante, solicitudServicioController.crearSolicitud);
router.get('/listarmissolicitudes', verificarToken, verificarEstudiante, solicitudServicioController.listarMisSolicitudes);
router.get('/listarsolicitudesrecibidas', verificarToken, verificarProfesional, solicitudServicioController.listarSolicitudesRecibidas);
router.get('/detallesolicitud/:id', verificarToken, solicitudServicioController.obtenerDetalleSolicitud);
router.patch('/actualizarestadosolicitud/:id', verificarToken, verificarProfesional, solicitudServicioController.actualizarEstadoSolicitudProfesional);
router.patch('/cancelarsolicitud/:id', verificarToken, verificarEstudiante, solicitudServicioController.cancelarSolicitudEstudiante);

module.exports = router;
