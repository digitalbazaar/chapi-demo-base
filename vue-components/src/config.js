'use strict';

import manifest from './manifest.json';

const config = {
  // MEDIATOR_ORIGIN: 'https://authorization.localhost:33443',
  MEDIATOR_ORIGIN: 'https://beta.authn.io',
  appNamespace: 'demo-issuer',
  manifest,
  Quasar: {
    brand: {
      primary: '#29A19C'
    }
  }
};

export default config;
