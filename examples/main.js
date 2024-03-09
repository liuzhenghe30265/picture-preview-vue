import Vue from 'vue'
import App from './App.vue'

import PicturePreviewVue from '../packages/index'
Vue.prototype.$PicturePreviewVue = PicturePreviewVue

Vue.config.productionTip = false

new Vue({
  // router,
  // store,
  render: h => h(App)
}).$mount('#app')
