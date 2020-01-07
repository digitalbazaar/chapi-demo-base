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
      <q-btn
        color="primary"
        label="Authenticate"
        class="q-mt-lg rounded-borders text-weight-medium g-width-100"
        @click="request()" />
    </div>
  </div>
</template>

<style>
</style>

<script>
'use strict';

import {requestOrganizationCredentials} from './mockUtils.js';

export default {
  name: 'HelloWorld',
  data: function() {
    return {
      congratulate: false
    };
  },
  computed: {
    flow() {
      return [{
        form: {
          model: {
            givenName: '',
            familyName: '',
          }
        }
      }];
    },
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
      const {verifiableCredential: credentials} = presentation;
      const [organizationAgent] = credentials.filter(
        ({type}) => type.includes('OrganizationAgentCredential'));
      const [organization] = credentials.filter(
        ({type}) => type.includes('OrganizationCredential'));

      // TODO: prepopulate `flow` with received credentials information
      const expectedFieldPairs = [
        {field: 'entityType', credential: organization},
        {field: 'legalName', credential: organization},
        {field: 'address', credential: organization},
        {field: 'id', credential: organizationAgent},
        {field: 'jobTitle', credential: organizationAgent},
        {field: 'givenName', credential: organizationAgent},
        {field: 'familyName', credential: organizationAgent},
      ];
      for(let step = 0; step < this.flow.length; step++) {
        expectedFieldPairs.forEach(fieldPair => {
          const form = (this.flow[step] || {}).form;
          if(form) {
            if(form.model[fieldPair.field] != null && fieldPair.credential) {
              form.model[fieldPair.field] =
                fieldPair.credential.credentialSubject[fieldPair.field];
            }
          }
        });
      }
      // TODO: make more robust
      if(this.$route.params === 'urn:vc-flow:ge') {
        this.subject = organizationAgent.credentialSubject.id;
      } else {
        this.subject = organization.credentialSubject.id;
      }
      //console.log('subject', this.subject);
      this.receivedCredentials = credentials;

      this.congratulate = this.flow[0].form.model.givenName + ' ' +
        this.flow[0].form.model.familyName;
      console.log('CCCCCCC', this.congratulate);
    },
  }
};
</script>
