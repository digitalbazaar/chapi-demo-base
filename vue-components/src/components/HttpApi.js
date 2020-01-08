'use strict';

import {create} from 'apisauce';

const api = create({
  timeout: 1000,
});

// submit a DID prentation to the local HTTP API which will verify that the
// DID presentation is valid and if so the backend will compose call
// to a credential issuance API and return the signed credential here.
export async function submitDidPresentation({presentation}) {
  const response = await api.post('/verify', {presentation});
  if(response.problem) {
    // a CLIENT_ERROR means that the HTTP request was successful, but the
    // HTTP API responded with an error e.g. schema validation on the
    // POST payload.
    if(response.problem === 'CLIENT_ERROR') {
      const error = {
        name: response.problem,
        details: response.data,
      };
      return {valid: false, error};
    }
    // all other types of errors go here e.g. connection refused/timeout
    return {valid: false, error: response.problem};
  }
  return response.data;
}
