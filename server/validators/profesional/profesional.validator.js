const CAMPOS_PERMITIDOS_PERFIL_PROFESIONAL = [
  'universidad',
  'titulo_profesional',
  'especializacion',
  'descripcion_perfil',
  'linkedin_url',
  'disponibilidad'
];

function validarRegistroProfesional(data) {
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

function validarLoginProfesional(data) {
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

const CAMPOS_NO_PERMITIDOS = [
  'id_profesional',
  'id_usuario',
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
  validarRegistroProfesional,
  validarLoginProfesional,
  validarPerfilProfesional
};
