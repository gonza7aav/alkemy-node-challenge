// Agrega las variables de entorno del archivo .env
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../../../controllers/Server');

const assert = chai.assert;

chai.use(chaiHttp);

describe('POST /auth/logout', () => {
  let fakeServer;

  before(async () => {
    fakeServer = new Server();
    await fakeServer.start();
  });

  describe('Cierre de sesion', () => {
    it('↳', (done) => {
      chai
        .request(fakeServer.netServer)
        .post('/auth/logout')
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 200);
          assert.property(res.header, 'set-cookie');
          done();
        });
    });
  });
});
