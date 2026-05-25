const {
  Calificacion,
  Estudiante,
  Profesional,
  Servicio,
  SolicitudServicio
} = require('../../models/associations');

async function crearCalificacion(id_estudiante, data) {
  const solicitud = await SolicitudServicio.findByPk(data.id_solicitud);

  if (!solicitud) {
    const error = new Error();
    error.code = 'REQUEST_NOT_FOUND';
    throw error;
  }

  if (solicitud.id_estudiante !== id_estudiante) {
    const error = new Error();
    error.code = 'RATING_ACCESS_DENIED';
    throw error;
  }

  if (solicitud.estado !== 'finalizada') {
    const error = new Error();
    error.code = 'REQUEST_NOT_FINISHED';
    throw error;
  }

  const calificacionExistente = await Calificacion.findOne({
    where: {
      id_solicitud: data.id_solicitud
    }
  });

  if (calificacionExistente) {
    const error = new Error();
    error.code = 'RATING_ALREADY_EXISTS';
    throw error;
  }

  return Calificacion.create({
    id_solicitud: data.id_solicitud,
    puntuacion: data.puntuacion,
    comentario: data.comentario,
    fecha_calificacion: new Date()
  });
}

async function listarCalificacionesPorServicio(id_servicio) {
  const servicio = await Servicio.findByPk(id_servicio, {
    attributes: [
      'id_servicio',
      'titulo',
      'descripcion',
      'precio',
      'modalidad',
      'tiempo_estimado',
      'estado'
    ]
  });

  if (!servicio) {
    const error = new Error();
    error.code = 'SERVICE_NOT_FOUND';
    throw error;
  }

  const calificaciones = await Calificacion.findAll({
    attributes: [
      'id_calificacion',
      'id_solicitud',
      'puntuacion',
      'comentario',
      'fecha_calificacion'
    ],
    include: [
      {
        model: SolicitudServicio,
        attributes: ['id_solicitud', 'id_servicio', 'id_estudiante'],
        where: {
          id_servicio
        },
        include: [
          {
            model: Estudiante,
            attributes: ['id_estudiante', 'nombres', 'apellidos']
          }
        ]
      }
    ],
    order: [['fecha_calificacion', 'DESC']]
  });

  const total_calificaciones = calificaciones.length;
  const suma = calificaciones.reduce((acumulado, calificacion) => {
    return acumulado + Number(calificacion.puntuacion);
  }, 0);
  const promedio = total_calificaciones > 0 ? Number((suma / total_calificaciones).toFixed(1)) : 0;

  return {
    servicio,
    resumen: {
      promedio,
      total_calificaciones
    },
    calificaciones
  };
}

async function obtenerReputacionProfesional(id_profesional) {
  const profesional = await Profesional.findByPk(id_profesional, {
    attributes: [
      'id_profesional',
      'nombres',
      'apellidos',
      'universidad',
      'titulo_profesional',
      'especializacion',
      'descripcion_perfil',
      'linkedin_url',
      'disponibilidad',
      'verificado'
    ]
  });

  if (!profesional) {
    const error = new Error();
    error.code = 'PROFESSIONAL_NOT_FOUND';
    throw error;
  }

  const calificaciones = await Calificacion.findAll({
    attributes: [
      'id_calificacion',
      'id_solicitud',
      'puntuacion',
      'comentario',
      'fecha_calificacion'
    ],
    include: [
      {
        model: SolicitudServicio,
        attributes: ['id_solicitud', 'id_servicio', 'id_estudiante'],
        include: [
          {
            model: Servicio,
            attributes: ['id_servicio', 'id_profesional', 'titulo'],
            where: {
              id_profesional
            }
          },
          {
            model: Estudiante,
            attributes: ['id_estudiante', 'nombres', 'apellidos']
          }
        ]
      }
    ],
    order: [['fecha_calificacion', 'DESC']]
  });

  const total_calificaciones = calificaciones.length;
  const suma = calificaciones.reduce((acumulado, calificacion) => {
    return acumulado + Number(calificacion.puntuacion);
  }, 0);
  const promedio = total_calificaciones > 0 ? Number((suma / total_calificaciones).toFixed(1)) : 0;

  return {
    profesional,
    resumen: {
      promedio,
      total_calificaciones
    },
    calificaciones
  };
}

module.exports = {
  crearCalificacion,
  listarCalificacionesPorServicio,
  obtenerReputacionProfesional
};
