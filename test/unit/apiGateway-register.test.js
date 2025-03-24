const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../../api-gateway/src/app');

chai.use(chaiHttp);
const { expect } = chai;

describe('Unit Test: /patient/register route', function () {
  const BASE_URL = process.env.PATIENT_SERVICE_URL || 'http://localhost:5002';

  afterEach(() => {
    nock.cleanAll();
  });

  it('should register a patient via mocked PatientService', async function () {
    const payload = { name: 'Jane Doe', age: 28 };

    nock(BASE_URL)
      .post('/register')
      .reply(201, { message: 'Patient registered successfully' });

    const res = await chai.request(app)
      .post('/patient/register')
      .send(payload);
    
    expect(res).to.have.status(201);
    expect(res.body).to.have.property('message').eql('Patient registered successfully');
  });

  it('should return 400 if registration fails', async function () {
    const invalidPayload = {}; // Mock invalid data

    nock(BASE_URL)
      .post('/register', invalidPayload)
      .reply(400, { message: 'Invalid data' });

    const res = await chai.request(app)
      .post('/patient/register')
      .send(invalidPayload);
    
    expect(res).to.have.status(400);
    expect(res.body).to.have.property('message').eql('Invalid data');
  });
});