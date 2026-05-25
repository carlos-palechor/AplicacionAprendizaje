const mensajeService = require('../../services/mensaje/mensaje.service');
const {
  validarEnviarMensaje,
  validarIdSolicitud
} = require('../../validators/mensaje/mensaje.validator');
const {
  asyncHandler,
  responderExito,
  validarPeticion
} = require('../../helpers/controller.helper');

async function enviarMensaje(req, res) {
  const { errores, data } = validarEnviarMensaje(req.body);
  validarPeticion(errores);

  const mensaje = await mensajeService.enviarMensaje(req.auth, data);

  return responderExito(res, 201, 'Mensaje enviado correctamente', mensaje);
}

async function listarMensajesPorSolicitud(req, res) {
  const { errores, idSolicitud } = validarIdSolicitud(req.params.id_solicitud);
  validarPeticion(errores);

  const mensajes = await mensajeService.listarMensajesPorSolicitud(req.auth, idSolicitud);

  return responderExito(res, 200, 'Mensajes obtenidos correctamente', mensajes);
}

module.exports = {
  enviarMensaje: asyncHandler(enviarMensaje),
  listarMensajesPorSolicitud: asyncHandler(listarMensajesPorSolicitud)
};
