const CAMPOS_PERMITIDOS_PERFIL_PROFESIONAL = [
  'nombres',
  'apellidos',
  'universidad',
  'titulo_profesional',
  'especializacion',
  'descripcion_perfil',
  'linkedin_url',
  'disponibilidad'
];

const CAMPOS_NO_PERMITIDOS = [
  'id_profesional',
  'id_rol',
  'correo',
  'contrasena',
  'tipo_cuenta',
  'verificado'
];

function validarPerfilProfesional(data, opciones = {}) {
  const errores = [];
  const datosLimpios = {};
  const body = data || {};
  const requerirCampos = opciones.requerirCampos || false;

  Object.keys(body).forEach((campo) => {
    if (CAMPOS_NO_PERMITIDOS.includes(campo)) {
      errores.push(`No se permite enviar el campo ${campo}`);
      return;
    }

    if (!CAMPOS_PERMITIDOS_PERFIL_PROFESIONAL.includes(campo)) {
      errores.push(`El campo ${campo} no esta permitido`);
    }
  });

  CAMPOS_PERMITIDOS_PERFIL_PROFESIONAL.forEach((campo) => {
    if (body[campo] === undefined) {
      return;
    }

    if (body[campo] !== null && typeof body[campo] !== 'string') {
      errores.push(`El campo ${campo} debe ser texto`);
      return;
    }

    const valor = typeof body[campo] === 'string' ? body[campo].trim() : body[campo];
    datosLimpios[campo] = valor || null;
  });

  if (Object.keys(datosLimpios).length === 0 && errores.length === 0) {
    errores.push('Debe enviar al menos un campo permitido');
  }

  if (requerirCampos) {
    ['universidad', 'titulo_profesional'].forEach((campo) => {
      if (!datosLimpios[campo]) {
        errores.push(`El campo ${campo} es obligatorio`);
      }
    });
  }

  return {
    errores,
    data: datosLimpios
  };
}

module.exports = {
  validarPerfilProfesional
};
