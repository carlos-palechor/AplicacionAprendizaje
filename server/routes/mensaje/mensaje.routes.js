const express = require('express');
const router = express.Router();
const mensajeController = require('../../controllers/mensaje/mensaje.controller');
const { verificarToken } = require('../../middlewares/jwt.middleware');

router.post('/enviarmensaje', verificarToken, mensajeController.enviarMensaje);
router.get('/listarmensajes/:id_solicitud', verificarToken, mensajeController.listarMensajesPorSolicitud);

module.exports = router;
