/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */

// Agrega las variables de entorno del archivo .env
if (process.env.NODE_ENV === 'development') require('dotenv').config();

const Server = require('./controllers/Server');

const server = new Server();

server.start();
