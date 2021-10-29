const express = require('express');
const { sequelize } = require('../models');

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
        console.log(`API running at http://localhost:${this.port}`)
      );
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Server;
