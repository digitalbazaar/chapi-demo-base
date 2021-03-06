/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const asyncHandler = require('express-async-handler');
const bodyBarser = require('body-parser');
const express = require('express');
const fs = require('fs');
const https = require('https');
const {validate, isJsonSchemaValidationError} = require('ejvm');
const uuid = require('uuid-random');
const validationSchemas = require('../schemas');
const {signCredential} = require('./proofHandler');

const {keyValueStore} = require('../vue-components/dist/assets/custom');

const app = express();

app.use(bodyBarser.json());

app.use('/', express.static('vue-components/dist'));

// NOTE: a production implementation should include authentication
app.post(
  '/verify', validate(validationSchemas.verifyPost),
  asyncHandler(async (req, res) => {

    const {body: {presentation}} = req;

    // TODO: send DID auth presentation to verifier
    // const didAuthResult = await verifier.verifyDid();
    const didAuthResult = {valid: true};

    if(!didAuthResult.valid) {
      throw new Error('DID authentication failed.');
    }

    // extract the DID from the presentation
    const {holder} = presentation;

    // TODO: dereference the recipient based on session/deep link
    // using mock in-memory store
    const {credential /*, recipient*/} = keyValueStore;

    // make a unique identifier for the credential
    credential.id = credential.id + uuid();

    // DID is valid, compose the new credential
    credential.credentialSubject.id = holder;

    // TODO this should call on the issuer to
    // sign the credential.
    const presentationFromIssuer = await signCredential({credential, holder});
    res.json(presentationFromIssuer);
  }));

app.use((err, req, res, next) => {
  if(isJsonSchemaValidationError(err)) {
    // handle the error here, e.g.:
    res.status(400);
    return res.json({
      statusText: 'ValidationError',
      jsonSchemaValidation: true,
      validation: err.validationErrors,
    });
  }
  // this is not a JsonSchemaValidationError, so do not handle it here
  // and let the next middleware/finalhandler handle it
  next(err);
});

const environment = process.env.NODE_ENV || 'development';
let config;
if(environment === 'production') {
  // FIXME: some path to be mapped to a docker volume
  config = require('../config');
} else {
  config = require('./config');
}

const {host, port} = config;

https.createServer({
  key: fs.readFileSync('./pki/demo.localhost.key'),
  cert: fs.readFileSync('./pki/demo.localhost.crt'),
}, app).listen(
  port, host, () => console.log(`Example app listening on port ${port}!`));
