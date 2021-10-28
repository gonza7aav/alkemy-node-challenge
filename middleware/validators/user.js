const validateSchema = require('./_validateSchema');

const validateRegister = () => {
  const schema = {
    email: {
      in: ['body'],
      notEmpty: true,
      isEmail: true,
      errorMessage: 'El email es inválido',
    },
    password: {
      in: ['body'],
      notEmpty: true,
      isLength: { options: { min: 8 } },
      errorMessage: 'La contraseña debe tener al menos 8 caracteres',
    },
  };

  return validateSchema(schema);
};

const validateLogin = () => {
  const schema = {
    email: {
      in: ['body'],
      notEmpty: true,
      isEmail: true,
      errorMessage: 'El email es inválido',
    },
    password: {
      in: ['body'],
      notEmpty: true,
      errorMessage: 'La contraseña es inválida',
    },
  };

  return validateSchema(schema);
};

module.exports = {
  validateRegister,
  validateLogin,
};
