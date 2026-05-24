const express = require('express');
const router = express.Router();
const solicitudServicioController = require('../../controllers/solicitud_servicio/solicitud_servicio.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');
const { verificarEstudiante } = require('../../middlewares/estudiante.middleware');

router.post('/crearsolicitud', verificarToken, verificarEstudiante, solicitudServicioController.crearSolicitud);
router.get('/listarmissolicitudes', verificarToken, verificarEstudiante, solicitudServicioController.listarMisSolicitudes);
router.get('/listarsolicitudesrecibidas', verificarToken, solicitudServicioController.listarSolicitudesRecibidas);
router.get('/detallesolicitud/:id', verificarToken, solicitudServicioController.obtenerDetalleSolicitud);
router.patch('/actualizarestadosolicitud/:id', verificarToken, solicitudServicioController.actualizarEstadoSolicitudProfesional);
router.patch('/cancelarsolicitud/:id', verificarToken, verificarEstudiante, solicitudServicioController.cancelarSolicitudEstudiante);

module.exports = router;
