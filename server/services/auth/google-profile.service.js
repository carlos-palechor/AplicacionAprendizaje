const CAMPOS_PROFESIONAL_GOOGLE = [
  'universidad',
  'titulo_profesional',
  'especializacion',
  'descripcion_perfil',
  'linkedin_url',
  'disponibilidad'
];

function separarNombreGoogle(perfilGoogle) {
  const nombres = perfilGoogle.given_name || perfilGoogle.name || 'Usuario';
  const apellidos = perfilGoogle.family_name || 'Google';

  return {
    nombres: nombres.trim(),
    apellidos: apellidos.trim()
  };
}

function validarDatosProfesionalGoogle(data) {
  const errores = [];

  CAMPOS_PROFESIONAL_GOOGLE.forEach((campo) => {
    if (!data[campo] || typeof data[campo] !== 'string' || data[campo].trim() === '') {
      errores.push(`El campo ${campo} es obligatorio para registrar un profesional con Google`);
    }
  });

  if (errores.length > 0) {
    const error = new Error('La solicitud no es valida. Revise los datos enviados.');
    error.code = 'VALIDATION_ERROR';
    error.statusCode = 400;
    error.errores = errores;
    throw error;
  }
}

module.exports = {
  separarNombreGoogle,
  validarDatosProfesionalGoogle
};
