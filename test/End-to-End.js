const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app'); // API Gateway

chai.use(chaiHttp);
chai.should();

describe('End-to-End Test: Full Request Flow', function() {
    it('should handle patient registration process correctly', function(done) {
        chai.request(server)
            .post('/api/v1/register')
            .send({ name: 'John Doe', age: 30 })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('message').eql('Patient registered successfully');
                done();
            });
    });
});