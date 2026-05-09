function validarRegistroUsuario(data) {
  const errores = [];
  const body = data || {};

  if (!body.nombres || body.nombres.trim() === '') {
    errores.push('El campo nombres es obligatorio');
  }

  if (!body.apellidos || body.apellidos.trim() === '') {
    errores.push('El campo apellidos es obligatorio');
  }

  if (!body.correo || body.correo.trim() === '') {
    errores.push('El campo correo es obligatorio');
  }

  if (!body.contrasena || body.contrasena.trim() === '') {
    errores.push('El campo contrasena es obligatorio');
  }

  if (body.id_rol !== undefined || body.tipo_cuenta !== undefined) {
    errores.push('No se permite enviar rol ni tipo_cuenta en este endpoint');
  }

  return errores;
}

function validarLoginUsuario(data) {
  const errores = [];
  const body = data || {};

  if (!body.correo || body.correo.trim() === '') {
    errores.push('El campo correo es obligatorio');
  }

  if (!body.contrasena || body.contrasena.trim() === '') {
    errores.push('El campo contrasena es obligatorio');
  }

  return errores;
}

const CAMPOS_PERMITIDOS_ACTUALIZAR_PERFIL = [
  'nombres',
  'apellidos',
  'telefono',
  'foto_perfil'
];

const CAMPOS_SENSIBLES = [
  'id_usuario',
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
  validarRegistroUsuario,
  validarLoginUsuario,
  validarActualizarPerfil
};
