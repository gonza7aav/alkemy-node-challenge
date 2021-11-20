// Agrega las variables de entorno del archivo .env
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../../../controllers/Server');
const Token = require('../../../controllers/Token');

const assert = chai.assert;

chai.use(chaiHttp);

describe('DELETE /characters', () => {
  let fakeServer, token;

  before(async () => {
    fakeServer = new Server();
    await fakeServer.start();

    // Obtenemos un token de acceso
    token = Token.createAccessTokenWithoutExpiration({ uuid: 'test' });
  });

  describe('Borrado de Personajes', () => {
    describe('uuid', () => {
      it('válido', (done) => {
        chai
          .request(fakeServer.netServer)
          .delete('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({ uuid: 'e731963c-2ac0-4eeb-9de4-5469689a5c33' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 200);
            done();
          });
      });

      it('válido (no registrado)', (done) => {
        chai
          .request(fakeServer.netServer)
          .delete('/characters')
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
          .delete('/characters')
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
          .delete('/characters')
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
          .delete('/characters')
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
