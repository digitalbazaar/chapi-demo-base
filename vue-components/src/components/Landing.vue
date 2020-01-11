<template>
  <div>
    <div v-if="success">
      <h1>credential stored successfully</h1>
      <h4 style="width: 450px; margin: 0 auto;">
        The credential has been stored in your digital wallet.
      </h4>
    </div>
    <div v-else>
      <div v-if="presentationForStorage">
        <h1>store the digital credential</h1>
        <h4 style="width: 450px; margin: 0 auto;">
          Please click the store credential button below.
        </h4>
        <q-btn
          outline
          color="white"
          text-color="006699"
          label="Store Credential"
          class="q-mt-lg rounded-borders text-weight-medium g-width-100"
          @click="store()" />
      </div>
      <div
        v-else
        class="g-width-100">
        <h1>secure a digital credential</h1>
        <h4 style="width: 450px; margin: 0 auto;">
          Please click the authenticate button below to begin the process of
          securing your digital credential.
        </h4>
        <q-btn
          outline
          color="white"
          text-color="006699"
          label="Authenticate"
          class="q-mt-lg rounded-borders text-weight-medium g-width-100"
          @click="request()" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
h1 {
  font-size: 25px;
  text-transform: uppercase;
  color: #006699;
  letter-spacing: 3px;
  font-weight: normal;
  margin: 20px;
  text-align: center;
}
h4 {
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 500;
  line-height: 1.1;
  color: #333333;
}
</style>

<script>
'use strict';

import {requestDidAuth} from './mockUtils.js';
import {submitDidPresentation} from './HttpApi.js';

export default {
  name: 'Landing',
  data: function() {
    return {
      presentationForStorage: false,
      success: false,
    };
  },
  methods: {
    async request() {
      const response = await requestDidAuth(/*this.recipe.id*/);
      if(!response) {
        return;
      }
      const {presentation} = response;
      if(!presentation) {
        return;
      }

      // TODO: make more robust
      this.presentation = presentation;
      this.holder = presentation.holder;

      // verify the presentation via HTTP API
      console.log('Sending presentation for verification and issuance...');

      const presentationToStore = await submitDidPresentation({presentation});
      console.log('Issuance result: ',
        JSON.stringify(presentationToStore, null, 2));

      this.presentationForStorage = presentationToStore;
    },
    async store() {
      // create WebCredential wrapper around the presentation to be stored
      const wrappedPresentation = new WebCredential(
        'VerifiablePresentation', this.presentationForStorage);

      const result = await navigator.credentials.store(wrappedPresentation);
      console.log('Storage result', result);

      // user closed or cancelled CHAPI, stay on the same screen
      if(result === null) {
        return;
      }

      this.success = true;
    }
  }
};
</script>
