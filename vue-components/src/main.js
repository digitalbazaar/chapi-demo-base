// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import * as polyfill from 'credential-handler-polyfill';
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

const MEDIATOR_ORIGIN = 'https://authorization.localhost:33443';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  created: async function() {
    await polyfill.loadOnce(
      MEDIATOR_ORIGIN + '/mediator?origin=' +
      encodeURIComponent(window.location.origin));
  },
  template: '<App/>',
})
