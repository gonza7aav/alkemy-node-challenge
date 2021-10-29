const jwt = require('jsonwebtoken');

const createAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });

const createRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

// Verifica que el token que le fue dado sea válido
// Retorna lo que fue cargado en el mismo o,
// en caso de que fuese inválido, null
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    return null;
  }
};

// Funciona de la misma manera que verifyAccessToken
// pero con los token de actualización
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

const sendRefreshTokenCookie = (response, token) =>
  response.cookie('refreshToken', token, {
    httpOnly: true,
    path: '/auth/token',
  });

const deleteRefreshTokenCookie = (response) => {
  response.clearCookie('refreshToken', {
    path: '/auth/token',
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  sendRefreshTokenCookie,
  deleteRefreshTokenCookie,
};
