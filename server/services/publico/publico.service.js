const {
  Calificacion,
  CategoriaServicio,
  Profesional,
  Servicio,
  SolicitudServicio
} = require('../../models/associations');

function obtenerPromedio(calificaciones) {
  if (!calificaciones.length) {
    return 0;
  }

  const suma = calificaciones.reduce((total, calificacion) => {
    return total + Number(calificacion.puntuacion);
  }, 0);

  return Number((suma / calificaciones.length).toFixed(1));
}

function obtenerNombreProfesional(profesional) {
  return `${profesional.nombres} ${profesional.apellidos}`.trim();
}

async function obtenerReputacionPorProfesional(id_profesional) {
  const calificaciones = await Calificacion.findAll({
    attributes: ['puntuacion'],
    include: [
      {
        model: SolicitudServicio,
        attributes: ['id_solicitud'],
        include: [
          {
            model: Servicio,
            attributes: ['id_servicio', 'id_profesional'],
            where: {
              id_profesional
            }
          }
        ]
      }
    ]
  });

  return {
    promedio: obtenerPromedio(calificaciones),
    total_calificaciones: calificaciones.length
  };
}

async function obtenerEstadisticas() {
  const [
    profesionales_activos,
    servicios_disponibles,
    servicios_completados,
    calificaciones
  ] = await Promise.all([
    Profesional.count(),
    Servicio.count({ where: { estado: 'activo' } }),
    SolicitudServicio.count({ where: { estado: 'finalizada' } }),
    Calificacion.findAll({ attributes: ['puntuacion'] })
  ]);

  return {
    profesionales_activos,
    servicios_disponibles,
    calificacion_promedio: obtenerPromedio(calificaciones),
    servicios_completados
  };
}

async function obtenerCategorias() {
  const categorias = await CategoriaServicio.findAll({
    where: {
      estado: 'activo'
    },
    attributes: ['id_categoria', 'nombre_categoria', 'descripcion', 'estado'],
    order: [['nombre_categoria', 'ASC']]
  });

  return Promise.all(
    categorias.map(async (categoria) => {
      const total_servicios = await Servicio.count({
        where: {
          id_categoria: categoria.id_categoria,
          estado: 'activo'
        }
      });

      return {
        ...categoria.toJSON(),
        total_servicios
      };
    })
  );
}

async function obtenerServiciosDestacados() {
  const servicios = await Servicio.findAll({
    where: {
      estado: 'activo'
    },
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
        attributes: ['id_categoria', 'nombre_categoria'],
        where: {
          estado: 'activo'
        }
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
          'verificado'
        ]
      }
    ],
    order: [['fecha_publicacion', 'DESC']],
    limit: 4
  });

  return Promise.all(
    servicios.map(async (servicio) => {
      const data = servicio.toJSON();
      const reputacion = await obtenerReputacionPorProfesional(data.id_profesional);

      return {
        ...data,
        reputacion
      };
    })
  );
}

async function obtenerProfesionalesDestacados() {
  const profesionales = await Profesional.findAll({
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
    ],
    include: [
      {
        model: Servicio,
        attributes: ['id_servicio', 'titulo', 'id_categoria', 'estado'],
        where: {
          estado: 'activo'
        },
        required: true,
        include: [
          {
            model: CategoriaServicio,
            attributes: ['id_categoria', 'nombre_categoria'],
            where: {
              estado: 'activo'
            }
          }
        ]
      }
    ],
    order: [
      ['verificado', 'DESC'],
      ['id_profesional', 'DESC']
    ],
    limit: 6,
    subQuery: false
  });

  const profesionalesConReputacion = await Promise.all(
    profesionales.map(async (profesional) => {
      const data = profesional.toJSON();
      const reputacion = await obtenerReputacionPorProfesional(data.id_profesional);

      return {
        ...data,
        nombre_completo: obtenerNombreProfesional(data),
        reputacion
      };
    })
  );

  return profesionalesConReputacion
    .sort((profesionalA, profesionalB) => {
      return profesionalB.reputacion.promedio - profesionalA.reputacion.promedio;
    })
    .slice(0, 4);
}

module.exports = {
  obtenerEstadisticas,
  obtenerCategorias,
  obtenerServiciosDestacados,
  obtenerProfesionalesDestacados
};
