const { checkSchema, validationResult } = require('express-validator');

// Esta funcion es la que ocuparán todos los validadores. Pero no es usable
// directamente (si no a través de los métodos de los validadores)

// https://express-validator.github.io/docs/running-imperatively.html
const validateSchema = (schema) => async (req, res, next) => {
  // Obtengo las validaciones a realizar mediante el esquema recibido
  const validations = checkSchema(schema);

  // Resuelvo todas las validaciones (promesas) con su método run
  await Promise.all(validations.map((validation) => validation.run(req)));

  // Si no hay errores paso a la siguiente funcion
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  // Conservo solo los mensajes de errores
  const errorsMessages = errors.errors.map((x) => x.msg);

  // Elimino los mensajes duplicados
  const filteredErrors = errorsMessages.filter(
    (el, idx) => idx === errorsMessages.indexOf(el)
  );

  return res.status(400).json({ errors: filteredErrors });
};

module.exports = validateSchema;
