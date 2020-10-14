import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'
import axios from 'axios';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost/api/'

new Vue({
  router,
  store,
  vuetify,
  axios,
  render: h => h(App)
}).$mount('#app')
