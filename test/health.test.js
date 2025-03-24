const express = require('express');
const request = require('supertest');
const { expect } = require('chai');
const healthRoute = require('../api-gateway/src/routes/health');

const app = express();
app.use('/health', healthRoute); // Mounts health route

describe('GET /health', function() {
  this.timeout(20000); // Optional: Extend timeout for testing purposes
  it('should return status OK and valid uptime and timestamp', async () => {
    const res = await request(app).get('/health');

    // Log error responses
    if (res.statusCode !== 200) {
      console.error('Health response:', res.body);
    }

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('status', 'OK');
    expect(res.body).to.have.property('uptime').that.is.a('number');
    expect(res.body).to.have.property('timestamp').that.is.a('number');
  });
});