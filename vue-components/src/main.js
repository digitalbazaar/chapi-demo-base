import Vue from 'vue';
import App from './App.vue';
import './quasar';
import router from './router';
import config from './config';

// load the credential handler
import * as polyfill from 'credential-handler-polyfill';

const {MEDIATOR_ORIGIN} = config;

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
