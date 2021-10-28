// Agrega las variables de entorno del archivo .env
// eslint-disable-next-line import/no-extraneous-dependencies
if (process.env.NODE_ENV === 'development') require('dotenv').config();

const Server = require('./controllers/Server');

const server = new Server();

server.start();
