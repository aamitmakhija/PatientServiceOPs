const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../../api-gateway/src/app');

chai.use(chaiHttp);
const { expect } = chai;

describe('Unit Test: /ward/status route', function () {
  const BASE_URL = process.env.WARD_SERVICE_URL || 'http://localhost:5004';

  afterEach(() => {
    nock.cleanAll();
  });

  it('should return ward availability', async function () {
    nock(BASE_URL)
      .get('/status')
      .reply(200, { availableBeds: 5 });

    const res = await chai.request(app)
      .get('/ward/status');
    
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('availableBeds').eql(5);
  });
});