/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const asyncHandler = require('async-handler');
const bodyBarser = require('body-parser');
const express = require('express');

const app = express();

app.use(bodyBarser.json());

app.use('/', express.static('vue-components/dist'));

app.post('/verify', asyncHandler(async (req, res) => {
  // TODO: implement issuer API call
  res.json({valid: false});
}));

const port = 8080;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
