const { Estudiante, Rol } = require('../../models/associations');

async function obtenerPerfil(id_estudiante) {
  const estudiante = await Estudiante.findByPk(id_estudiante, {
    attributes: { exclude: ['contrasena'] },
    include: [
      {
        model: Rol,
        attributes: ['id_rol', 'nombre_rol']
      }
    ]
  });

  if (!estudiante) {
    const error = new Error();
    error.code = 'STUDENT_NOT_FOUND';
    throw error;
  }

  return estudiante;
}

async function actualizarPerfilEstudiante(id_estudiante, data) {
  const estudiante = await Estudiante.findByPk(id_estudiante);

  if (!estudiante) {
    const error = new Error();
    error.code = 'STUDENT_NOT_FOUND';
    throw error;
  }

  const datosPermitidos = {};
  const camposPermitidos = ['nombres', 'apellidos'];

  camposPermitidos.forEach((campo) => {
    if (data[campo] !== undefined) {
      datosPermitidos[campo] = data[campo];
    }
  });

  await estudiante.update(datosPermitidos);

  return obtenerPerfil(id_estudiante);
}

module.exports = {
  obtenerPerfil,
  actualizarPerfilEstudiante
};
