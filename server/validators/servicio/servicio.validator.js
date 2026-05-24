function validarCrearServicio(data) {
  const errores = [];
  const body = data || {};
  const datosLimpios = {};

  if (body.id_profesional !== undefined) {
    errores.push('No se permite enviar id_profesional');
  }

  const idCategoria = Number(body.id_categoria);
  if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
    errores.push('El campo id_categoria debe ser un numero entero positivo');
  } else {
    datosLimpios.id_categoria = idCategoria;
  }

  if (!body.titulo || typeof body.titulo !== 'string' || body.titulo.trim() === '') {
    errores.push('El campo titulo es obligatorio');
  } else {
    datosLimpios.titulo = body.titulo.trim();
  }

  if (body.descripcion !== undefined && body.descripcion !== null && typeof body.descripcion !== 'string') {
    errores.push('El campo descripcion debe ser texto');
  } else {
    datosLimpios.descripcion = body.descripcion ? body.descripcion.trim() : null;
  }

  const precio = Number(body.precio);
  if (!Number.isFinite(precio) || precio <= 0) {
    errores.push('El campo precio debe ser un numero mayor a cero');
  } else {
    datosLimpios.precio = precio;
  }

  if (body.modalidad !== undefined && body.modalidad !== null && typeof body.modalidad !== 'string') {
    errores.push('El campo modalidad debe ser texto');
  } else {
    datosLimpios.modalidad = body.modalidad ? body.modalidad.trim() : null;
  }

  if (body.tiempo_estimado !== undefined && body.tiempo_estimado !== null && typeof body.tiempo_estimado !== 'string') {
    errores.push('El campo tiempo_estimado debe ser texto');
  } else {
    datosLimpios.tiempo_estimado = body.tiempo_estimado ? body.tiempo_estimado.trim() : null;
  }

  if (body.estado !== undefined) {
    errores.push('No se permite enviar estado al crear un servicio');
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

function validarActualizarServicio(data) {
  const errores = [];
  const body = data || {};
  const datosLimpios = {};
  const camposPermitidos = [
    'id_categoria',
    'titulo',
    'descripcion',
    'precio',
    'modalidad',
    'tiempo_estimado'
  ];

  if (body.id_profesional !== undefined) {
    errores.push('No se permite enviar id_profesional');
  }

  Object.keys(body).forEach((campo) => {
    if (!camposPermitidos.includes(campo) && campo !== 'id_profesional') {
      errores.push(`El campo ${campo} no esta permitido`);
    }
  });

  if (body.id_categoria !== undefined) {
    const idCategoria = Number(body.id_categoria);

    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
      errores.push('El campo id_categoria debe ser un numero entero positivo');
    } else {
      datosLimpios.id_categoria = idCategoria;
    }
  }

  if (body.titulo !== undefined) {
    if (typeof body.titulo !== 'string' || body.titulo.trim() === '') {
      errores.push('El campo titulo debe ser texto y no puede estar vacio');
    } else {
      datosLimpios.titulo = body.titulo.trim();
    }
  }

  if (body.descripcion !== undefined) {
    if (body.descripcion !== null && typeof body.descripcion !== 'string') {
      errores.push('El campo descripcion debe ser texto');
    } else {
      datosLimpios.descripcion = body.descripcion ? body.descripcion.trim() : null;
    }
  }

  if (body.precio !== undefined) {
    const precio = Number(body.precio);

    if (!Number.isFinite(precio) || precio <= 0) {
      errores.push('El campo precio debe ser un numero mayor a cero');
    } else {
      datosLimpios.precio = precio;
    }
  }

  if (body.modalidad !== undefined) {
    if (body.modalidad !== null && typeof body.modalidad !== 'string') {
      errores.push('El campo modalidad debe ser texto');
    } else {
      datosLimpios.modalidad = body.modalidad ? body.modalidad.trim() : null;
    }
  }

  if (body.tiempo_estimado !== undefined) {
    if (body.tiempo_estimado !== null && typeof body.tiempo_estimado !== 'string') {
      errores.push('El campo tiempo_estimado debe ser texto');
    } else {
      datosLimpios.tiempo_estimado = body.tiempo_estimado ? body.tiempo_estimado.trim() : null;
    }
  }

  if (Object.keys(datosLimpios).length === 0 && errores.length === 0) {
    errores.push('Debe enviar al menos un campo permitido para actualizar');
  }

  return {
    errores,
    data: datosLimpios
  };
}

function validarActualizarEstadoServicio(data) {
  const errores = [];
  const body = data || {};
  const estadosPermitidos = ['activo', 'inactivo'];

  if (!body.estado || typeof body.estado !== 'string') {
    errores.push('El campo estado es obligatorio');
  } else if (!estadosPermitidos.includes(body.estado.trim())) {
    errores.push('El campo estado debe ser activo o inactivo');
  }

  return {
    errores,
    data: {
      estado: body.estado ? body.estado.trim() : undefined
    }
  };
}

module.exports = {
  validarCrearServicio,
  validarIdServicio,
  validarActualizarServicio,
  validarActualizarEstadoServicio
};
