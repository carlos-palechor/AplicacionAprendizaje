const {
  Estudiante,
  Mensaje,
  Profesional,
  Servicio,
  SolicitudServicio
} = require('../../models/associations');

async function obtenerSolicitud(id_solicitud) {
  const solicitud = await SolicitudServicio.findByPk(id_solicitud, {
    include: [
      {
        model: Servicio,
        attributes: ['id_servicio', 'id_profesional']
      }
    ]
  });

  if (!solicitud) {
    const error = new Error();
    error.code = 'REQUEST_NOT_FOUND';
    throw error;
  }

  return solicitud;
}

async function validarEmisor(auth, solicitud) {
  if (auth?.tipo_cuenta === 'estudiante' && auth.id_estudiante) {
    const estudiante = await Estudiante.findByPk(auth.id_estudiante);

    if (!estudiante || solicitud.id_estudiante !== auth.id_estudiante) {
      const error = new Error();
      error.code = 'MESSAGE_ACCESS_DENIED';
      throw error;
    }

    return {
      tipo_emisor: 'estudiante',
      id_estudiante: auth.id_estudiante,
      id_profesional: null
    };
  }

  if (auth?.tipo_cuenta === 'profesional' && auth.id_profesional) {
    const profesional = await Profesional.findByPk(auth.id_profesional);

    if (!profesional || solicitud.servicio?.id_profesional !== auth.id_profesional) {
      const error = new Error();
      error.code = 'MESSAGE_ACCESS_DENIED';
      throw error;
    }

    return {
      tipo_emisor: 'profesional',
      id_estudiante: null,
      id_profesional: auth.id_profesional
    };
  }

  const error = new Error();
  error.code = 'MESSAGE_ACCESS_DENIED';
  throw error;
}

async function enviarMensaje(auth, data) {
  const solicitud = await obtenerSolicitud(data.id_solicitud);
  const emisor = await validarEmisor(auth, solicitud);

  return Mensaje.create({
    id_solicitud: data.id_solicitud,
    id_estudiante: emisor.id_estudiante,
    id_profesional: emisor.id_profesional,
    tipo_emisor: emisor.tipo_emisor,
    mensaje: data.mensaje,
    fecha_envio: new Date()
  });
}

async function listarMensajesPorSolicitud(auth, id_solicitud) {
  const solicitud = await obtenerSolicitud(id_solicitud);
  await validarEmisor(auth, solicitud);

  return Mensaje.findAll({
    where: {
      id_solicitud
    },
    attributes: [
      'id_mensaje',
      'id_solicitud',
      'id_estudiante',
      'id_profesional',
      'tipo_emisor',
      'mensaje',
      'fecha_envio'
    ],
    include: [
      {
        model: Estudiante,
        attributes: ['id_estudiante', 'nombres', 'apellidos', 'correo']
      },
      {
        model: Profesional,
        attributes: ['id_profesional', 'nombres', 'apellidos', 'correo']
      }
    ],
    order: [['fecha_envio', 'ASC']]
  });
}

module.exports = {
  enviarMensaje,
  listarMensajesPorSolicitud
};
