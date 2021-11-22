// Agrega las variables de entorno del archivo .env
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const Server = require('../../../controllers/Server');

const assert = chai.assert;

chai.use(chaiHttp);

describe('POST /auth/token', () => {
  let fakeServer, agent, agentOld;

  before(async () => {
    fakeServer = new Server();
    await fakeServer.start();

    // Inicio sesion para tener las cookies
    // agentOld = chai.request.agent(fakeServer.netServer);
    // await agentOld
    //   .post('/auth/login')
    //   .send({
    //     username: 'test@test.com',
    //     password: '12345678',
    //   })
    //   .end((err, res) => {
    //     assert.isNull(err);
    //     assert.equal(res.status, 200);
    //     expect(res).to.have.cookie('refreshToken');
    //     done();
    //   });

    // agent = chai.request.agent(fakeServer.netServer);
    // await agent
    //   .post('/auth/login')
    //   .send({
    //     username: 'test@test.com',
    //     password: '12345678',
    //   })
    //   .end((err, res) => {
    //     assert.isNull(err);
    //     assert.equal(res.status, 200);
    //     expect(res).to.have.cookie('refreshToken');
    //     done();
    //   });
  });

  // after(async () => {
  //   await agentOld.close();
  //   await agent.close();
  // });

  describe('Obtencion de token', () => {
    describe('cookies', () => {
      // TODO:
      // it('válido', (done) => {
      //   agent.post('/auth/token').end((err, res) => {
      //     assert.isNull(err);
      //     assert.equal(res.status, 200);
      //     assert.property(res.header, 'Set-Cookie');
      //     assert.property(res.body, 'accessToken');
      //     done();
      //   });
      // });

      // TODO:
      // it('válido (token viejo)', (done) => {
      //   agentOld.post('/auth/token').end((err, res) => {
      //     assert.isNull(err);
      //     assert.equal(res.status, 400);
      //     done();
      //   });
      // });

      // TODO:
      // it('válido (sin usuario)', (done) => {
      //   agent.post('/auth/token').end((err, res) => {
      //     assert.isNull(err);
      //     assert.equal(res.status, 400);
      //     done();
      //   });
      // });

      // TODO:
      // it('inválido (token)', (done) => {
      //   chai
      //     .request(fakeServer.netServer)
      //     .post('/auth/token')
      //     .end((err, res) => {
      //       assert.isNull(err);
      //       assert.equal(res.status, 403);
      //       done();
      //     });
      // });

      it('inválido (sin definir)', (done) => {
        chai
          .request(fakeServer.netServer)
          .post('/auth/token')
          .end((err, res) => {
            assert.isNull(err);
            assert.equal(res.status, 401);
            done();
          });
      });
    });
  });
});
