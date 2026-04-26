function validarRegistro(data) {
  const errores = [];

  if (!data.nombres || data.nombres.trim() === '') {
    errores.push('El campo nombres es obligatorio');
  }

  if (!data.apellidos || data.apellidos.trim() === '') {
    errores.push('El campo apellidos es obligatorio');
  }

  if (!data.correo || data.correo.trim() === '') {
    errores.push('El campo correo es obligatorio');
  }

  if (!data.contrasena || data.contrasena.trim() === '') {
    errores.push('El campo contrasena es obligatorio');
  }
  
  return errores;
}


function validarLogin(data) {
  const errores = [];

  if (!data.correo || data.correo.trim() === '') {
    errores.push('El campo correo es obligatorio');
  }

  if (!data.contrasena || data.contrasena.trim() === '') {
    errores.push('El campo contrasena es obligatorio');
  }

  return errores;
}


module.exports = {
  validarRegistro,
  validarLogin
};