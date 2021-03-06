/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import uuid from 'uuid-random';

// import axios from 'axios';

export async function requestDidAuth() {
  console.log('request DID auth...');
  const query = {
    type: 'DIDAuth',
    challenge: uuid()
  };

  try {
    const webCredential = await navigator.credentials.get({
      web: {
        VerifiablePresentation: {
          query
        }
      }
    });
    if(!webCredential) {
      // no response from user
      console.log('credential request canceled/denied');
      return null;
    }

    // destructure to get presentation
    const {data: presentation} = webCredential;

    console.log('presentation', presentation);
    return {presentation};
  } catch(e) {
    console.error(e);
  }
}

export async function requestCredentialIssuanceCapabilities(
  {invoker, recipient}) {
  console.log('request credential issuance capabilities...');
  try {
    // TODO: import bedrock-vc-* with QueryByExample builder that
    // could shorten what is below
    const webCredential = await navigator.credentials.get({
      web: {
        VerifiablePresentation: {
          query: [{
            type: 'QueryByExample',
            credentialQuery: {
              example: {
                '@context': [
                  'https://w3id.org/credentials/v1',
                  'urn:poc:schema:1234'
                ],
                type: 'OrganizationCredential',
                credentialSubject: {
                  id: ''
                }
              }
            }
          }, {
            type: 'OcapLdQuery',
            capabilityQuery: [{
              referenceId: 'configuration',
              allowedAction: ['read', 'write'],
              invoker,
              invocationTarget: {
                type: 'urn:edv:document',
                // TODO: perhaps disallow this and instead only get
                // keyAgreementKey from controller of `invoker`
                recipient
              }
            }, {
              referenceId: 'assertionMethod',
              // string should match KMS ops
              allowedAction: 'sign',
              invoker,
              invocationTarget: {
                type: 'Ed25519VerificationKey2018',
                proofPurpose: 'assertionMethod'
              }
            }]
          }]
        }
      }
    });
    if(!webCredential) {
      // no response from user
      console.log('credential request canceled/denied');
      return null;
    }

    // destructure to get presentation
    const {data: presentation} = webCredential;

    console.log('presentation', presentation);
    return presentation;
  } catch(e) {
    console.error(e);
  }
}

// export async function getRecipes() {
//   const response = await axios.get('/mock/flows');
//   return response.data;
// }
