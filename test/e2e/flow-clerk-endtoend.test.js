const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const jwt = require('jsonwebtoken');
const app = require('../../api-gateway/src/app');

chai.use(chaiHttp);
const { expect } = chai;

const TOKEN = jwt.sign({ role: 'clerk', username: 'clerk1' }, 'your-secret-key');

describe('End-to-End Flow: Login -> Register -> Assign', function () {
  const authURL = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';
  const patientURL = process.env.PATIENT_SERVICE_URL || 'http://localhost:5002';
  const admissionURL = process.env.ADMISSION_SERVICE_URL || 'http://localhost:5003';

  afterEach(() => {
    nock.cleanAll();
  });

  it('should perform login, register a patient, and assign them to a ward', async function () {
    this.timeout(10000);  // Set timeout for the entire flow

    const patient = { name: 'John Flow', age: 45 };
    const assign = { patientId: 'flow-123', wardId: 'ward-9' };

    // Mock /auth/login
    nock(authURL)
      .post('/api/auth/login')
      .reply(200, { token: TOKEN });

    // Mock /patient/register
    nock(patientURL)
      .post('/register')
      .reply(201, { message: 'Patient registered successfully', patientId: assign.patientId });

    // Mock /admission/assign
    nock(admissionURL)
      .post('/assign')
      .reply(200, { message: 'Patient assigned successfully' });

    // Start flow: Login -> Register -> Assign
    const loginRes = await chai.request(app)
      .post('/auth/login')
      .send({ username: 'clerk1', password: 'pass' });

    expect(loginRes).to.have.status(200);
    const token = loginRes.body.token;

    const registerRes = await chai.request(app)
      .post('/patient/register')
      .set('Authorization', `Bearer ${token}`)
      .send(patient);

    expect(registerRes).to.have.status(201);
    expect(registerRes.body).to.have.property('patientId');

    const assignRes = await chai.request(app)
      .post('/admission/assign')
      .set('Authorization', `Bearer ${token}`)
      .send(assign);

    expect(assignRes).to.have.status(200);
    expect(assignRes.body).to.have.property('message').eql('Patient assigned successfully');
  });

  it('should handle failure in admission service gracefully', async function () {
    const assign = { patientId: 'flow-123', wardId: 'ward-9' };

    nock(admissionURL)
      .post('/assign')
      .delay(100) // Simulate slow response
      .reply(500, { message: 'Assignment failed' });

    const res = await chai.request(app)
      .post('/admission/assign')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(assign);

    expect(res).to.have.status(500);
    expect(res.body).to.have.property('message').eql('Assignment failed');
  });
});