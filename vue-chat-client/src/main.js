// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import _ from 'lodash'
import './events'

import './assets/styles/css_initialize.css'
import 'element-ui/lib/theme-default/index.css'
import './assets/font-icon/iconfont.css'

// lodash
window._ = _ 

import store from './store'
import App from './App'

Vue.use(ElementUI)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
