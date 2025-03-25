const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const jwt = require('jsonwebtoken');
const app = require('../../api-gateway/src/app');

const expect = chai.expect;
chai.use(chaiHttp);

describe('RBAC Middleware Tests: /patient/register', function () {
  const patientService = 'http://localhost:5002';
  const payload = { name: 'John RBAC', age: 50 };

  const clerkToken = jwt.sign({ role: 'clerk' }, 'your-secret-key');
  const doctorToken = jwt.sign({ role: 'doctor' }, 'your-secret-key');
  const invalidToken = 'invalid.token.value';

  afterEach(() => {
    nock.cleanAll();
  });

  it('should allow a clerk to register a patient', function (done) {
    nock(patientService)
      .post('/register')
      .reply(201, { message: 'Registered by clerk' });

    chai.request(app)
      .post('/patient/register')
      .set('Authorization', `Bearer ${clerkToken}`)
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.message).to.equal('Registered by clerk');
        done();
      });
  });

  it('should reject a doctor from registering a patient', function (done) {
    nock(patientService)
      .post('/register')
      .reply(403, { message: 'Forbidden' });

    chai.request(app)
      .post('/patient/register')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Forbidden');
        done();
      });
  });

  it('should reject a request with no token', function (done) {
    nock(patientService)
      .post('/register')
      .reply(401, { message: 'Unauthorized' });

    chai.request(app)
      .post('/patient/register')
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Unauthorized');
        done();
      });
  });

  it('should reject a request with an invalid token', function (done) {
    nock(patientService)
      .post('/register')
      .reply(401, { message: 'Invalid token' });

    chai.request(app)
      .post('/patient/register')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Invalid token');
        done();
      });
  });
});
