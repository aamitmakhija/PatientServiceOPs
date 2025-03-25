const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../../api-gateway/src/app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Unit Test: /auth/login route', function () {
  const BASE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

  afterEach(() => {
    nock.cleanAll();
  });

  it('should return a token on valid login', function (done) {
    const payload = { username: 'clerk', password: 'password' };

    nock(BASE_URL)
      .post('/api/auth/login', payload)
      .reply(200, { token: 'fake-jwt-token' });

    chai.request(app)
      .post('/auth/login')
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token').eql('fake-jwt-token');
        done();
      });
  });
});
