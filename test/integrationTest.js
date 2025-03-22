const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app'); // API Gateway

chai.use(chaiHttp);
chai.should();

describe('Integration Test: API Gateway', function() {
    it('should forward the request to PatientService for /patients endpoint', function(done) {
        chai.request(server)
            .get('/api/v1/patients/123')  // Example endpoint
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('id').eql(123);  // Assuming the response contains an ID
                done();
            });
    });
});