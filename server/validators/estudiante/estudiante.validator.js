const CAMPOS_PERMITIDOS_ACTUALIZAR_PERFIL = [
  'nombres',
  'apellidos'
];

const CAMPOS_SENSIBLES = [
  'id_estudiante',
  'id_rol',
  'contrasena',
  'correo',
  'tipo_cuenta'
];

function validarActualizarPerfil(data) {
  const errores = [];
  const datosLimpios = {};
  const body = data || {};

  Object.keys(body).forEach((campo) => {
    if (CAMPOS_SENSIBLES.includes(campo)) {
      errores.push(`No se permite actualizar el campo ${campo}`);
      return;
    }

    if (!CAMPOS_PERMITIDOS_ACTUALIZAR_PERFIL.includes(campo)) {
      errores.push(`El campo ${campo} no esta permitido`);
    }
  });

  CAMPOS_PERMITIDOS_ACTUALIZAR_PERFIL.forEach((campo) => {
    if (body[campo] === undefined) {
      return;
    }

    if (body[campo] !== null && typeof body[campo] !== 'string') {
      errores.push(`El campo ${campo} debe ser texto`);
      return;
    }

    const valor = typeof body[campo] === 'string' ? body[campo].trim() : body[campo];

    if ((campo === 'nombres' || campo === 'apellidos') && !valor) {
      errores.push(`El campo ${campo} no puede estar vacio`);
      return;
    }

    datosLimpios[campo] = valor || null;
  });

  if (Object.keys(datosLimpios).length === 0 && errores.length === 0) {
    errores.push('Debe enviar al menos un campo permitido para actualizar');
  }

  return {
    errores,
    data: datosLimpios
  };
}

module.exports = {
  validarActualizarPerfil
};
