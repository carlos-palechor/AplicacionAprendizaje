const {
  CategoriaServicio,
  Estudiante,
  Profesional,
  Servicio,
  SolicitudServicio
} = require('../../models/associations');

async function validarEstudiante(id_estudiante) {
  const estudiante = await Estudiante.findByPk(id_estudiante);

  if (!estudiante) {
    const error = new Error();
    error.code = 'STUDENT_NOT_FOUND';
    throw error;
  }

  return estudiante;
}

async function validarServicioActivo(id_servicio) {
  const servicio = await Servicio.findOne({
    where: {
      id_servicio,
      estado: 'activo'
    }
  });

  if (!servicio) {
    const error = new Error();
    error.code = 'SERVICE_NOT_FOUND';
    throw error;
  }

  return servicio;
}

async function crearSolicitud(id_estudiante, data) {
  await validarEstudiante(id_estudiante);
  await validarServicioActivo(data.id_servicio);

  return SolicitudServicio.create({
    id_servicio: data.id_servicio,
    id_estudiante,
    descripcion_solicitud: data.descripcion_solicitud,
    fecha_solicitud: new Date(),
    estado: 'pendiente'
  });
}

async function listarMisSolicitudes(id_estudiante) {
  await validarEstudiante(id_estudiante);

  return SolicitudServicio.findAll({
    where: {
      id_estudiante
    },
    attributes: [
      'id_solicitud',
      'id_servicio',
      'id_estudiante',
      'descripcion_solicitud',
      'fecha_solicitud',
      'estado'
    ],
    include: [
      {
        model: Servicio,
        attributes: [
          'id_servicio',
          'id_profesional',
          'id_categoria',
          'titulo',
          'descripcion',
          'precio',
          'modalidad',
          'tiempo_estimado',
          'fecha_publicacion',
          'estado'
        ],
        include: [
          {
            model: CategoriaServicio,
            attributes: ['id_categoria', 'nombre_categoria', 'descripcion', 'estado']
          },
          {
            model: Profesional,
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
          }
        ]
      }
    ],
    order: [['fecha_solicitud', 'DESC']]
  });
}

async function validarProfesional(id_profesional) {
  const profesional = await Profesional.findByPk(id_profesional);

  if (!profesional) {
    const error = new Error();
    error.code = 'PROFESSIONAL_NOT_FOUND';
    throw error;
  }

  return profesional;
}

async function listarSolicitudesRecibidas(id_profesional) {
  await validarProfesional(id_profesional);

  return SolicitudServicio.findAll({
    attributes: [
      'id_solicitud',
      'id_servicio',
      'id_estudiante',
      'descripcion_solicitud',
      'fecha_solicitud',
      'estado'
    ],
    include: [
      {
        model: Servicio,
        attributes: [
          'id_servicio',
          'id_profesional',
          'id_categoria',
          'titulo',
          'descripcion',
          'precio',
          'modalidad',
          'tiempo_estimado',
          'fecha_publicacion',
          'estado'
        ],
        where: {
          id_profesional
        },
        include: [
          {
            model: CategoriaServicio,
            attributes: ['id_categoria', 'nombre_categoria', 'descripcion', 'estado']
          }
        ]
      },
      {
        model: Estudiante,
        attributes: [
          'id_estudiante',
          'nombres',
          'apellidos',
          'correo'
        ]
      }
    ],
    order: [['fecha_solicitud', 'DESC']]
  });
}

async function obtenerDetalleSolicitud(id_solicitud, auth) {
  const solicitud = await SolicitudServicio.findByPk(id_solicitud, {
    attributes: [
      'id_solicitud',
      'id_servicio',
      'id_estudiante',
      'descripcion_solicitud',
      'fecha_solicitud',
      'estado'
    ],
    include: [
      {
        model: Servicio,
        attributes: [
          'id_servicio',
          'id_profesional',
          'id_categoria',
          'titulo',
          'descripcion',
          'precio',
          'modalidad',
          'tiempo_estimado',
          'fecha_publicacion',
          'estado'
        ],
        include: [
          {
            model: CategoriaServicio,
            attributes: ['id_categoria', 'nombre_categoria', 'descripcion', 'estado']
          },
          {
            model: Profesional,
            attributes: [
              'id_profesional',
              'nombres',
              'apellidos',
              'correo',
              'universidad',
              'titulo_profesional',
              'especializacion',
              'descripcion_perfil',
              'linkedin_url',
              'disponibilidad',
              'verificado'
            ]
          }
        ]
      },
      {
        model: Estudiante,
        attributes: [
          'id_estudiante',
          'nombres',
          'apellidos',
          'correo'
        ]
      }
    ]
  });

  if (!solicitud) {
    const error = new Error();
    error.code = 'REQUEST_NOT_FOUND';
    throw error;
  }

  const esEstudiantePropietario = auth?.tipo_cuenta === 'estudiante'
    && solicitud.id_estudiante === auth.id_estudiante;
  const esProfesionalPropietario = auth?.tipo_cuenta === 'profesional'
    && solicitud.servicio?.id_profesional === auth.id_profesional;

  if (!esEstudiantePropietario && !esProfesionalPropietario) {
    const error = new Error();
    error.code = 'REQUEST_ACCESS_DENIED';
    throw error;
  }

  return solicitud;
}

async function buscarSolicitudConServicio(id_solicitud) {
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

function validarTransicionProfesional(estadoActual, estadoNuevo) {
  const transiciones = {
    pendiente: ['aceptada', 'rechazada'],
    aceptada: ['en_proceso', 'cancelada'],
    en_proceso: ['finalizada'],
    finalizada: [],
    rechazada: [],
    cancelada: []
  };

  if (!transiciones[estadoActual]?.includes(estadoNuevo)) {
    const error = new Error();
    error.code = 'INVALID_REQUEST_STATUS_TRANSITION';
    throw error;
  }
}

function validarCancelacionEstudiante(estadoActual) {
  const estadosCancelables = ['pendiente', 'aceptada'];

  if (!estadosCancelables.includes(estadoActual)) {
    const error = new Error();
    error.code = 'INVALID_REQUEST_STATUS_TRANSITION';
    throw error;
  }
}

async function actualizarEstadoSolicitudProfesional(id_profesional, id_solicitud, estado) {
  await validarProfesional(id_profesional);

  const solicitud = await buscarSolicitudConServicio(id_solicitud);

  if (solicitud.servicio?.id_profesional !== id_profesional) {
    const error = new Error();
    error.code = 'REQUEST_ACCESS_DENIED';
    throw error;
  }

  validarTransicionProfesional(solicitud.estado, estado);

  await solicitud.update({ estado });

  return obtenerDetalleSolicitud(id_solicitud, {
    tipo_cuenta: 'profesional',
    id_profesional
  });
}

async function cancelarSolicitudEstudiante(id_estudiante, id_solicitud) {
  await validarEstudiante(id_estudiante);

  const solicitud = await buscarSolicitudConServicio(id_solicitud);

  if (solicitud.id_estudiante !== id_estudiante) {
    const error = new Error();
    error.code = 'REQUEST_ACCESS_DENIED';
    throw error;
  }

  validarCancelacionEstudiante(solicitud.estado);

  await solicitud.update({ estado: 'cancelada' });

  return obtenerDetalleSolicitud(id_solicitud, {
    tipo_cuenta: 'estudiante',
    id_estudiante
  });
}

module.exports = {
  crearSolicitud,
  listarMisSolicitudes,
  listarSolicitudesRecibidas,
  obtenerDetalleSolicitud,
  actualizarEstadoSolicitudProfesional,
  cancelarSolicitudEstudiante
};
