// Agrega las variables de entorno del archivo .env
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../../../controllers/Server');
const Token = require('../../../controllers/Token');

const assert = chai.assert;

chai.use(chaiHttp);

describe('POST /movies', () => {
  let fakeServer, token;

  before(async () => {
    fakeServer = new Server();
    await fakeServer.start();

    // Obtenemos un token de acceso
    token = Token.createAccessTokenWithoutExpiration({ uuid: 'test' });
  });

  describe('Creación de Peliculas', () => {
    describe('title', () => {
      it('válido', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(res.body.errors, 'El título es inválido');
            done();
          });
      });

      it('inválido (vacío)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ title: '' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El título es inválido');
            done();
          });
      });

      it('inválido (sin definir)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El título es inválido');
            done();
          });
      });
    });

    describe('creationDate', () => {
      it('válido', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ creationDate: '2000/01/01' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'La fecha de creación es inválida o no sigue el formato "YYYY/MM/DD"'
            );
            done();
          });
      });

      it('inválido (no es fecha)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ creationDate: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'La fecha de creación es inválida o no sigue el formato "YYYY/MM/DD"'
            );
            done();
          });
      });

      it('inválido (vacío)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ creationDate: '' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'La fecha de creación es inválida o no sigue el formato "YYYY/MM/DD"'
            );
            done();
          });
      });

      it('inválido (sin definir)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'La fecha de creación es inválida o no sigue el formato "YYYY/MM/DD"'
            );
            done();
          });
      });
    });

    describe('score', () => {
      it('válido (int)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ score: 4 })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'La calificación debe ser un número real entre 1 y 5'
            );
            done();
          });
      });

      it('válido (float)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ score: 4.5 })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'La calificación debe ser un número real entre 1 y 5'
            );
            done();
          });
      });

      it('inválido (NaN)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ score: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'La calificación debe ser un número real entre 1 y 5'
            );
            done();
          });
      });

      it('inválido (< 1)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ score: 0 })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'La calificación debe ser un número real entre 1 y 5'
            );
            done();
          });
      });

      it('inválido (> 5)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ score: 6 })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'La calificación debe ser un número real entre 1 y 5'
            );
            done();
          });
      });
    });

    describe('genres', () => {
      it('válido (1 elemento)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ genres: ['4275ddf3-a5ad-4ca1-aaed-f7fa0c6dbf1d'] })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'El arreglo de géneros debe tener elementos'
            );
            assert.notInclude(
              res.body.errors,
              'El arreglo de géneros contiene al menos una uuid inválida'
            );
            done();
          });
      });

      it('válido (2 elementos)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({
            genres: [
              '4275ddf3-a5ad-4ca1-aaed-f7fa0c6dbf1d',
              '58bc9ba4-d674-4ccc-9b8b-9e8ca65a8207',
            ],
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'El arreglo de géneros debe tener elementos'
            );
            assert.notInclude(
              res.body.errors,
              'El arreglo de géneros contiene al menos una uuid inválida'
            );
            done();
          });
      });

      it('válido (sin registar)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: '_',
            creationDate: '2000/01/01',
            score: 3,
            genres: ['35839164-8dc3-459c-b60c-7eb1609ad4a6'],
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'El arreglo de géneros debe tener elementos'
            );
            assert.include(
              res.body.errors,
              'El arreglo de géneros contiene al menos una uuid inválida'
            );
            done();
          });
      });

      it('válido (mixto)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: '_',
            creationDate: '2000/01/01',
            score: 3,
            genres: [
              '4275ddf3-a5ad-4ca1-aaed-f7fa0c6dbf1d',
              '35839164-8dc3-459c-b60c-7eb1609ad4a6',
            ],
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'El arreglo de géneros debe tener elementos'
            );
            assert.include(
              res.body.errors,
              'El arreglo de géneros contiene al menos una uuid inválida'
            );
            done();
          });
      });

      it('inválido (no es uuid)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: '_',
            creationDate: '2000/01/01',
            score: 3,
            genres: ['_'],
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'El arreglo de géneros debe tener elementos'
            );
            assert.include(
              res.body.errors,
              'El arreglo de géneros contiene al menos una uuid inválida'
            );
            done();
          });
      });

      it('inválido (vacío)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({ genres: '' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'El arreglo de géneros debe tener elementos'
            );
            assert.notInclude(
              res.body.errors,
              'El arreglo de géneros contiene al menos una uuid inválida'
            );
            done();
          });
      });

      it('inválido (sin definir)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'El arreglo de géneros debe tener elementos'
            );
            assert.notInclude(
              res.body.errors,
              'El arreglo de géneros contiene al menos una uuid inválida'
            );
            done();
          });
      });
    });

    describe('válidos', () => {
      it('sin opcionales', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: '_',
            creationDate: '2000/01/01',
            score: 3,
            genres: ['4275ddf3-a5ad-4ca1-aaed-f7fa0c6dbf1d'],
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 201);
            done();
          });
      });

      it('con opcionales', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/movies')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: '_',
            image: '0',
            creationDate: '2000/01/01',
            score: 3,
            genres: [
              '4275ddf3-a5ad-4ca1-aaed-f7fa0c6dbf1d',
              '58bc9ba4-d674-4ccc-9b8b-9e8ca65a8207',
            ],
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 201);
            done();
          });
      });
    });
  });
});
