import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/pages/index.scss'


import Vue from 'vue'
import ElementUI from 'element-ui'
import GlobalPlugin from './components/mixins/index'


import App from './IndexApp.vue'
import router from './indexRouter'


console.log('===== process.env : ', process.env)


Vue.use(ElementUI)
Vue.use(GlobalPlugin)

Vue.config.productionTip = false

new Vue({
    router,
    mounted () {
        // Prevent blank screen in Electron builds
        this.$router.push('/')
    },
    render: h => h(App),
}).$mount('#app')
