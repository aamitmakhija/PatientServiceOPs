const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../../api-gateway/src/app');

chai.use(chaiHttp);
const { expect } = chai;

describe('Unit Test: /admission/assign route', function () {
  const BASE_URL = process.env.ADMISSION_SERVICE_URL || 'http://localhost:5003';

  afterEach(() => {
    nock.cleanAll();
  });

  it('should assign a patient to a ward', async function () {
    const payload = { patientId: '123', wardId: 'wardA' };

    nock(BASE_URL)
      .post('/assign', payload)
      .reply(200, { message: 'Patient assigned successfully' });

    const res = await chai.request(app)
      .post('/admission/assign')
      .send(payload);
    
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message').eql('Patient assigned successfully');
  });
});