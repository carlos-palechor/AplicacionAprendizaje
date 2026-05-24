function validarCrearSolicitud(data) {
  const errores = [];
  const body = data || {};
  const datosLimpios = {};

  if (body.id_estudiante !== undefined) {
    errores.push('No se permite enviar id_estudiante');
  }

  const idServicio = Number(body.id_servicio);
  if (!Number.isInteger(idServicio) || idServicio <= 0) {
    errores.push('El campo id_servicio debe ser un numero entero positivo');
  } else {
    datosLimpios.id_servicio = idServicio;
  }

  if (
    !body.descripcion_solicitud
    || typeof body.descripcion_solicitud !== 'string'
    || body.descripcion_solicitud.trim() === ''
  ) {
    errores.push('El campo descripcion_solicitud es obligatorio');
  } else {
    datosLimpios.descripcion_solicitud = body.descripcion_solicitud.trim();
  }

  if (body.estado !== undefined) {
    errores.push('No se permite enviar estado al crear una solicitud');
  }

  return {
    errores,
    data: datosLimpios
  };
}

function validarIdSolicitud(id) {
  const errores = [];
  const idSolicitud = Number(id);

  if (!Number.isInteger(idSolicitud) || idSolicitud <= 0) {
    errores.push('El id de la solicitud debe ser un numero entero positivo');
  }

  return {
    errores,
    idSolicitud
  };
}

function validarActualizarEstadoSolicitud(data) {
  const errores = [];
  const body = data || {};
  const estadosPermitidos = [
    'pendiente',
    'aceptada',
    'en_proceso',
    'finalizada',
    'rechazada',
    'cancelada'
  ];

  if (!body.estado || typeof body.estado !== 'string') {
    errores.push('El campo estado es obligatorio');
  } else if (!estadosPermitidos.includes(body.estado.trim())) {
    errores.push('El campo estado no es valido');
  }

  return {
    errores,
    data: {
      estado: body.estado ? body.estado.trim() : undefined
    }
  };
}

module.exports = {
  validarCrearSolicitud,
  validarIdSolicitud,
  validarActualizarEstadoSolicitud
};
