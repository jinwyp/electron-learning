// import './assets/scss/pages/index.scss'
import './assets/scss/pages/indexAudioConverter.scss'


import Vue from 'vue'
import ElementUI from 'element-ui'
import GlobalPlugin from './components/mixins/index'

import Icon from './components/icons/Icon'

// import App from './IndexApp.vue'
import App2 from './IndexAppAudioConverter.vue'
import router from './indexRouter'


console.log('===== process.env : ', process.env)


Vue.use(ElementUI)
Vue.use(GlobalPlugin)

Vue.component('mo-icon', Icon)

Vue.config.productionTip = false

new Vue({
    router,
    mounted () {
        // Prevent blank screen in Electron builds
        this.$router.push('/')
    },
    render: h => h(App2),
}).$mount('#app')
