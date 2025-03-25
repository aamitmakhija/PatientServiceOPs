const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../../api-gateway/src/app');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Unit Test: /admission/assign route', function () {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should assign a patient to a ward', function (done) {
    const payload = {
      patientId: '123',
      wardId: 'W1',
    };

    nock('http://localhost:5003')
      .post('/assign', payload)
      .reply(200, { message: 'Assigned successfully' });

    chai.request(app)
      .post('/admission/assign')
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').eql('Assigned successfully');
        done();
      });
  });
});
