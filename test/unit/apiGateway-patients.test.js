const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../../api-gateway/src/app');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Unit Test: /patient/patients/:id route', function () {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should return patient data from mocked PatientService', function (done) {
    const mockId = '123';
    const mockResponse = { id: 123, name: 'John Doe' };

    nock('http://localhost:5002')
      .get(`/patients/${mockId}`)
      .reply(200, mockResponse);

    chai.request(app)
      .get(`/patient/patients/${mockId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(mockResponse);
        done();
      });
  });

  it('should handle 404 when patient is not found', function (done) {
    const mockId = '999';

    nock('http://localhost:5002')
      .get(`/patients/${mockId}`)
      .reply(404, { message: 'Not Found' });

    chai.request(app)
      .get(`/patient/patients/${mockId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message').eql('Not Found');
        done();
      });
  });
});
