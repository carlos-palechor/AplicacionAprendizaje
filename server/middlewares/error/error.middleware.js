const HTTP_ERROR_NAMES = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  413: 'Payload Too Large',
  415: 'Unsupported Media Type',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout'
};

const DEFAULT_MESSAGES = {
  400: 'La solicitud no es valida. Revise los datos enviados.',
  401: 'Debe iniciar sesion o enviar un token valido.',
  403: 'No tiene permisos para realizar esta accion.',
  404: 'No se encontro el recurso solicitado.',
  405: 'El metodo HTTP usado no esta permitido para esta ruta.',
  409: 'Existe un conflicto con el estado actual del recurso.',
  413: 'Los datos enviados son demasiado grandes.',
  415: 'El tipo de contenido enviado no es soportado.',
  422: 'Los datos enviados no cumplen las validaciones.',
  429: 'Se han enviado demasiadas solicitudes.',
  500: 'Error interno del servidor.'
};

const ERROR_CATALOG = {
  VALIDATION_ERROR: {
    statusCode: 400,
    message: 'La solicitud no es valida. Revise los datos enviados.'
  },
  TOKEN_NOT_SENT: {
    statusCode: 401,
    message: 'Token no enviado.'
  },
  TOKEN_BAD_FORMAT: {
    statusCode: 401,
    message: 'Formato de token invalido. Use Bearer token.'
  },
  TOKEN_INVALID: {
    statusCode: 401,
    message: 'Token invalido o expirado.'
  },
  TIPO_CUENTA_NO_VALIDO: {
    statusCode: 400,
    message: 'Tipo de cuenta no valido.'
  },
  INVALID_REQUEST_STATUS_TRANSITION: {
    statusCode: 400,
    message: 'Cambio de estado no permitido.'
  },
  REQUEST_NOT_FINISHED: {
    statusCode: 400,
    message: 'Solo se pueden calificar solicitudes finalizadas.'
  },
  INVALID_CREDENTIALS: {
    statusCode: 401,
    message: 'Correo o contrasena incorrectos.'
  },
  ONLY_STUDENT_ACCOUNT: {
    statusCode: 403,
    message: 'Solo una cuenta estudiante puede realizar esta accion.'
  },
  ONLY_PROFESSIONAL_ACCOUNT: {
    statusCode: 403,
    message: 'Solo una cuenta profesional puede realizar esta accion.'
  },
  ONLY_ADMIN_ACCOUNT: {
    statusCode: 403,
    message: 'Solo una cuenta administrador puede realizar esta accion.'
  },
  ROLE_NOT_ALLOWED: {
    statusCode: 403,
    message: 'Este endpoint no permite este tipo de cuenta.'
  },
  USER_INACTIVE: {
    statusCode: 403,
    message: 'La cuenta no se encuentra activa.'
  },
  SERVICE_NOT_OWNER: {
    statusCode: 403,
    message: 'No puede actualizar un servicio que no le pertenece.'
  },
  REQUEST_ACCESS_DENIED: {
    statusCode: 403,
    message: 'No tiene permisos para consultar esta solicitud.'
  },
  MESSAGE_ACCESS_DENIED: {
    statusCode: 403,
    message: 'No tiene permisos para acceder a los mensajes de esta solicitud.'
  },
  RATING_ACCESS_DENIED: {
    statusCode: 403,
    message: 'No tiene permisos para calificar esta solicitud.'
  },
  ADMIN_NOT_FOUND: {
    statusCode: 404,
    message: 'Administrador no encontrado.'
  },
  STUDENT_NOT_FOUND: {
    statusCode: 404,
    message: 'Estudiante no encontrado.'
  },
  PROFESSIONAL_NOT_FOUND: {
    statusCode: 404,
    message: 'Profesional no encontrado.'
  },
  PROFESSIONAL_PROFILE_NOT_FOUND: {
    statusCode: 404,
    message: 'Perfil profesional no encontrado.'
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    message: 'Usuario no encontrado.'
  },
  CATEGORY_NOT_FOUND: {
    statusCode: 404,
    message: 'Categoria no encontrada.'
  },
  SERVICE_NOT_FOUND: {
    statusCode: 404,
    message: 'Servicio no encontrado.'
  },
  REQUEST_NOT_FOUND: {
    statusCode: 404,
    message: 'Solicitud no encontrada.'
  },
  EMAIL_EXISTS: {
    statusCode: 409,
    message: 'El correo ya esta registrado.'
  },
  CATEGORY_EXISTS: {
    statusCode: 409,
    message: 'La categoria ya existe.'
  },
  RATING_ALREADY_EXISTS: {
    statusCode: 409,
    message: 'Esta solicitud ya tiene una calificacion.'
  },
  ROLE_NOT_FOUND: {
    statusCode: 500,
    message: 'No se encontro el rol en la base de datos.'
  },
  JWT_SECRET_NOT_DEFINED: {
    statusCode: 500,
    message: 'Configuracion JWT no definida.'
  }
};

function obtenerNombreError(statusCode) {
  return HTTP_ERROR_NAMES[statusCode] || 'Error';
}

function obtenerMensajeDefecto(statusCode) {
  return DEFAULT_MESSAGES[statusCode] || 'Ocurrio un error al procesar la solicitud.';
}

function construirRespuestaError(statusCode, options = {}) {
  const message = options.message || obtenerMensajeDefecto(statusCode);
  const respuesta = {
    ok: false,
    statusCode,
    error: obtenerNombreError(statusCode),
    message
  };

  if (options.code) {
    respuesta.code = options.code;
  }

  if (options.detalles) {
    respuesta.detalles = options.detalles;
  }

  if (options.errores) {
    respuesta.errores = options.errores;
  }

  return respuesta;
}

function normalizarRespuestasDeError(req, res, next) {
  const jsonOriginal = res.json.bind(res);

  res.json = (body) => {
    if (!body || body.ok !== false || res.statusCode < 400) {
      return jsonOriginal(body);
    }

    const respuesta = construirRespuestaError(res.statusCode, {
      message: body.message,
      code: body.code,
      detalles: body.detalles || body.details || body.errores,
      errores: body.errores
    });

    return jsonOriginal(respuesta);
  };

  next();
}

function manejarRutaNoEncontrada(req, res) {
  return res.status(404).json(
    construirRespuestaError(404, {
      message: `No existe la ruta ${req.method} ${req.originalUrl}`,
      code: 'ROUTE_NOT_FOUND'
    })
  );
}

function manejarErrorGlobal(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const errorRegistrado = ERROR_CATALOG[error.code];
  let statusCode = error.status || error.statusCode || errorRegistrado?.statusCode || 500;
  let message = error.authMessage || error.message || errorRegistrado?.message;
  let code = error.code;
  let detalles = error.detalles || error.details || error.errores;

  if (errorRegistrado) {
    message = error.authMessage || error.message || errorRegistrado.message;
  }

  if (error.type === 'entity.parse.failed' || error instanceof SyntaxError) {
    statusCode = 400;
    code = 'INVALID_JSON';
    message = 'El body enviado no tiene un JSON valido.';
    detalles = ['Revise comas, llaves, comillas y formato del JSON.'];
  }

  if (error.type === 'entity.too.large') {
    statusCode = 413;
    code = 'PAYLOAD_TOO_LARGE';
    message = 'Los datos enviados son demasiado grandes.';
  }

  if (statusCode >= 500) {
    console.error('Error global:', {
      name: error.name,
      code: error.code,
      message: error.message,
      sqlMessage: error.original?.sqlMessage
    });
    if (!errorRegistrado) {
      message = obtenerMensajeDefecto(500);
    }
  }

  return res.status(statusCode).json(
    construirRespuestaError(statusCode, {
      message,
      code,
      detalles,
      errores: error.errores
    })
  );
}

module.exports = {
  normalizarRespuestasDeError,
  manejarRutaNoEncontrada,
  manejarErrorGlobal,
  construirRespuestaError
};
