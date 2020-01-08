<template>
  <div>
    <div v-if="congratulate">
      <h4>
        Hello {{congratulate}}, you have successfully authenticated.
      </h4>
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

import {requestOrganizationCredentials} from './mockUtils.js';
import {verifyPresentation} from './HttpApi.js';

export default {
  name: 'Landing',
  data: function() {
    return {
      congratulate: false
    };
  },
  methods: {
    async request() {
      const response = await requestOrganizationCredentials(/*this.recipe.id*/);
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
      console.log('Sending presentation to be verified...');
      console.log('TODO: a mock response of `{valid: false}` is expected.');

      const result = await verifyPresentation({presentation});
      console.log('Verification result: ', JSON.stringify(result, null, 2));

      // TODO: inspect the result and act accordingly
      // result = {valid: true/false, error}

      // TODO: prepopulate `flow` with received credentials information

      this.congratulate = presentation.holder;
    },
  }
};
</script>
