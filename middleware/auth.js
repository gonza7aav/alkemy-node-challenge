const Token = require('../controllers/Token');

module.exports = (req, res, next) => {
  // Se tiene que hacer un split y seleccionar el segundo
  // elemento porque los token vienen de la forma:
  // Bearer xxxxxxxxxx
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  const result = Token.verifyAccessToken(token);

  // En caso de ser un token inválido result será null
  if (result === null) return res.sendStatus(403);

  // TODO: Control sobre el usuario
  // Ya sabemos que tiene el token de acceso y además es válido
  // ahora debemos preguntar si tiene los permisos para la operación

  return next();
};
