function validarIdCategoria(id) {
  const errores = [];
  const idCategoria = Number(id);

  if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
    errores.push('El id de la categoria debe ser un numero entero positivo');
  }

  return {
    errores,
    idCategoria
  };
}

function validarCrearCategoria(data) {
  const errores = [];
  const body = data || {};
  const datosLimpios = {};

  if (!body.nombre_categoria || typeof body.nombre_categoria !== 'string' || body.nombre_categoria.trim() === '') {
    errores.push('El campo nombre_categoria es obligatorio');
  } else {
    datosLimpios.nombre_categoria = body.nombre_categoria.trim();
  }

  if (body.descripcion !== undefined && body.descripcion !== null && typeof body.descripcion !== 'string') {
    errores.push('El campo descripcion debe ser texto');
  } else {
    datosLimpios.descripcion = body.descripcion ? body.descripcion.trim() : null;
  }

  if (body.estado !== undefined && body.estado !== null && typeof body.estado !== 'string') {
    errores.push('El campo estado debe ser texto');
  } else {
    datosLimpios.estado = body.estado ? body.estado.trim() : 'activo';
  }

  return {
    errores,
    data: datosLimpios
  };
}

function validarActualizarCategoria(data) {
  const errores = [];
  const body = data || {};
  const datosLimpios = {};
  const camposPermitidos = ['nombre_categoria', 'descripcion', 'estado'];

  Object.keys(body).forEach((campo) => {
    if (!camposPermitidos.includes(campo)) {
      errores.push(`El campo ${campo} no esta permitido`);
    }
  });

  if (body.nombre_categoria !== undefined) {
    if (typeof body.nombre_categoria !== 'string' || body.nombre_categoria.trim() === '') {
      errores.push('El campo nombre_categoria debe ser texto y no puede estar vacio');
    } else {
      datosLimpios.nombre_categoria = body.nombre_categoria.trim();
    }
  }

  if (body.descripcion !== undefined) {
    if (body.descripcion !== null && typeof body.descripcion !== 'string') {
      errores.push('El campo descripcion debe ser texto');
    } else {
      datosLimpios.descripcion = body.descripcion ? body.descripcion.trim() : null;
    }
  }

  if (body.estado !== undefined) {
    if (typeof body.estado !== 'string' || body.estado.trim() === '') {
      errores.push('El campo estado debe ser texto y no puede estar vacio');
    } else {
      datosLimpios.estado = body.estado.trim();
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

function validarActualizarEstadoCategoria(data) {
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
  validarIdCategoria,
  validarCrearCategoria,
  validarActualizarCategoria,
  validarActualizarEstadoCategoria
};
