function validarEnviarMensaje(data) {
  const errores = [];
  const body = data || {};
  const datosLimpios = {};

  const idSolicitud = Number(body.id_solicitud);
  if (!Number.isInteger(idSolicitud) || idSolicitud <= 0) {
    errores.push('El campo id_solicitud debe ser un numero entero positivo');
  } else {
    datosLimpios.id_solicitud = idSolicitud;
  }

  if (!body.mensaje || typeof body.mensaje !== 'string' || body.mensaje.trim() === '') {
    errores.push('El campo mensaje es obligatorio');
  } else {
    datosLimpios.mensaje = body.mensaje.trim();
  }

  if (body.id_estudiante !== undefined || body.id_profesional !== undefined || body.tipo_emisor !== undefined) {
    errores.push('No se permite enviar datos del emisor');
  }

  return {
    errores,
    data: datosLimpios
  };
}

function validarIdSolicitud(id) {
  const errores = [];
  const idSolicitud = Number(id);

  if (!Number.isInteger(idSolicitud) || idSolicitud <= 0) {
    errores.push('El id de la solicitud debe ser un numero entero positivo');
  }

  return {
    errores,
    idSolicitud
  };
}

module.exports = {
  validarEnviarMensaje,
  validarIdSolicitud
};
