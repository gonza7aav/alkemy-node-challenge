// Agrega las variables de entorno del archivo .env
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../../../controllers/Server');

const assert = chai.assert;

chai.use(chaiHttp);

describe('POST /auth/login', () => {
  let fakeServer;

  before(async () => {
    fakeServer = new Server();
    await fakeServer.start();
  });

  describe('Inicio de sesion', () => {
    describe('email', () => {
      it('válido', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/login')
          .send({
            email: 'test@test.com',
            password: '_',
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'Email y/o contraseña incorrecta');
            done();
          });
      });

      it('válido (sin registrar)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/login')
          .send({
            email: 'test@test.org',
            password: '_',
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'Email y/o contraseña incorrecta');
            done();
          });
      });

      it('válido (incompleto)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/login')
          .send({ email: 'test@test.com' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(res.body.errors, 'El email es inválido');
            done();
          });
      });

      it('inválido (no es email)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/login')
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
          .post('/auth/login')
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
          .post('/auth/login')
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
          .post('/auth/login')
          .send({ password: '_' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.notInclude(res.body.errors, 'La contraseña es inválida');
            done();
          });
      });

      it('inválido (vacío)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/login')
          .send({ password: '' })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'La contraseña es inválida');
            done();
          });
      });

      it('inválido (sin definir)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/login')
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 400);
            assert.isArray(res.body.errors);
            assert.include(res.body.errors, 'La contraseña es inválida');
            done();
          });
      });
    });

    describe('login válido', () => {
      it('↳', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/login')
          .send({
            email: 'test@test.com',
            password: '12345678',
          })
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 200);
            assert.property(res.header, 'set-cookie');
            assert.property(res.body, 'accessToken');
            done();
          });
      });
    });
  });
});
