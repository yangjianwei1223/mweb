import Vue from 'vue'
import Router from 'vue-router'

// import Index from '@/components/index'
// import Beiquan from '@/components/beiquan/list'
// import BeiquanDetail from '@/components/beiquan/detail'
// import Login from '@/components/account/login'
const Index = resolve => require(['@/components/index'], resolve)
const Beiquan = resolve => require(['@/components/beiquan/list'], resolve)
const BeiquanDetail = resolve => require(['@/components/beiquan/detail'], resolve)
const LoginIndex = resolve => require(['@/components/account/index'], resolve)
const Login = resolve => require(['@/components/account/login'], resolve)
const Cart = resolve => require(['@/components/cart'], resolve)
const About = resolve => require(['@/components/my/about'], resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: {
        index: 0
      }
    }, {
      path: '/Beiquan/List',
      name: 'beiquan',
      component: Beiquan,
      meta: {
        index: 1
      }
    }, {
      path: '/Beiquan/Detail/:id',
      component: BeiquanDetail,
      meta: {
        index: 2
      }
    }, {
      path: '/Account/Index',
      name: 'loginindex',
      component: LoginIndex,
      meta: {
        index: 1
      }
    }, {
      path: '/Account/Login',
      name: 'login',
      component: Login,
      meta: {
        index: 1
      }
    }, {
      path: '/Home/Cart',
      name: 'cart',
      component: Cart,
      meta: {
        requireAuth: true,
        index: 1
      }
    }, {
      path: '/My/About',
      name: 'about',
      component: About,
      meta: {
        index: 2
      }
    }
  ]
})
