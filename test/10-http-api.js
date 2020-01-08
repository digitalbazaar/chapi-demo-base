'use strict';

const {create} = require('apisauce');
const should = require('chai').should();

require('../lib');

const baseURL = `http://localhost:8080`;
const api = create({
  baseURL,
  // httpsAgent: new https.Agent({rejectUnauthorized: strictSSL}),
  timeout: 1000,
});

describe('http-api', () => {
  it('a valid request succeeds', async () => {
    const result = await api.post('/verify', {presentation: {some: 'data'}});
    result.status.should.equal(200);
    result.data.should.eql({valid: false});
  });
  it('an invalid request fails', async () => {
    // presentation2 is not a valid property
    const result = await api.post('/verify', {presentation2: {some: 'data'}});
    result.status.should.equal(400);
    should.exist(result.data);
    result.data.should.be.an('object');
    should.exist(result.data.statusText);
    result.data.statusText.should.equal('ValidationError');
  });
});
