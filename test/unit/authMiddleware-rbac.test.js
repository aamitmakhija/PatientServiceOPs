const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('../../api-gateway/src/app');
const nock = require('nock');

chai.use(chaiHttp);
const { expect } = chai;

const patientService = process.env.PATIENT_SERVICE_URL || 'http://localhost:5002';
const validPayload = { name: 'Test RBAC', age: 40 };

const clerkToken = jwt.sign({ role: 'clerk', username: 'clerk1' }, 'secret-key');
const doctorToken = jwt.sign({ role: 'doctor', username: 'doc1' }, 'secret-key');
const invalidToken = 'Bearer malformed.token.value';

describe('RBAC Middleware Tests: /patient/register', function () {
  afterEach(() => nock.cleanAll());

  it('should allow a clerk to register a patient', async () => {
    nock(patientService)
      .post('/register')
      .reply(201, { message: 'Patient registered successfully' });

    const res = await chai.request(app)
      .post('/patient/register')
      .set('Authorization', `Bearer ${clerkToken}`)
      .send(validPayload);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('message', 'Patient registered successfully');
  });

  it('should reject a doctor from registering a patient', async () => {
    nock(patientService)
      .post('/register')
      .reply(403, { message: 'Forbidden' });

    const res = await chai.request(app)
      .post('/patient/register')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send(validPayload);

    expect(res).to.have.status(403);
    expect(res.body).to.have.property('message', 'Forbidden');
  });

  it('should reject a request with no token', async () => {
    nock(patientService)
      .post('/register')
      .reply(401, { message: 'Unauthorized' });

    const res = await chai.request(app)
      .post('/patient/register')
      .send(validPayload);

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('message', 'Unauthorized');
  });

  it('should reject a request with an invalid token', async () => {
    nock(patientService)
      .post('/register')
      .reply(401, { message: 'Invalid token' });

    const res = await chai.request(app)
      .post('/patient/register')
      .set('Authorization', invalidToken)
      .send(validPayload);

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('message', 'Invalid token');
  });
});