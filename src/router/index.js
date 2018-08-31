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
const AboutUs = resolve => require(['@/components/home/about'], resolve)
const About = resolve => require(['@/components/my/about'], resolve)
const My = resolve => require(['@/components/my/index'], resolve)
const Seat = resolve => require(['@/components/seat/index'], resolve)
const SeatDetail = resolve => require(['@/components/seat/detail'], resolve)
const RentKnowledge = resolve => require(['@/components/seat/rentknowledge'], resolve)
const ServiceAssurance = resolve => require(['@/components/seat/serviceassurance'], resolve)
const ZulinConfirm = resolve => require(['@/components/order/zulinconfirm'], resolve)
const CommentList = resolve => require(['@/components/optimization/commentlist'], resolve)
const GoodsPay = resolve => require(['@/components/pay/goodspay'], resolve)
const Wxcode = resolve => require(['@/components/pay/wxcode'], resolve)
const AddressManage = resolve => require(['@/components/my/addressmanage'], resolve)
const AddAddress = resolve => require(['@/components/my/addaddress'], resolve)
const Setting = resolve => require(['@/components/my/setting'], resolve)
const Bindset = resolve => require(['@/components/my/bindset'], resolve)
const Dataset = resolve => require(['@/components/my/dataset'], resolve)
const SetPassword = resolve => require(['@/components/my/setpassword'], resolve)
const ZulinBuyIn = resolve => require(['@/components/my/zulinbuyin'], resolve)
const BuyIn = resolve => require(['@/components/my/buyin'], resolve)
const Deposit = resolve => require(['@/components/my/deposit'], resolve)
const Coupon = resolve => require(['@/components/my/coupon'], resolve)
const Praise = resolve => require(['@/components/my/praise'], resolve)
const Share = resolve => require(['@/components/my/share'], resolve)
const ShareQRCode = resolve => require(['@/components/my/shareqrcode'], resolve)
const LoginCenter = resolve => require(['@/components/wechat/logincenter'], resolve)
const SeatInstallVideo = resolve => require(['@/components/activitys/seatinstallvideo'], resolve)
const FreeInstall = resolve => require(['@/components/zulin/freeinstall'], resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
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
    path: '/Home/About',
    name: 'aboutus',
    component: AboutUs,
    meta: {
      index: 2
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
    path: '/My/Setting',
    name: 'setting',
    component: Setting,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/My/Bindset',
    name: 'bindset',
    component: Bindset,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/My/SetPassword',
    name: 'setpassword',
    component: SetPassword,
    meta: {
      requireAuth: true,
      index: 2
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
    name: 'seatdetail',
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
  }, {
    path: '/Order/ZulinConfirm/:id',
    name: 'zulinconfirm',
    component: ZulinConfirm,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/Pay/GoodsPay',
    name: 'goodspay',
    component: GoodsPay,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/My/AddressManage',
    name: 'adresslist',
    component: AddressManage,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/My/AddAddress',
    name: 'addaddress',
    component: AddAddress,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/My/AddAddress/:id',
    name: 'editaddress',
    component: AddAddress,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/My/Dataset',
    name: 'dataset',
    component: Dataset,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/My/ZulinBuyIn',
    name: 'zulinbuyIn',
    component: ZulinBuyIn,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/My/BuyIn',
    name: 'buyin',
    component: BuyIn,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/My/Deposit',
    name: 'deposit',
    component: Deposit,
    meta: {
      requireAuth: true,
      index: 1
    }
  }, {
    path: '/My/Coupon',
    name: 'coupon',
    component: Coupon,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/My/Praise',
    name: 'praise',
    component: Praise,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/My/Share',
    name: 'share',
    component: Share,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/My/ShareQRCode',
    name: 'ShareQRCode',
    component: ShareQRCode,
    meta: {
      requireAuth: true,
      index: 2
    }
  }, {
    path: '/Pay/WxCode',
    name: 'wxcode',
    component: Wxcode,
    meta: {
      index: 2
    }
  }, {
    path: '/Wechat/LoginCenter',
    name: 'logincenter',
    component: LoginCenter,
    meta: {
      index: 2
    }
  }, {
    path: '/Activitys/SeatInstallVideo',
    name: 'seatinstallvideo',
    component: SeatInstallVideo,
    meta: {
      index: 2
    }
  }, {
    path: '/Zulin/FreeInstall',
    name: 'FreeInstall',
    component: FreeInstall,
    meta: {
      index: 2
    }
  }
  ]
})
