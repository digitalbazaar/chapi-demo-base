'use strict';

const {image} = require('./image');

const kv = exports.keyValueStore = {};

const issuer = kv.issuer = {
  id: 'did:v1:test:nym:z6Mkq4uyWFYWP9rPrrKhJnbU7jBDBc2p8gXJHyQ26L6uS8uD',
  // This will appear in the Credential Card.
  image
};

kv.recipient = {
  familyName: 'Park',
  givenName: 'John',
  alumniOf: {
    id: 'did:example:c276e12ec21ebfeb1f712ebc6f1',
    name: 'Example University'
  }
};

// This credentialSubject should follow a schema from schema.org
// This example uses https://schema.org/Person for the credentialSubject
kv.credential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://schema.org'
  ],
  id: 'http://example.edu/credentials/1872',
  type: ['VerifiableCredential', 'AlumniCredential'],
  issuer,
  issuanceDate: '2010-01-01T19:73:24Z',
  // This will appear in the Credential Card
  name: 'University Enrollment Credential',
  // This will appear in the Credential Card
  description: 'This verifies enrollment in a University',
  credentialSubject: {
    id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
    familyName: 'Park',
    givenName: 'John',
    alumniOf: {
      id: 'did:example:c276e12ec21ebfeb1f712ebc6f1',
      name: 'Example University'
    }
  }
};

kv.proof = {
  type: 'RsaSignature2018',
  created: '2017-06-18T21:19:10Z',
  proofPurpose: 'assertionMethod',
  verificationMethod: 'https://example.edu/issuers/keys/1',
  // jws stands for: https://en.wikipedia.org/wiki/JSON_Web_Signature
  jws: 'eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19' +
    'TCYt5XsITJX1CxPCT8yAVTVkIEqPbChOMqsLfRoPsnsgw5WEuts01mqpQy7UJ' +
    'iN5mgRxDWUcX16dUEMGlv50aqzpqh4Qktb3rkBuQy72IFLOqV0GzS245kronKb7' +
    '8cPN25DGlcTwLtjPAYuNzVBAh4vGHSrQyHUdBBPM'
};
