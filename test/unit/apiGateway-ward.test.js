const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../../api-gateway/src/app');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Unit Test: /ward/status route', function () {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should return ward availability', function (done) {
    nock('http://localhost:5004')
      .get('/status')
      .reply(200, { available: true, beds: 8 });

    chai.request(app)
      .get('/ward/status')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ available: true, beds: 8 });
        done();
      });
  });
});
