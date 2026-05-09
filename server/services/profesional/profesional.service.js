const { Profesional, Rol } = require('../../models/associations');

async function obtenerPerfilProfesional(id_profesional) {
  const profesional = await Profesional.findByPk(id_profesional, {
    attributes: { exclude: ['contrasena'] },
    include: [
      {
        model: Rol,
        attributes: ['id_rol', 'nombre_rol']
      }
    ]
  });

  if (!profesional) {
    const error = new Error();
    error.code = 'PROFESSIONAL_PROFILE_NOT_FOUND';
    throw error;
  }

  return profesional;
}

async function actualizarPerfilProfesional(id_profesional, data) {
  const profesional = await Profesional.findByPk(id_profesional);

  if (!profesional) {
    const error = new Error();
    error.code = 'PROFESSIONAL_PROFILE_NOT_FOUND';
    throw error;
  }

  const datosPermitidos = {};
  const camposPermitidos = [
    'nombres',
    'apellidos',
    'universidad',
    'titulo_profesional',
    'especializacion',
    'descripcion_perfil',
    'linkedin_url',
    'disponibilidad'
  ];

  camposPermitidos.forEach((campo) => {
    if (data[campo] !== undefined) {
      datosPermitidos[campo] = data[campo];
    }
  });

  await profesional.update(datosPermitidos);

  return obtenerPerfilProfesional(id_profesional);
}

module.exports = {
  obtenerPerfilProfesional,
  actualizarPerfilProfesional
};
