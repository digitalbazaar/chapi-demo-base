/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const asyncHandler = require('express-async-handler');
const bodyBarser = require('body-parser');
const express = require('express');
const {validate, isJsonSchemaValidationError} = require('ejvm');
const validationSchemas = require('../schemas');

const app = express();

app.use(bodyBarser.json());

app.use('/', express.static('vue-components/dist'));

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

const port = 8080;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
