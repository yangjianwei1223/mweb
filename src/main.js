// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import App from './App'
import router from './router'
import http from './util/http.js'
import store from './store'
import Global from './util/Global'
import BaseInfoHelper from './util/Global_BaseInfoHelper'

Vue.use(Vuex)
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyLoad, {
  error: 'https://cdn.sys.img.95laibei.com/Content/Images/lazyLoad-placeholder-Half.jpg',
  loading: 'https://cdn.sys.img.95laibei.com/Content/Images/lazyLoad-placeholder-Half.jpg'
})

Vue.prototype.$http = http
Vue.prototype.$Global = Global
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  console.log(to.matched)
<<<<<<< HEAD
  store.state.UserToken = BaseInfoHelper.GetToken()

=======
  let tokenInfo = JSON.parse(localStorage.getItem('UserToken'))
  if (tokenInfo) {
    let currenttime = new Date().getTime()
    let exptime = new Date(tokenInfo.ExpTime).getTime()
    if (currenttime > exptime) {
      localStorage.removeItem('UserToken')
    } else {
      store.state.UserToken = JSON.parse(tokenInfo.ObjectData).Token
    }
  }
>>>>>>> 9ced28722433260d05ae238a29f13617858bfd6c
  if (to.meta.requireAuth) {
    // 判断是否需要登录权限
    if (store.state.UserToken) {
      next()
    } else {
      // 没登录则跳转到登录界面
      next({
        path: '/Account/Login',
        query: {redict: to.fullPath}
      })
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
