const https = require('https');

function solicitarTokenInfoGoogle(idToken) {
  return new Promise((resolve, reject) => {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;

    https.get(url, (res) => {
      let cuerpo = '';

      res.on('data', (chunk) => {
        cuerpo += chunk;
      });

      res.on('end', () => {
        try {
          const data = JSON.parse(cuerpo);

          if (res.statusCode >= 400) {
            const error = new Error(data.error_description || data.error || 'Token de Google invalido');
            error.code = 'GOOGLE_TOKEN_INVALID';
            reject(error);
            return;
          }

          resolve(data);
        } catch (error) {
          error.code = 'GOOGLE_TOKEN_INVALID';
          reject(error);
        }
      });
    }).on('error', (error) => {
      error.code = 'GOOGLE_TOKEN_INVALID';
      reject(error);
    });
  });
}

async function validarTokenGoogle(idToken) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    const error = new Error();
    error.code = 'GOOGLE_CLIENT_ID_NOT_DEFINED';
    throw error;
  }

  const perfilGoogle = await solicitarTokenInfoGoogle(idToken);

  if (perfilGoogle.aud !== process.env.GOOGLE_CLIENT_ID) {
    const error = new Error();
    error.code = 'GOOGLE_TOKEN_INVALID';
    throw error;
  }

  if (perfilGoogle.email_verified !== true && perfilGoogle.email_verified !== 'true') {
    const error = new Error();
    error.code = 'GOOGLE_EMAIL_NOT_VERIFIED';
    throw error;
  }

  return perfilGoogle;
}

module.exports = {
  validarTokenGoogle
};
