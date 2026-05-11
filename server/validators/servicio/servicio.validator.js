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

module.exports = {
  validarCrearServicio
};
