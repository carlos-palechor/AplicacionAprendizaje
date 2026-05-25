const TIPOS_CUENTA_PERMITIDOS = ['estudiante', 'profesional', 'administrador'];
const ROLES_AUTH = {
  estudiante: 1,
  profesional: 2,
  administrador: 3
};
const CAMPOS_PROFESIONAL = [
  'universidad',
  'titulo_profesional',
  'especializacion',
  'descripcion_perfil',
  'linkedin_url',
  'disponibilidad'
];

function validarTipoCuenta(tipoCuenta) {
  if (!TIPOS_CUENTA_PERMITIDOS.includes(tipoCuenta)) {
    return ['Tipo de cuenta no valido. Use estudiante, profesional o administrador'];
  }

  return [];
}

function validarRegistroAuth(tipoCuenta, data) {
  const errores = validarTipoCuenta(tipoCuenta);
  const body = data || {};

  if (errores.length > 0) {
    return errores;
  }

  if (Number(body.id_rol) !== ROLES_AUTH[tipoCuenta]) {
    errores.push(`El campo id_rol debe ser ${ROLES_AUTH[tipoCuenta]}`);
  }

  if (!body.nombres || typeof body.nombres !== 'string' || body.nombres.trim() === '') {
    errores.push('El campo nombres es obligatorio');
  }

  if (!body.apellidos || typeof body.apellidos !== 'string' || body.apellidos.trim() === '') {
    errores.push('El campo apellidos es obligatorio');
  }

  if (!body.correo || typeof body.correo !== 'string' || body.correo.trim() === '') {
    errores.push('El campo correo es obligatorio');
  }

  if (!body.contrasena || typeof body.contrasena !== 'string' || body.contrasena.trim() === '') {
    errores.push('El campo contrasena es obligatorio');
  }

  if (body.tipo_cuenta !== undefined) {
    errores.push('No se permite enviar tipo_cuenta en este endpoint');
  }

  if (tipoCuenta === 'profesional') {
    CAMPOS_PROFESIONAL.forEach((campo) => {
      if (!body[campo] || typeof body[campo] !== 'string' || body[campo].trim() === '') {
        errores.push(`El campo ${campo} es obligatorio`);
        return;
      }

      if (typeof body[campo] !== 'string') {
        errores.push(`El campo ${campo} debe ser texto`);
      }
    });

    if (
      body.verificado !== undefined
      && body.verificado !== 0
      && body.verificado !== 1
      && typeof body.verificado !== 'boolean'
    ) {
      errores.push('El campo verificado debe ser 0, 1, true o false');
    }
  }

  if (tipoCuenta === 'estudiante') {
    CAMPOS_PROFESIONAL.forEach((campo) => {
      if (body[campo] !== undefined) {
        errores.push(`El campo ${campo} no esta permitido para estudiantes`);
      }
    });
  }

  if (tipoCuenta === 'administrador') {
    CAMPOS_PROFESIONAL.forEach((campo) => {
      if (body[campo] !== undefined) {
        errores.push(`El campo ${campo} no esta permitido para administradores`);
      }
    });
  }

  return errores;
}

function validarLoginAuth(tipoCuenta, data) {
  const errores = validarTipoCuenta(tipoCuenta);
  const body = data || {};

  if (errores.length > 0) {
    return errores;
  }

  if (!body.correo || body.correo.trim() === '') {
    errores.push('El campo correo es obligatorio');
  }

  if (!body.contrasena || body.contrasena.trim() === '') {
    errores.push('El campo contrasena es obligatorio');
  }

  return errores;
}

module.exports = {
  validarRegistroAuth,
  validarLoginAuth
};
