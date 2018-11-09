
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/scss/pages/index.scss';


import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'


import App from './IndexApp.vue'
import router from './IndexRouter'


console.log('===== process.env : ', process.env);


Vue.use(BootstrapVue);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
