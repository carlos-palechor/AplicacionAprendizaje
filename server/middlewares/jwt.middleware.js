const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        ok: false,
        message: 'Token no enviado'
      });
    }

    const partes = authorization.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
      return res.status(401).json({
        ok: false,
        message: 'Formato de token invalido'
      });
    }

    const token = partes[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'Token invalido o expirado'
    });
  }
}

module.exports = {
  verificarToken
};
