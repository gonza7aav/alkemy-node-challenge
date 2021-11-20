// Agrega las variables de entorno del archivo .env
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../../../controllers/Server');
const Token = require('../../../controllers/Token');

const assert = chai.assert;

chai.use(chaiHttp);

describe('GET /movies', () => {
  let fakeServer, token;

  before(async () => {
    fakeServer = new Server();
    await fakeServer.start();

    // Obtenemos un token de acceso
    token = Token.createAccessTokenWithoutExpiration({ uuid: 'test' });
  });

  describe('Listado de Peliculas', () => {
    it('↳', (done) => {
      chai
        .request(fakeServer.netServer)
        .get('/movies')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach((x) => {
            assert.property(x, 'image');
            assert.property(x, 'title');
            assert.property(x, 'creationDate');
          });
          done();
        });
    });
  });

  describe('Búsqueda de Peliculas', () => {
    describe('title', () => {
      it('válido', (done) => {
        chai
          .request(fakeServer.netServer)
          .get('/movies')
          .set('Authorization', `Bearer ${token}`)
          .query({ title: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
          });
      });
    });

    describe('order', () => {
      it('válido (ASC)', (done) => {
        chai
          .request(fakeServer.netServer)
          .get('/movies')
          .set('Authorization', `Bearer ${token}`)
          .query({ order: 'ASC' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 200);

            let isAscendingSorted = true;
            let previousDate = new Date(res.body[0].creationDate);
            for (let i = 0; i < res.body.length; i++) {
              assert.property(res.body[i], 'uuid');
              assert.property(res.body[i], 'title');
              assert.property(res.body[i], 'image');
              assert.property(res.body[i], 'creationDate');
              assert.property(res.body[i], 'score');
              assert.property(res.body[i], 'Genres');
              assert.property(res.body[i], 'Characters');

              let currentDate = new Date(res.body[i].creationDate);
              if (currentDate.getTime() < previousDate.getTime()) {
                isAscendingSorted = false;
              }

              previousDate = currentDate;
            }

            done();
          });
      });

      it('válido (DESC)', (done) => {
        chai
          .request(fakeServer.netServer)
          .get('/movies')
          .set('Authorization', `Bearer ${token}`)
          .query({ order: 'DESC' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 200);

            let isDescendingSorted = true;
            let previousDate = new Date(res.body[0].creationDate);
            for (let i = 0; i < res.body.length; i++) {
              assert.property(res.body[i], 'uuid');
              assert.property(res.body[i], 'title');
              assert.property(res.body[i], 'image');
              assert.property(res.body[i], 'creationDate');
              assert.property(res.body[i], 'score');
              assert.property(res.body[i], 'Genres');
              assert.property(res.body[i], 'Characters');

              let currentDate = new Date(res.body[i].creationDate);
              if (currentDate.getTime() > previousDate.getTime()) {
                isDescendingSorted = false;
              }

              previousDate = currentDate;
            }

            done();
          });
      });

      it('inválido', (done) => {
        chai
          .request(fakeServer.netServer)
          .get('/movies')
          .set('Authorization', `Bearer ${token}`)
          .query({ order: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El orden debe ser "ASC" o "DESC"');
            done();
          });
      });
    });

    describe('genre', () => {
      it('válido', (done) => {
        chai
          .request(fakeServer.netServer)
          .get('/movies')
          .set('Authorization', `Bearer ${token}`)
          .query({ genre: '35839164-8dc3-459c-b60c-7eb1609ad4a6' })
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
          .get('/movies')
          .set('Authorization', `Bearer ${token}`)
          .query({ genre: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El género es inválida');
            done();
          });
      });
    });
  });

  describe('Detalle de Peliculas', () => {
    it('válido', (done) => {
      chai
        .request(fakeServer.netServer)
        .get('/movies')
        .set('Authorization', `Bearer ${token}`)
        .query({ uuid: '13a9dd8d-9268-4e4b-aca7-9a796f112fb7' })
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.lengthOf(res.body, 1);
          assert.property(res.body[0], 'uuid');
          assert.property(res.body[0], 'title');
          assert.property(res.body[0], 'image');
          assert.property(res.body[0], 'creationDate');
          assert.property(res.body[0], 'score');
          assert.property(res.body[0], 'Genres');
          assert.property(res.body[0], 'Characters');
          done();
        });
    });

    it('inválido (no es uuid)', (done) => {
      chai
        .request(fakeServer.netServer)
        .get('/movies')
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
