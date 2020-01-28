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
const {keyToDidDoc} = require('did-method-key').driver();
const {Ed25519KeyPair} = require('crypto-ld');
const didKeyContext = require('./did-v0.11');

const {Ed25519Signature2018} = jsigs.suites;
const {defaultDocumentLoader} = vc;

// on the actual issuer I believe this would be an ed25519
// key pair that a wallet has authorized the issuer to use.

let issuerKeyPair, issuerKeyDid = null;

// just gets the assertion method from the did key.
const getAssertionMethod = didKey => {
  return didKey.assertionMethod[0];
};

async function setupKeyPair() {
  // this produces a keypair with private key material
  // used for signing credentials / presentations
  issuerKeyPair = await Ed25519KeyPair.generate();
  // this is a did key document which only contains
  // the public key material used to verify a credential
  issuerKeyDid = keyToDidDoc(issuerKeyPair);
  issuerKeyPair.id = getAssertionMethod(issuerKeyDid);
  console.log('assertion method', getAssertionMethod(issuerKeyDid), '\n');
  console.log('issuerKeyDid', issuerKeyDid, '\n');
  console.log('issuerKeyPair', issuerKeyPair, '\n');
  console.log('PUBLIC NODE', issuerKeyPair.publicNode(), '\n');
  // this is just for testing purposes
  const suite = new Ed25519Signature2018({
    verificationMethod: getAssertionMethod(issuerKeyDid),
    key: issuerKeyPair
  });
  console.log('SUITE', suite, '\n');
}

setupKeyPair();

// this is used to load custom @context documents.
const documentLoader = async url => {
  // this is hack the latest context for did keys is not
  // in the vc-js approved contexts.
  if(issuerKeyDid['@context'] === url) {
    return {
      contextUrl: null,
      documentUrl: url,
      document: didKeyContext
    };
  }
  // this is returned when the assertionMethod
  // asks for the controller.
  if(issuerKeyDid.id === url) {
    console.log('returning issuerKeyDid for', url);
    return {
      contextUrl: null,
      documentUrl: url,
      document: issuerKeyDid
    };
  }
  // this is a hack and returns the public key material
  // for the assertion method with a security context
  // attached.
  if(url.startsWith('did:key:') && url.includes('#')) {
    console.log('RETURNING PUBLIC NODE FOR ', url);
    const doc = issuerKeyPair.publicNode();
    doc['@context'] = 'https://w3id.org/security/v2';
    return {
      contextUrl: null,
      documentUrl: url,
      document: doc
    };
  }
  // this is where the type Person's context
  // will be resolved.
  if(url === 'https://schema.org/') {
    return {
      contextUrl: null,
      documentUrl: url,
      document: schemaContext
    };
  }
  return defaultDocumentLoader(url);
};

/* eslint-enable */

module.exports.signCredential = async ({credential, holder}) => {
  const suite = new Ed25519Signature2018({
    verificationMethod: getAssertionMethod(issuerKeyDid),
    key: issuerKeyPair
  });
  // FIXME the issuer id should be set elsewhere
  // the issuer id and controller id have to be the same.
  credential.issuer.id = issuerKeyDid.id;
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
  */
  // verification should not need the private key material
  // used by sign and should get the verificationMethod from the proof
  const verifySuite = new Ed25519Signature2018();
  const credVerified = await vc.verify(
    {credential: issued, suite: verifySuite, documentLoader});
  console.log('CREDENTIAL VERIFIED', credVerified);
  return vp;
};
