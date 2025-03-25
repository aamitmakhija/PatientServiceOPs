const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const jwt = require('jsonwebtoken');
const app = require('../../api-gateway/src/app');

const expect = chai.expect;
chai.use(chaiHttp);

describe('End-to-End Flow: Login -> Register -> Assign', function () {
  const authService = 'http://localhost:5001';
  const patientService = 'http://localhost:5002';
  const admissionService = 'http://localhost:5003';

  const mockClerkToken = jwt.sign({ role: 'clerk' }, 'your-secret-key');
  const patientPayload = { name: 'Clerk Flow', age: 55 };
  const assignPayload = { patientId: 'abc123', wardId: 'wardX' };

  afterEach(() => {
    nock.cleanAll();
  });

  it('should perform login, register a patient, and assign them to a ward', function (done) {
    nock(authService)
      .post('/api/auth/login')
      .reply(200, { token: mockClerkToken });

    nock(patientService)
      .post('/register', patientPayload)
      .reply(201, { message: 'Patient registered successfully' });

    nock(admissionService)
      .post('/assign', assignPayload)
      .reply(200, { message: 'Assigned to ward successfully' });

    chai.request(app)
      .post('/auth/login')
      .send({ username: 'clerk', password: 'test' })
      .end((err, loginRes) => {
        const token = loginRes.body.token;

        chai.request(app)
          .post('/patient/register')
          .set('Authorization', `Bearer ${token}`)
          .send(patientPayload)
          .end((err, regRes) => {
            expect(regRes).to.have.status(201);

            chai.request(app)
              .post('/admission/assign')
              .set('Authorization', `Bearer ${token}`)
              .send(assignPayload)
              .end((err, assignRes) => {
                expect(assignRes).to.have.status(200);
                done();
              });
          });
      });
  });

  it('should handle failure in admission service gracefully', function (done) {
    nock(admissionService)
      .post('/assign', assignPayload)
      .delay(50)
      .reply(500, { message: 'Assignment failed' });

    chai.request(app)
      .post('/admission/assign')
      .set('Authorization', `Bearer ${mockClerkToken}`)
      .send(assignPayload)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.message).to.equal('Assignment failed');
        done();
      });
  });
});
