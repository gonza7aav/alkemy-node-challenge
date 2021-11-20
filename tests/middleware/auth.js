// Agrega las variables de entorno del archivo .env
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../../controllers/Server');
const Token = require('../../controllers/Token');

const assert = chai.assert;

chai.use(chaiHttp);

describe('Middleware auth', () => {
  // Utilizamos solo el endpoint GET /characters ya que se implementa
  // de la misma forma en los demás endpoints

  let fakeServer, token;

  before(async () => {
    fakeServer = new Server();
    await fakeServer.start();

    // Obtenemos un token de acceso
    token = Token.createAccessTokenWithoutExpiration({ uuid: 'test' });
  });

  describe('token de acceso', () => {
    it('válido', (done) => {
      chai
        .request(fakeServer.netServer)
        .get('/characters')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 200);
          done();
        });
    });

    it('inválido (no es token)', (done) => {
      chai
        .request(fakeServer.netServer)
        .get('/characters')
        .set('Authorization', `Bearer abc`)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 403);
          done();
        });
    });

    it('inválido (sin definir)', (done) => {
      chai
        .request(fakeServer.netServer)
        .get('/characters')
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 401);
          done();
        });
    });
  });
});
