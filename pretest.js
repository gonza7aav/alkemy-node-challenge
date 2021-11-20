/* eslint-disable global-require */
/* eslint-disable object-curly-newline */

// Este script preparará la base de datos con datos prefijados
// para realizar un testeo de los endpoints

if (process.env.NODE_ENV !== 'test') {
  throw new Error('This is not a test enviroment');
}

console.log('Starting the insertion of test data');

// Agrega las variables de entorno del archivo .env
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const Server = require('./controllers/Server');

const server = new Server();

(async () => {
  // Sincronizamos Sequelize de forma forzada
  // es decir que ejecutará un DROP TABLE IF EXISTS
  await server.database.sync({ force: true });

  const { User, Genre, Movie, Character } = require('./models');

  // Lo utilizaremos para probar testear si falla cuando
  // intenta registrarse con un email ya registrado
  await User.create({
    email: 'test@test.com',
    // "12345678" hashed password
    password: '$2a$10$AzGqEvvs2td4y5F0w26Ykudbaj5o1AnFXVkcN6F04Bsnamorv3q.a',
  });

  // Iremos guardando las instancias para hacer las relaciones
  const animation = await Genre.create({
    uuid: '4275ddf3-a5ad-4ca1-aaed-f7fa0c6dbf1d',
    name: 'Animación',
  });
  const fantasy = await Genre.create({
    uuid: '58bc9ba4-d674-4ccc-9b8b-9e8ca65a8207',
    name: 'Fantasía',
  });

  const aliciaM = await Movie.create({
    uuid: '13a9dd8d-9268-4e4b-aca7-9a796f112fb7',
    title: 'Alicia en el país de las maravillas',
    creationDate: '1951-07-28',
    score: '3.9',
  });
  await aliciaM.addGenre(animation);

  const aliciaC = await Character.create({
    uuid: 'd08230b0-8aef-49bd-ac3d-b8cdc4517538',
    name: 'Alicia',
  });
  await aliciaC.addMovie(aliciaM);

  const gatoCheshire = await Character.create({
    uuid: 'cec702ea-aa91-4ff6-bf83-259b5e0a448e',
    name: 'Gato de Cheshire',
  });
  await gatoCheshire.addMovie(aliciaM);

  const herculesM = await Movie.create({
    uuid: 'ed6e465c-0c4a-4d05-8966-5a7323921e77',
    title: 'Hércules',
    creationDate: '1997-06-27',
    score: '3.8',
  });
  await herculesM.addGenre(animation);

  const herculesC = await Character.create({
    uuid: 'b86f287e-90fd-4f8e-ad11-58763f4cde3c',
    name: 'Hércules',
  });
  await herculesC.addMovie(herculesM);

  const pegaso = await Character.create({
    uuid: '550302d2-6454-4191-b106-d250dc45cf25',
    name: 'Pegaso',
  });
  await pegaso.addMovie(herculesM);

  const cruellaM = await Movie.create({
    uuid: 'f9095c83-a43a-48de-91b0-a20473f7fc4d',
    title: 'Cruella',
    creationDate: '2021-05-18',
    score: '4.85',
  });
  await cruellaM.addGenre(fantasy);

  const cruellaC = await Character.create({
    uuid: 'cebec37b-ce20-4419-aa78-399358e49c37',
    name: 'Cruella de Vil',
  });
  await cruellaC.addMovie(cruellaM);

  const maleficaM = await Movie.create({
    uuid: '7cd45949-c752-451c-8e90-a9f53a5e189f',
    title: 'Maléfica',
    creationDate: '2012-06-18',
    score: '3.5',
  });
  await maleficaM.addGenre(fantasy);

  const maleficaC = await Character.create({
    uuid: '2fdd2a43-d5f5-4d7b-ade8-a50ea03676f5',
    name: 'Maléfica',
  });
  await maleficaC.addMovie(maleficaM);

  const aurora = await Character.create({
    uuid: 'e731963c-2ac0-4eeb-9de4-5469689a5c33',
    name: 'Princesa Aurora',
  });
  await aurora.addMovie(maleficaM);

  console.log('Insertion completed successfully');
})();
