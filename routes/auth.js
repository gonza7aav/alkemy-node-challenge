const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Email = require('../controllers/Email');
const Token = require('../controllers/Token');
const { User } = require('../models');
const userValidator = require('../middleware/validators/user');

// TODO: Confirmaciones de usuario.
// Cuando un usuario se registra se lo agrega a una tabla "unconfirmedUsers"
// y se le envia en email de bienvenida con además un enlace para confirmar
// el email registrado. Se necesitaria otro endpoint donde recibe el código
// de validación y ahi se mueve al usuario de "unconfirmedUsers" -> "users".

// Registro de nuevos usuarios
router.post('/register', userValidator.validateRegister(), async (req, res) => {
  try {
    // Controlamos si el email ya se encuentra registrado como usuario
    const search = await User.findOne({ where: { email: req.body.email } });
    if (search !== null) {
      // Para que no se pueda saber que emails estan registrados
      // mandamos el mismo mensaje que cuando el email es inválido
      return res.status(400).json({ errors: ['El email es inválido'] });
    }

    // Hasheamos la contraseña
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Creamos un nuevo usuario
    // sin UUID ya que se le será asignado automáticamente
    // y sin token porque este se asigna al iniciar sesión
    await User.create({
      email: req.body.email,
      password: hashedPassword,
    });

    // FIXME: Si al enviar el email de bienvenida tenemos un error,
    // el usuario debería ser creado igual?
    //   SI: No va a recibir nunca el correo de bienvenida ya que se envía
    //       solo al registrar. Podría agregar una columna a los usuarios
    //       que diga si se le ha enviado o no, y cada tanto enviar a todos los
    //       que no (Y si ocurre un fallo al guardar pero ya envio el email?).
    //   NO: No se podrán registrar nuevos usuarios hasta arreglar el problema.
    //       El cual puede ser desde que nuestra cuenta no este habilitada a
    //       enviar emails por no pagar la subscripción, hasta problemas de la
    //       propia plataforma de SendGrid (y no la nuestra).

    // Enviamos un mail de bienvenida a través de SendGrid
    await Email.sendWelcomeEmail(req.body.email);

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Inicio de sesión de usuarios
router.post('/login', userValidator.validateLogin(), async (req, res) => {
  try {
    // Controlamos que el email sea de un usuario registrado
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user === null) {
      // Para que no se pueda saber que emails estan registrados
      // mandamos el mismo mensaje que cuando la contraseña es incorrecta
      return res
        .status(400)
        .json({ errors: ['Email y/o contraseña incorrecta'] });
    }

    // Controlamos que la contraseña sea la correcta
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res
        .status(400)
        .json({ errors: ['Email y/o contraseña incorrecta'] });
    }

    // Creamos un token de acceso y uno de actualización del mismo
    const accessToken = Token.createAccessToken({ uuid: user.uuid });
    const refreshToken = Token.createRefreshToken({ uuid: user.uuid });

    // Guardamos en la base de datos el token de actualizacion asignado
    await User.update({ refreshToken }, { where: { uuid: user.uuid } });

    // Mandamos el token de actualización como cookie
    Token.sendRefreshTokenCookie(res, refreshToken);

    // Mandamos como respuesta el token de acceso
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Obtención de un nuevo token de acceso
router.post('/token', async (req, res) => {
  // Leemos el token guardado previamente en las cookies
  const token = req.cookies.refreshToken;

  // En caso de no existir, retornamos un error
  if (!token) return res.sendStatus(401);

  // Confirmamos que el token sea válido
  const payload = Token.verifyRefreshToken(token);
  if (payload === null) return res.sendStatus(403);

  try {
    // Buscamos el usuario relacionado al token
    const user = await User.findByPk(payload.uuid);

    // Si existe el token en las cookies, es válido
    // pero es de un usuario que no existe, retornamos un error
    if (user === null) return res.sendStatus(400);

    // Si el usuario posee un token que es distinto al de la cookie
    // entonces ya se le ha asignado un nuevo token de actualización
    if (user.refreshToken !== token) return res.sendStatus(400);

    // Creamos nuevos token de acceso y de actualización
    const accessToken = Token.createAccessToken({ uuid: user.uuid });
    const refreshToken = Token.createRefreshToken({ uuid: user.uuid });

    // Guardamos en la base de datos el nuevo token de actualizacion
    await User.update({ refreshToken }, { where: { uuid: payload.uuid } });

    // Mandamos el nuevo token de actualización como cookie
    Token.sendRefreshTokenCookie(res, refreshToken);

    // Mandamos como respuesta el nuevo token de acceso
    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.sendStatus(500);
  }
});

// Cierre de sesión
router.post('/logout', (req, res) => {
  try {
    // Borramos la cookie que contiene el token de actualización
    Token.deleteRefreshTokenCookie(res);

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
