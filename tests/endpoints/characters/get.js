// Agrega las variables de entorno del archivo .env
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../../../controllers/Server');
const Token = require('../../../controllers/Token');

const assert = chai.assert;

chai.use(chaiHttp);

describe('GET /characters', () => {
  let fakeServer, token;

  before(async () => {
    fakeServer = new Server();
    await fakeServer.start();

    // Obtenemos un token de acceso
    token = Token.createAccessTokenWithoutExpiration({ uuid: 'test' });
  });

  describe('Listado de Personajes', () => {
    it('↳', (done) => {
      chai
        .request(fakeServer.netServer)
        .get('/characters')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach((x) => {
            assert.property(x, 'image');
            assert.property(x, 'name');
          });
          done();
        });
    });
  });

  describe('Búsqueda de Personajes', () => {
    describe('age', () => {
      it('válido (int)', (done) => {
        chai
          .request(fakeServer.netServer)
          .get('/characters')
          .set('Authorization', `Bearer ${token}`)
          .query({ age: 0 })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
          });
      });

      it('inválido (float)', (done) => {
        chai
          .request(fakeServer.netServer)
          .get('/characters')
          .set('Authorization', `Bearer ${token}`)
          .query({ age: 99.9 })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'La edad debe ser un número entero'
            );
            done();
          });
      });

      it('inválido (NaN)', (done) => {
        chai
          .request(fakeServer.netServer)
          .get('/characters')
          .set('Authorization', `Bearer ${token}`)
          .query({ age: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'La edad debe ser un número entero'
            );
            done();
          });
      });
    });

    describe('weight', () => {
      it('válido (int)', (done) => {
        chai
          .request(fakeServer.netServer)
          .get('/characters')
          .set('Authorization', `Bearer ${token}`)
          .query({ weight: 0 })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
          });
      });

      it('válido (float)', (done) => {
        chai
          .request(fakeServer.netServer)
          .get('/characters')
          .set('Authorization', `Bearer ${token}`)
          .query({ weight: 99.9 })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
          });
      });

      it('inválido (NaN)', (done) => {
        chai
          .request(fakeServer.netServer)
          .get('/characters')
          .set('Authorization', `Bearer ${token}`)
          .query({ weight: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El peso debe ser un número real');
            done();
          });
      });
    });

    describe('movie', () => {
      it('válido', (done) => {
        chai
          .request(fakeServer.netServer)
          .get('/characters')
          .set('Authorization', `Bearer ${token}`)
          .query({ movie: '35839164-8dc3-459c-b60c-7eb1609ad4a6' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
          });
      });

      it('inválido (no es uuid)', (done) => {
        chai
          .request(fakeServer.netServer)
          .get('/characters')
          .set('Authorization', `Bearer ${token}`)
          .query({ movie: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'La película es inválida');
            done();
          });
      });
    });
  });

  describe('Detalle de Personajes', () => {
    it('válido', (done) => {
      chai
        .request(fakeServer.netServer)
        .get('/characters')
        .set('Authorization', `Bearer ${token}`)
        .query({ uuid: 'd08230b0-8aef-49bd-ac3d-b8cdc4517538' })
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.lengthOf(res.body, 1);
          assert.property(res.body[0], 'uuid');
          assert.property(res.body[0], 'image');
          assert.property(res.body[0], 'name');
          assert.property(res.body[0], 'age');
          assert.property(res.body[0], 'weight');
          assert.property(res.body[0], 'history');
          assert.property(res.body[0], 'Movies');
          done();
        });
    });

    it('inválido (no es uuid)', (done) => {
      chai
        .request(fakeServer.netServer)
        .get('/characters')
        .set('Authorization', `Bearer ${token}`)
        .query({ uuid: '_' })
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
