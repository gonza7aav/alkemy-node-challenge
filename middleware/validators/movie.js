const validateSchema = require('./_validateSchema');

const validateRead = () => {
  const schema = {
    uuid: {
      in: ['query'],
      optional: true,
      isUUID: true,
      errorMessage: 'El uuid es inválido',
    },
    order: {
      in: ['query'],
      optional: true,
      custom: {
        options: (value) => ['ASC', 'DESC'].includes(value.toUpperCase()),
      },
      errorMessage: 'El orden debe ser "ASC" o "DESC"',
    },
    genre: {
      in: ['query'],
      optional: true,
      isUUID: true,
      errorMessage: 'El género es inválida',
    },
  };

  return validateSchema(schema);
};

const validateCreate = () => {
  const schema = {
    title: {
      in: ['body'],
      notEmpty: true,
      errorMessage: 'El título es inválido',
    },
    creationDate: {
      in: ['body'],
      notEmpty: true,
      isDate: {
        options: {
          format: 'YYYY/MM/DD',
          strictMode: true,
        },
      },
      errorMessage:
        'La fecha de creación es inválida o no sigue el formato "YYYY/MM/DD"',
    },
    score: {
      in: ['body'],
      notEmpty: true,
      isFloat: true,
      custom: { options: (value) => value >= 1 && value <= 5 },
      errorMessage: 'La calificación debe ser un número real entre 1 y 5',
    },
    genres: {
      in: ['body'],
      isArray: { options: { min: 1 } },
      errorMessage: 'El arreglo de géneros debe tener elementos',
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
    title: {
      in: ['body'],
      notEmpty: true,
      errorMessage: 'El título es inválido',
    },
    creationDate: {
      in: ['body'],
      notEmpty: true,
      isDate: {
        options: {
          format: 'YYYY/MM/DD',
          strictMode: true,
        },
      },
      errorMessage:
        'La fecha de creación es inválida o no sigue el formato "YYYY/MM/DD"',
    },
    score: {
      in: ['body'],
      notEmpty: true,
      isFloat: true,
      custom: { options: (value) => value >= 1 && value <= 5 },
      errorMessage: 'La calificación debe ser un número real entre 1 y 5',
    },
    genres: {
      in: ['body'],
      isArray: { options: { min: 1 } },
      errorMessage: 'El arreglo de géneros debe tener elementos',
    },
  };

  return validateSchema(schema);
};

// Se podria hacer uno solo ya que es igual al de personajes
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
