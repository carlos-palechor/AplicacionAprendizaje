const { CategoriaServicio, Profesional, Servicio } = require('../../models/associations');

async function validarProfesional(id_profesional) {
  const profesional = await Profesional.findByPk(id_profesional);

  if (!profesional) {
    const error = new Error();
    error.code = 'PROFESSIONAL_NOT_FOUND';
    throw error;
  }

  if (profesional.id_rol !== 2) {
    const error = new Error();
    error.code = 'ONLY_PROFESSIONAL_ACCOUNT';
    throw error;
  }

  return profesional;
}

async function validarCategoriaActiva(id_categoria) {
  const categoria = await CategoriaServicio.findOne({
    where: {
      id_categoria,
      estado: 'activo'
    }
  });

  if (!categoria) {
    const error = new Error();
    error.code = 'CATEGORY_NOT_FOUND';
    throw error;
  }

  return categoria;
}

async function crearServicio(id_profesional, data) {
  await validarProfesional(id_profesional);
  await validarCategoriaActiva(data.id_categoria);

  return Servicio.create({
    id_profesional,
    id_categoria: data.id_categoria,
    titulo: data.titulo,
    descripcion: data.descripcion,
    precio: data.precio,
    modalidad: data.modalidad,
    tiempo_estimado: data.tiempo_estimado,
    fecha_publicacion: new Date(),
    estado: 'activo'
  });
}

async function listarServicios() {
  const whereServicio = {
    estado: 'activo'
  };

  return Servicio.findAll({
    where: whereServicio,
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
        attributes: ['id_categoria', 'nombre_categoria', 'descripcion', 'estado'],
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
          'descripcion_perfil',
          'linkedin_url',
          'disponibilidad',
          'verificado'
        ]
      }
    ],
    order: [['fecha_publicacion', 'DESC']]
  });
}

async function obtenerServicioPorId(id_servicio) {
  const servicio = await Servicio.findOne({
    where: {
      id_servicio,
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
        attributes: ['id_categoria', 'nombre_categoria', 'descripcion', 'estado'],
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
          'descripcion_perfil',
          'linkedin_url',
          'disponibilidad',
          'verificado'
        ]
      }
    ]
  });

  if (!servicio) {
    const error = new Error();
    error.code = 'SERVICE_NOT_FOUND';
    throw error;
  }

  return servicio;
}

async function listarMisServicios(id_profesional) {
  await validarProfesional(id_profesional);

  return Servicio.findAll({
    where: {
      id_profesional
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
        attributes: ['id_categoria', 'nombre_categoria', 'descripcion', 'estado']
      }
    ],
    order: [['fecha_publicacion', 'DESC']]
  });
}

async function actualizarServicio(id_profesional, id_servicio, data) {
  await validarProfesional(id_profesional);

  const servicio = await Servicio.findByPk(id_servicio);

  if (!servicio) {
    const error = new Error();
    error.code = 'SERVICE_NOT_FOUND';
    throw error;
  }

  if (servicio.id_profesional !== id_profesional) {
    const error = new Error();
    error.code = 'SERVICE_NOT_OWNER';
    throw error;
  }

  if (data.id_categoria !== undefined) {
    await validarCategoriaActiva(data.id_categoria);
  }

  await servicio.update(data);

  return obtenerServicioPorId(id_servicio);
}

async function actualizarEstadoServicio(id_profesional, id_servicio, estado) {
  await validarProfesional(id_profesional);

  const servicio = await Servicio.findByPk(id_servicio);

  if (!servicio) {
    const error = new Error();
    error.code = 'SERVICE_NOT_FOUND';
    throw error;
  }

  if (servicio.id_profesional !== id_profesional) {
    const error = new Error();
    error.code = 'SERVICE_NOT_OWNER';
    throw error;
  }

  await servicio.update({ estado });

  return servicio;
}

module.exports = {
  crearServicio,
  listarServicios,
  obtenerServicioPorId,
  listarMisServicios,
  actualizarServicio,
  actualizarEstadoServicio
};
