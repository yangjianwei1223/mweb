import Vue from 'vue'
import Router from 'vue-router'

// import Index from '@/components/index'
// import Beiquan from '@/components/beiquan/list'
// import BeiquanDetail from '@/components/beiquan/detail'
// import Login from '@/components/account/login'
// import CommentList from '@/components/optimization/commentlist'
const Index = resolve => require(['@/components/index'], resolve)
const Beiquan = resolve => require(['@/components/beiquan/list'], resolve)
const BeiquanDetail = resolve => require(['@/components/beiquan/detail'], resolve)
const LoginIndex = resolve => require(['@/components/account/index'], resolve)
const Login = resolve => require(['@/components/account/login'], resolve)
const Cart = resolve => require(['@/components/cart'], resolve)
const About = resolve => require(['@/components/my/about'], resolve)
const My = resolve => require(['@/components/my/index'], resolve)
const Seat = resolve => require(['@/components/seat/index'], resolve)
const SeatDetail = resolve => require(['@/components/seat/detail'], resolve)
const RentKnowledge = resolve => require(['@/components/seat/rentknowledge'], resolve)
const ServiceAssurance = resolve => require(['@/components/seat/serviceassurance'], resolve)
const CommentList = resolve => require(['@/components/optimization/commentlist'], resolve)

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
    }, {
      path: '/My',
      name: 'my',
      component: My,
      meta: {
        index: 1
      }
    }, {
      path: '/Seat',
      name: 'seat',
      component: Seat,
      meta: {
        index: 1
      }
    }, {
      path: '/Seat/Detail/:id',
      name: 'seat',
      component: SeatDetail,
      meta: {
        index: 2
      }
    }, {
      path: '/Zulin',
      name: 'zulin',
      redirect: '/Seat'
    }, {
      path: '/Zulin/RentKnowledge',
      name: 'rentknowledge',
      component: RentKnowledge,
      meta: {
        index: 2
      }
    }, {
      path: '/Zulin/ServiceAssurance',
      name: 'serviceassurance',
      component: ServiceAssurance,
      meta: {
        index: 2
      }
    }, {
      path: '/Optimization/CommentList/:id',
      name: 'commentlist',
      component: CommentList,
      meta: {
        index: 2
      }
    }
  ]
})
