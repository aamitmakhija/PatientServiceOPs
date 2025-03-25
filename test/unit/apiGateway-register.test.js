const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../../api-gateway/src/app');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Unit Test: /patient/register route', function () {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should register a patient via mocked PatientService', function (done) {
    const payload = { name: 'Jane Doe', age: 28 };

    nock('http://localhost:5002')
      .post('/register', payload)
      .reply(201, { message: 'Patient registered successfully' });

    chai.request(app)
      .post('/patient/register')
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message').eql('Patient registered successfully');
        done();
      });
  });

  it('should return 400 if registration fails', function (done) {
    const payload = { name: 'Jane Doe' }; // Missing age to simulate failure

    nock('http://localhost:5002')
      .post('/register', payload)
      .reply(400, { message: 'Invalid registration data' });

    chai.request(app)
      .post('/patient/register')
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message').eql('Invalid registration data');
        done();
      });
  });
});
