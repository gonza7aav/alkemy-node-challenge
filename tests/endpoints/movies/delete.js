// Agrega las variables de entorno del archivo .env
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../../../controllers/Server');
const Token = require('../../../controllers/Token');

const assert = chai.assert;

chai.use(chaiHttp);

describe('DELETE /movies', () => {
  let fakeServer, token;

  before(async () => {
    fakeServer = new Server();
    await fakeServer.start();

    // Obtenemos un token de acceso
    token = Token.createAccessTokenWithoutExpiration({ uuid: 'test' });
  });

  describe('Borrado de Peliculas', () => {
    describe('uuid', () => {
      it('válido', (done) => {
        chai
          .request(fakeServer.netServer)
          .delete('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ uuid: '7cd45949-c752-451c-8e90-a9f53a5e189f' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 200);
            done();
          });
      });

      it('válido (sin registar)', (done) => {
        chai
          .request(fakeServer.netServer)
          .delete('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ uuid: '35839164-8dc3-459c-b60c-7eb1609ad4a6' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 404);
            done();
          });
      });

      it('inválido (no es uuid)', (done) => {
        chai
          .request(fakeServer.netServer)
          .delete('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ uuid: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El uuid es inválido');
            done();
          });
      });

      it('inválido (vacío)', (done) => {
        chai
          .request(fakeServer.netServer)
          .delete('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ uuid: '' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El uuid es inválido');
            done();
          });
      });

      it('inválido (sin definir)', (done) => {
        chai
          .request(fakeServer.netServer)
          .delete('/movies')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El uuid es inválido');
            done();
          });
      });
    });
  });
});
