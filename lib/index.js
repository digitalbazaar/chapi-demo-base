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
const validationSchemas = require('../schemas');

const app = express();

app.use(bodyBarser.json());

app.use('/', express.static('vue-components/dist'));

// NOTE: a production implementation should include authentication
app.post(
  '/verify', validate(validationSchemas.verifyPost),
  asyncHandler(async (req, res) => {
    // TODO: implement issuer API call
    res.json({valid: false});
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
