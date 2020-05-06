import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'

import axios from 'axios'                   //Mingzoo
import VueAxios from 'vue-axios'            //Mingzoo
import BootstrapVue from 'bootstrap-vue'    //Mingzoo

import flatpickr from 'flatpickr'   //Mingzoo
Vue.use(flatpickr)

Vue.config.performance = true
Vue.use(CoreuiVue)

//Mingzoo
//axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'http://hello-world.amp.iii-ei-stack.com' : ''
//axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : ''
axios.defaults.baseURL = 'http://localhost:3000'
Vue.use(VueAxios, axios)    //Mingzoo
Vue.use(BootstrapVue)

//import VueQrcodeReader from 'vue-qrcode-reader' //Mingzoo, 20200201
//Vue.use(VueQrcodeReader)

import Vuetify from 'vuetify'
import DaySpanVuetify from 'dayspan-vuetify'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'dayspan-vuetify/dist/lib/dayspan-vuetify.min.css'

Vue.use(Vuetify);

Vue.use(DaySpanVuetify, {
  methods: {
    getDefaultEventColor: () => '#1976d2'
  }
});

new Vue({
  el: '#app',
  router,
  icons,
  template: '<App/>',
  components: {
    App
  },
})
