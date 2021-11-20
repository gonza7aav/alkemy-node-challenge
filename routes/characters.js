const router = require('express').Router();
const auth = require('../middleware/auth');
const characterValidator = require('../middleware/validators/character');
const { Character, Movie, Genre } = require('../models');

// Las rutas de creación y borrado se podria hacer algo mas genéricas ya que
// son iguales a las de las películas. Sin embargo, cuando se quiera agregar
// diferentes condiciones para validarlas o pasos distintos entre estas,
// habria que cambiar mucho código. Es por esto que lo repetimos

// Función que devuelve null si el parámetro es undefined
// es decir si no fue enviado en el body entonces es null
const valueOrNull = (x) => (typeof x === 'undefined' ? null : x);

// Listado - Búsqueda - Detalles
router.get(
  '/',
  auth,
  characterValidator.validateRead(),
  async (req, res, next) => {
    // Si hay elementos de query, entonces ir a búsqueda
    if (Object.keys(req.query).length > 0) return next();

    try {
      // Lista de los Personajes
      return res
        .status(200)
        .json(await Character.findAll({ attributes: ['image', 'name'] }));
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  },
  async (req, res) => {
    // Criterio de búsqueda para el personaje
    let criteria = {};
    if (req.query.name) criteria = { ...criteria, name: req.query.name };
    if (req.query.age) criteria = { ...criteria, age: req.query.age };
    if (req.query.weight) criteria = { ...criteria, weight: req.query.weight };

    // Cuando existe uuid en la query
    // se mostrará todos los detalles de solo ese personaje
    if (req.query.uuid) criteria = { ...criteria, uuid: req.query.uuid };

    // Criterio de búsqueda para las películas
    let criteriaMovie = {};
    if (req.query.movie) criteriaMovie = { uuid: req.query.movie };

    try {
      return res.status(200).json(
        await Character.findAll({
          where: criteria,
          include: [
            {
              model: Movie,
              where: criteriaMovie,
              // Solo pongo como requerido cuando criteriaMovies no posee
              // atributos, es decir que no se envió movies en la query
              // Si no hago esto pasa lo siguiente:
              //   cuando require == true  : Nunca retorna los personajes que
              //                             no tienen películas asignadas
              //   cuando require == false : Siempre retorna los personajes
              //                             que no tienen películas asignadas
              required: Object.keys(criteriaMovie).length !== 0,
              include: [{ model: Genre }],
            },
          ],
        })
      );
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
);

// Creación
router.post(
  '/',
  auth,
  characterValidator.validateCreate(),
  async (req, res) => {
    try {
      // Busco todas las películas a través de las UUID recibidas
      const movies = await Promise.all(
        req.body.movies.map((x) => Movie.findByPk(x))
      );

      // Si algun elemento es null significa que se envió alguna UUID
      // que no esta en la base de datos entonces retornamos con error
      if (movies.includes(null)) {
        return res.status(400).json({
          errors: [
            'El arreglo de películas contiene al menos una uuid inválida',
          ],
        });
      }

      // Insertamos el nuevo personaje borrandole el atributo UUID (exista o no)
      // de esta forma se lo asigna automaticamente Sequelize
      const newCharacter = await Character.create({
        image: valueOrNull(req.body.image),
        name: req.body.name,
        age: valueOrNull(req.body.age),
        weight: valueOrNull(req.body.weight),
        history: valueOrNull(req.body.history),
      });

      // Insertamos las relaciones con las películas
      await newCharacter.addMovie(movies);

      return res.sendStatus(201);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
);

// Edición
router.put('/', auth, characterValidator.validateUpdate(), async (req, res) => {
  try {
    // Buscamos el personaje a editar
    const character = await Character.findByPk(req.body.uuid);

    // Si no existe este personaje retornamos un error
    if (character === null) return res.sendStatus(404);

    // Busco todas las películas a través de las UUID recibidas
    const movies = await Promise.all(
      req.body.movies.map((x) => Movie.findByPk(x))
    );

    // Si algun elemento es null significa que se envió alguna UUID
    // que no esta en la base de datos entonces retornamos con error
    if (movies.includes(null)) {
      return res.status(400).json({
        errors: ['El arreglo de películas contiene al menos una uuid inválida'],
      });
    }

    await character.update({
      image: valueOrNull(req.body.image),
      name: req.body.name,
      age: valueOrNull(req.body.age),
      weight: valueOrNull(req.body.weight),
      history: valueOrNull(req.body.history),
    });

    // Buscamos todas las peliculas que estan relacionadas
    const relatedMovies = await Movie.findAll({
      include: [
        {
          model: Character,
          where: {
            uuid: req.body.uuid,
          },
          required: true,
        },
      ],
    });

    // Borrar todas las relaciones
    await character.removeMovie(relatedMovies);

    // Insertamos las nuevas relaciones
    await character.addMovie(movies);

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Borrado
router.delete(
  '/',
  auth,
  characterValidator.validateDelete(),
  async (req, res) => {
    try {
      // Buscamos el personaje a eliminar
      const character = await Character.findByPk(req.body.uuid);

      // Si no existe tal personaje retornamos un error
      if (character === null) return res.sendStatus(404);

      // Esto tambien elimina las relaciones
      await Character.destroy({ where: { uuid: req.body.uuid } });

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
);

module.exports = router;
