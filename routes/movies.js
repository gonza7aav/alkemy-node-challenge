const router = require('express').Router();
const auth = require('../middleware/auth');
const movieValidator = require('../middleware/validators/movie');
const { Movie, Genre, Character } = require('../models');

// Las rutas de creación y borrado se podria hacer algo mas genéricas ya que
// son iguales a las de los personajes. Sin embargo, cuando se quiera agregar
// diferentes condiciones para validarlas o pasos distintos entre estas,
// habria que cambiar mucho código. Es por esto que lo repetimos

// Listado - Búsqueda - Detalles
router.get(
  '/',
  auth,
  movieValidator.validateRead(),
  async (req, res, next) => {
    // Si hay elementos de query, entonces ir a búsqueda
    if (Object.keys(req.query).length > 0) return next();

    try {
      // Lista de las Películas
      return res.status(200).json(
        await Movie.findAll({
          attributes: ['image', 'title', 'creationDate'],
        })
      );
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  },
  async (req, res) => {
    // Criterio de búsqueda para las películas
    let criteria = {};
    if (req.query.title) criteria = { ...criteria, title: req.query.title };

    // Cuando existe uuid en la query
    // se mostrará todos los detalles de solo esa película
    if (req.query.uuid) criteria = { ...criteria, uuid: req.query.uuid };

    // Criterio de orden de las películas
    let criteriaOrder = [];
    if (req.query.order) criteriaOrder = [['creationDate', req.query.order]];

    // Criterio de búsqueda para los generos
    let criteriaGenre = {};
    if (req.query.genre) criteriaGenre = { uuid: req.query.genre };

    try {
      return res.status(200).json(
        await Movie.findAll({
          where: criteria,
          include: [
            {
              model: Genre,
              where: criteriaGenre,
              // Solo pongo como requerido cuando criteriaGenres no posee
              // atributos, es decir que no se envió genre en la query
              // Si no hago esto pasa lo siguiente:
              //   cuando require == true  : Nunca retorna las películas que
              //                             no tienen género asignado
              //   cuando require == false : Siempre retorna las películas que
              //                             no tienen género asignado
              required: Object.keys(criteriaGenre).length !== 0,
            },
            { model: Character },
          ],
          order: [...criteriaOrder],
        })
      );
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  }
);

// Creación
router.post('/', auth, movieValidator.validateCreate(), async (req, res) => {
  try {
    // Busco todas los géneros a través de las UUID recibidas
    const genres = await Promise.all(
      req.body.genres.map((x) => Genre.findByPk(x))
    );

    // Si algun elemento es null significa que se envió alguna UUID
    // que no esta en la base de datos entonces retornamos con error
    if (genres.includes(null)) {
      return res.status(400).json({
        errors: ['El arreglo de géneros contiene al menos una uuid inválida'],
      });
    }

    // Insertamos la nueva película borrandole el atributo UUID (exista o no)
    // de esta forma se lo asigna automaticamente Sequelize
    const newMovie = await Movie.create({ ...req.body, uuid: undefined });

    // Insertamos las relaciones con los géneros
    await newMovie.addGenre(genres);

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Edición
router.put('/', auth, movieValidator.validateUpdate(), async (req, res) => {
  try {
    // Buscamos la película a editar
    const movie = await Movie.findByPk(req.body.uuid);

    // Si no existe esta película retornamos un error
    if (movie === null) return res.sendStatus(404);

    // Busco todas los géneros a través de las UUID recibidas
    const genres = await Promise.all(
      req.body.genres.map((x) => Genre.findByPk(x))
    );

    // Si algun elemento es null significa que se envió alguna UUID
    // que no esta en la base de datos entonces retornamos con error
    if (genres.includes(null)) {
      return res.status(400).json({
        errors: ['El arreglo de géneros contiene al menos una uuid inválida'],
      });
    }

    // Función que devuelve null si el parámetro es undefined
    // es decir si no fue enviado en el body entonces es null
    const valueOrNull = (x) => (typeof x === 'undefined' ? null : x);

    await movie.update({
      title: req.body.title,
      image: valueOrNull(req.body.image),
      creationDate: req.body.creationDate,
      score: req.body.score,
    });

    // Buscamos todas los géneros que estan relacionados
    const relatedGenres = await Genre.findAll({
      include: [
        {
          model: Movie,
          where: {
            uuid: req.body.uuid,
          },
          required: true,
        },
      ],
    });

    // Borrar todas las relaciones
    await movie.removeGenre(relatedGenres);

    // Insertamos las nuevas relaciones
    await movie.addGenre(genres);

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Borrado
router.delete('/', auth, movieValidator.validateDelete(), async (req, res) => {
  try {
    // Buscamos la película a eliminar
    const movie = await Movie.findByPk(req.body.uuid);

    // Si no existe tal película retornamos un error
    if (movie === null) return res.sendStatus(404);

    // Esto tambien elimina las relaciones
    await Movie.destroy({ where: { uuid: req.body.uuid } });

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
