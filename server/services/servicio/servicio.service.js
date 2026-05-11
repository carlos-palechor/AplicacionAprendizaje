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

module.exports = {
  crearServicio
};
