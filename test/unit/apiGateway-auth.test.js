const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const app = require('../../api-gateway/src/app');  // Make sure this points to your app correctly

chai.use(chaiHttp);
const { expect } = chai;

describe('Unit Test: /auth/login route', function () {
  const BASE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';

  afterEach(() => {
    nock.cleanAll();  // Clean up after each test to prevent leakage between tests
  });

  it('should return a token on valid login', async function () {
    const payload = { username: 'clerk', password: 'password' };

    // Mock the backend auth service
    nock(BASE_URL)
      .post('/api/auth/login', payload) // Match the path to your backend service
      .reply(200, { token: 'fake-jwt-token' });

    // Test the API Gateway endpoint
    const res = await chai.request(app)
      .post('/auth/login')  // The route defined in your API Gateway
      .send(payload);
    
    // Assertions
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('token').eql('fake-jwt-token');
  });
});