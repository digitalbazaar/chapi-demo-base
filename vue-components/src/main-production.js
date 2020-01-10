import Vue from 'vue';
import App from './App.vue';
import './quasar';
import router from './router';

// load the credential handler
import * as polyfill from 'credential-handler-polyfill';

// this is the mediator site to use for production systems
const MEDIATOR_ORIGIN = 'https://authn.io';

Vue.config.productionTip = false;

new Vue({
  router,
  created: async function() {
    await polyfill.loadOnce(
      MEDIATOR_ORIGIN + '/mediator?origin=' +
      encodeURIComponent(window.location.origin));
  },
  render: h => h(App)
}).$mount('#app');
