// Agrega las variables de entorno del archivo .env
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../../../controllers/Server');

const assert = chai.assert;

chai.use(chaiHttp);

describe('POST /auth/register', () => {
  let fakeServer;

  before(async () => {
    fakeServer = new Server();
    await fakeServer.start();
  });

  describe('Registro de usuario', () => {
    describe('email', () => {
      it('válido (incompleto)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/register')
          .send({ email: 'test@test.com' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(res.body.errors, 'El email es inválido');
            done();
          });
      });

      it('válido (ya registrado)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/register')
          .send({
            email: 'test@test.com',
            password: '12345678',
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El email es inválido');
            done();
          });
      });

      it('inválido (no es email)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/register')
          .send({ email: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El email es inválido');
            done();
          });
      });

      it('inválido (vacío)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/register')
          .send({ email: '' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El email es inválido');
            done();
          });
      });

      it('inválido (sin definir)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/register')
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'El email es inválido');
            done();
          });
      });
    });

    describe('password', () => {
      it('válido', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/register')
          .send({ password: '12345678' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(
              res.body.errors,
              'La contraseña debe tener al menos 8 caracteres'
            );
            done();
          });
      });

      it('inválido (< 8 caracteres)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/register')
          .send({ password: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'La contraseña debe tener al menos 8 caracteres'
            );
            done();
          });
      });

      it('inválido (vacío)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/register')
          .send({ password: '' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'La contraseña debe tener al menos 8 caracteres'
            );
            done();
          });
      });

      it('inválido (sin definir)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/register')
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(
              res.body.errors,
              'La contraseña debe tener al menos 8 caracteres'
            );
            done();
          });
      });
    });

    describe('registro válido', () => {
      it('↳', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/register')
          .send({
            email: 'test2@test.com',
            password: '12345678',
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
