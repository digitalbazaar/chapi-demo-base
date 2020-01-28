/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

// NOTE: THIS FILE SIMULATES WHAT AN ISSUER DOES.
// This does generate a real proof for each
// credential.
const vc = require('vc-js');
const jsigs = require('jsonld-signatures');
const schemaContext = require('schema.org/context');
const {Ed25519KeyPair} = require('crypto-ld');

const {Ed25519Signature2018} = jsigs.suites;
const {defaultDocumentLoader} = vc;

// This is a hack for the moment.
// vc-js does not allow you to load or dereference
// contexts from the internet as a security precaution.
// to get around this have the url for your context
// load your context locally from here.
const documentLoader = async url => {
  if(url === 'https://schema.org/') {
    return {
      contextUrl: null,
      documentUrl: url,
      document: schemaContext
    };
  }
  return defaultDocumentLoader(url);
};

// on the actual issuer I believe this would be an ed25519
// key pair that a wallet has authorized the issuer to use.
/* eslint-disable max-len */
const issuerKeyPair = {
  id: 'did:ex:123#z6MkozhfgjL2wM4hq6DFQjh6sj1PNULSN4u3A1LkoKY2vSgT',
  type: 'Ed25519VerificationKey2018',
  publicKeyBase58: 'AYSd6V5bboaEibNYjAjG2dTPYu4axBegTzRpy3a21Du5',
  privateKeyBase58: '4J6MWwNjSw5DRZYsPN35kTSk9tMZM1bBv6YKZzveXqE4vaUXsEjhweo2wVfjVn7ZNWuuSK9BpJ5HCzsFnX1A7VYw'
};
/* eslint-enable */

module.exports.signCredential = async ({credential, holder}) => {
  const key = await Ed25519KeyPair.from(issuerKeyPair);
  const suite = new Ed25519Signature2018({
    verificationMethod: issuerKeyPair.id,
    key
  });
  const issued = await vc.issue({credential, suite, documentLoader});
  const type = ['VerifiablePresentation', 'DemoCredential'];

  /* eslint-disable quotes, quote-props, max-len */
  const presentation = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],
    type,
    verifiableCredential: [issued],
    holder,
  };
  /* eslint-enable */
  const vp = await vc.createPresentation({
    presentation,
    suite,
    type,
    documentLoader
  });
  /**
  const verified = await vc.verify({presentation: vp, suite, documentLoader});
  console.log('PRESENTATION VERIFIED', verified);
  const credVerified = await vc.verify(
    {credential: issued, suite, documentLoader});
  console.log('CREDENTIAL VERIFIED', credVerified);
  */
  return vp;
};
