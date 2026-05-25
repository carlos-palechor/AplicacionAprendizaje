const jwt = require('jsonwebtoken');

function crearErrorToken(code) {
  const error = new Error();
  error.code = code;
  return error;
}

function verificarToken(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return next(crearErrorToken('TOKEN_NOT_SENT'));
    }

    const partes = authorization.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
      return next(crearErrorToken('TOKEN_BAD_FORMAT'));
    }

    const token = partes[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = decoded;

    return next();
  } catch (error) {
    return next(crearErrorToken('TOKEN_INVALID'));
  }
}

module.exports = {
  verificarToken
};
