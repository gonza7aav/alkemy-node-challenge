const validateSchema = require('./_validateSchema');

const validateRead = () => {
  const schema = {
    uuid: {
      in: ['query'],
      optional: true,
      isUUID: true,
      errorMessage: 'El uuid es inválido',
    },
    age: {
      in: ['query'],
      optional: true,
      isInt: true,
      errorMessage: 'La edad debe ser un número entero',
    },
    weight: {
      in: ['query'],
      optional: true,
      isFloat: true,
      errorMessage: 'El peso debe ser un número real',
    },
    movie: {
      in: ['query'],
      optional: true,
      isUUID: true,
      errorMessage: 'La película es inválida',
    },
  };

  return validateSchema(schema);
};

const validateCreate = () => {
  const schema = {
    name: {
      in: ['body'],
      notEmpty: true,
      errorMessage: 'El nombre es inválido',
    },
    age: {
      in: ['body'],
      optional: true,
      isInt: true,
      errorMessage: 'La edad debe ser un número entero',
    },
    weight: {
      in: ['body'],
      optional: true,
      isFloat: true,
      errorMessage: 'El peso debe ser un número real',
    },
    movies: {
      in: ['body'],
      isArray: { options: { min: 1 } },
      errorMessage: 'El arreglo de películas debe tener elementos',
    },
  };

  return validateSchema(schema);
};

const validateUpdate = () => {
  const schema = {
    uuid: {
      in: ['body'],
      notEmpty: true,
      isUUID: true,
      errorMessage: 'El uuid es inválido',
    },
    name: {
      in: ['body'],
      notEmpty: true,
      errorMessage: 'El nombre es inválido',
    },
    age: {
      in: ['body'],
      optional: true,
      isInt: true,
      errorMessage: 'La edad debe ser un número entero',
    },
    weight: {
      in: ['body'],
      optional: true,
      isFloat: true,
      errorMessage: 'El peso debe ser un número real',
    },
    movies: {
      in: ['body'],
      isArray: { options: { min: 1 } },
      errorMessage: 'El arreglo de películas debe tener elementos',
    },
  };

  return validateSchema(schema);
};

// Se podria hacer uno solo ya que es igual al de películas
// Sin embargo, cuando se quiera agregar diferentes condiciones para validar
// el borrado habria que cambiar más código. Es por esto que lo repetimos
const validateDelete = () => {
  const schema = {
    uuid: {
      in: ['body'],
      notEmpty: true,
      isUUID: true,
      errorMessage: 'El uuid es inválido',
    },
  };
  return validateSchema(schema);
};

module.exports = {
  validateRead,
  validateCreate,
  validateUpdate,
  validateDelete,
};
