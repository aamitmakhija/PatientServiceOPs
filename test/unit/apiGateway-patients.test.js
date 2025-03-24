const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../../api-gateway/src/app');

chai.use(chaiHttp);
const { expect } = chai;

describe('Unit Test: /patient/patients/:id route', function () {
  const BASE_URL = process.env.PATIENT_SERVICE_URL || 'http://localhost:5002';

  afterEach(() => {
    nock.cleanAll();
  });

  it('should return patient data from mocked PatientService', async function () {
    const mockId = '123';
    const mockResponse = { id: 123, name: 'John Doe' };

    nock(BASE_URL)
      .get(`/patients/${mockId}`)
      .reply(200, mockResponse);

    const res = await chai.request(app)
      .get(`/patient/patients/${mockId}`);
    
    expect(res).to.have.status(200);
    expect(res.body).to.deep.equal(mockResponse);
  });

  it('should handle 404 when patient is not found', async function () {
    const mockId = '999';

    nock(BASE_URL)
      .get(`/patients/${mockId}`)
      .reply(404, { message: 'Not Found' });

    const res = await chai.request(app)
      .get(`/patient/patients/${mockId}`);
    
    expect(res).to.have.status(404);
    expect(res.body).to.have.property('message').eql('Not Found');
  });
});