function validarCrearCalificacion(data) {
  const errores = [];
  const body = data || {};
  const datosLimpios = {};

  const idSolicitud = Number(body.id_solicitud);
  if (!Number.isInteger(idSolicitud) || idSolicitud <= 0) {
    errores.push('El campo id_solicitud debe ser un numero entero positivo');
  } else {
    datosLimpios.id_solicitud = idSolicitud;
  }

  const puntuacion = Number(body.puntuacion);
  if (!Number.isInteger(puntuacion) || puntuacion < 1 || puntuacion > 5) {
    errores.push('El campo puntuacion debe ser un numero entero entre 1 y 5');
  } else {
    datosLimpios.puntuacion = puntuacion;
  }

  if (body.comentario !== undefined && body.comentario !== null && typeof body.comentario !== 'string') {
    errores.push('El campo comentario debe ser texto');
  } else {
    datosLimpios.comentario = body.comentario ? body.comentario.trim() : null;
  }

  return {
    errores,
    data: datosLimpios
  };
}

function validarIdServicio(id) {
  const errores = [];
  const idServicio = Number(id);

  if (!Number.isInteger(idServicio) || idServicio <= 0) {
    errores.push('El id del servicio debe ser un numero entero positivo');
  }

  return {
    errores,
    idServicio
  };
}

function validarIdProfesional(id) {
  const errores = [];
  const idProfesional = Number(id);

  if (!Number.isInteger(idProfesional) || idProfesional <= 0) {
    errores.push('El id del profesional debe ser un numero entero positivo');
  }

  return {
    errores,
    idProfesional
  };
}

module.exports = {
  validarCrearCalificacion,
  validarIdServicio,
  validarIdProfesional
};
