// Agrega las variables de entorno del archivo .env
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../../../controllers/Server');
const Token = require('../../../controllers/Token');

const assert = chai.assert;

chai.use(chaiHttp);

describe('PUT /characters', () => {
  let fakeServer, token;

  before(async () => {
    fakeServer = new Server();
    await fakeServer.start();

    // Obtenemos un token de acceso
    token = Token.createAccessTokenWithoutExpiration({ uuid: 'test' });
  });

  describe('Edición de Personajes', () => {
    describe('name', () => {
      it('válido', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(res.body.errors, 'El nombre es inválido');
            done();
          });
      });

      it('inválido (vacío)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: '' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El nombre es inválido');
            done();
          });
      });

      it('inválido (sin definir)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El nombre es inválido');
            done();
          });
      });
    });

    describe('age', () => {
      it('válido (int)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({ age: 0 })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'La edad debe ser un número entero'
            );
            done();
          });
      });

      it('inválido (float)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({ age: 99.9 })
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
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({ age: '_' })
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
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({ weight: 0 })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'El peso debe ser un número real'
            );
            done();
          });
      });

      it('válido (float)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({ weight: 99.9 })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'El peso debe ser un número real'
            );
            done();
          });
      });

      it('inválido (NaN)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({ weight: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El peso debe ser un número real');
            done();
          });
      });
    });

    describe('movies', () => {
      it('válido (1 elemento)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({ movies: ['13a9dd8d-9268-4e4b-aca7-9a796f112fb7'] })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'El arreglo de películas debe tener elementos'
            );
            assert.notInclude(
              res.body.errors,
              'El arreglo de películas contiene al menos una uuid inválida'
            );
            done();
          });
      });

      it('válido (2 elementos)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({
            movies: [
              '13a9dd8d-9268-4e4b-aca7-9a796f112fb7',
              'ed6e465c-0c4a-4d05-8966-5a7323921e77',
            ],
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'El arreglo de películas debe tener elementos'
            );
            assert.notInclude(
              res.body.errors,
              'El arreglo de películas contiene al menos una uuid inválida'
            );
            done();
          });
      });

      it('válido (sin registrar)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({
            uuid: 'd08230b0-8aef-49bd-ac3d-b8cdc4517538',
            name: '_',
            movies: ['35839164-8dc3-459c-b60c-7eb1609ad4a6'],
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'El arreglo de películas debe tener elementos'
            );
            assert.include(
              res.body.errors,
              'El arreglo de películas contiene al menos una uuid inválida'
            );
            done();
          });
      });

      it('válido (mixto)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({
            uuid: 'd08230b0-8aef-49bd-ac3d-b8cdc4517538',
            name: '_',
            movies: [
              '13a9dd8d-9268-4e4b-aca7-9a796f112fb7',
              '35839164-8dc3-459c-b60c-7eb1609ad4a6',
            ],
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'El arreglo de películas debe tener elementos'
            );
            assert.include(
              res.body.errors,
              'El arreglo de películas contiene al menos una uuid inválida'
            );
            done();
          });
      });

      it('inválido (no es uuid)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({
            uuid: 'd08230b0-8aef-49bd-ac3d-b8cdc4517538',
            name: '_',
            movies: ['_'],
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'El arreglo de películas debe tener elementos'
            );
            assert.include(
              res.body.errors,
              'El arreglo de películas contiene al menos una uuid inválida'
            );
            done();
          });
      });

      it('inválido (vacío)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({ movies: '' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'El arreglo de películas debe tener elementos'
            );
            assert.notInclude(
              res.body.errors,
              'El arreglo de películas contiene al menos una uuid inválida'
            );
            done();
          });
      });

      it('inválido (sin definir)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'El arreglo de películas debe tener elementos'
            );
            assert.notInclude(
              res.body.errors,
              'El arreglo de películas contiene al menos una uuid inválida'
            );
            done();
          });
      });
    });

    describe('uuid', () => {
      it('válido (sin registar)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({
            uuid: '35839164-8dc3-459c-b60c-7eb1609ad4a6',
            name: '_',
            movies: ['13a9dd8d-9268-4e4b-aca7-9a796f112fb7'],
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 404);
            done();
          });
      });

      it('inválido (no es uuid)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
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

      it('inválido (sin definir)', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
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

    describe('válidos', () => {
      it('sin opcionales', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({
            uuid: 'd08230b0-8aef-49bd-ac3d-b8cdc4517538',
            name: '_',
            movies: ['13a9dd8d-9268-4e4b-aca7-9a796f112fb7'],
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 200);
            done();
          });
      });

      it('con opcionales', (done) => {
        chai
          .request(fakeServer.netServer)
          .put('/characters')
          .set('Authorization', `Bearer ${token}`)
          .send({
            uuid: 'd08230b0-8aef-49bd-ac3d-b8cdc4517538',
            image: '0',
            name: '_',
            age: 0,
            weight: 99.9,
            movies: [
              '13a9dd8d-9268-4e4b-aca7-9a796f112fb7',
              'ed6e465c-0c4a-4d05-8966-5a7323921e77',
            ],
            history: '_',
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 200);
            done();
          });
      });
    });
  });
});
