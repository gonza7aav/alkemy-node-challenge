const express = require('express');
const { sequelize } = require('../models');
const { logExceptOnTest } = require('./Log');

class Server {
  constructor() {
    this.port = process.env.SERVER_PORT;
    this.app = express();
    this.database = sequelize;

    this.applyMiddlewares();
    this.loadRoutes();
  }

  applyMiddlewares() {
    // Aplica middleware que convierte las request a JSON
    this.app.use(express.json());
    // Aplica middleware que facilita el manejo de las cookies
    this.app.use(require('cookie-parser')());
  }

  // Carga todas las rutas disponibles de la API
  loadRoutes() {
    this.app.use('/auth', require('../routes/auth'));
    this.app.use('/characters', require('../routes/characters'));
    this.app.use('/movies', require('../routes/movies'));
  }

  async start() {
    try {
      // Sincronizamos la base de datos con Sequelize
      await this.database.sync({ force: false });

      // Empezamos a escuchar peticiones
      // Tambien guardamos lo que retorna que es un Server del modulo net
      this.netServer = this.app.listen(this.port, () =>
        logExceptOnTest(`API running at http://localhost:${this.port}`)
      );
    } catch (error) {
      console.error(error);
    }
  }

  // Este método preparará la base de datos con datos prefijados
  // para realizar un testeo de los endpoints
  async prepareForTest() {
    if (process.env.NODE_ENV !== 'test') return;

    // Sincronizamos Sequelize de forma forzada
    // es decir que ejecutará un DROP TABLE IF EXISTS
    await this.database.sync({ force: true });

    const { User, Genre, Movie, Character } = require('../models');

    // Lo utilizaremos para probar testear si falla cuando
    // intenta registrarse con un email ya registrado
    await User.create({
      email: 'gonzalo@aguirre.com',
      // "12345678" hashed password
      password: '$2a$10$AzGqEvvs2td4y5F0w26Ykudbaj5o1AnFXVkcN6F04Bsnamorv3q.a',
    });

    // Iremos guardando las instancias para hacer las relaciones
    const animation = await Genre.create({ name: 'Animación' });
    const fantasy = await Genre.create({ name: 'Fantasía' });

    const aliciaM = await Movie.create({
      title: 'Alicia en el país de las maravillas',
      creationDate: '1951-07-28',
      score: '3.9',
    });
    await aliciaM.addGenre(animation);

    const aliciaC = await Character.create({
      name: 'Alicia',
    });
    await aliciaC.addMovie(aliciaM);

    const gatoCheshire = await Character.create({
      name: 'Gato de Cheshire',
    });
    await gatoCheshire.addMovie(aliciaM);

    const herculesM = await Movie.create({
      title: 'Hércules',
      creationDate: '1997-06-27',
      score: '3.8',
    });
    await herculesM.addGenre(animation);

    const herculesC = await Character.create({
      name: 'Hércules',
    });
    await herculesC.addMovie(herculesM);

    const pegaso = await Character.create({
      name: 'Pegaso',
    });
    await pegaso.addMovie(herculesM);

    const cruellaM = await Movie.create({
      title: 'Cruella',
      creationDate: '2021-05-18',
      score: '4.85',
    });
    await cruellaM.addGenre(fantasy);

    const cruellaC = await Character.create({
      name: 'Cruella de Vil',
    });
    await cruellaC.addMovie(cruellaM);

    const maleficaM = await Movie.create({
      title: 'Maléfica',
      creationDate: '2012-06-18',
      score: '3.5',
    });
    await maleficaM.addGenre(fantasy);

    const maleficaC = await Character.create({
      name: 'Maléfica',
    });
    await maleficaC.addMovie(maleficaM);

    const aurora = await Character.create({
      name: 'Princesa Aurora',
    });
    await aurora.addMovie(maleficaM);
  }
}

module.exports = Server;
