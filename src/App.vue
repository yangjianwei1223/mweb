<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import '../static/js/rem.js'
import goTop from './components/common/scrolltop'
export default {
  name: 'App',
  data () {
    return {
      transitionName: ''
    }
  },
  components: {
    'scroll-top': goTop
  },
  watch: {
    $route (to, from) {
      if (to.meta.index < from.meta.index) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
    }
  },
  created: function () {
    let tokenInfo = JSON.parse(localStorage.getItem('UserToken'))
    if (tokenInfo) {
      let currenttime = new Date().getTime()
      let exptime = new Date(tokenInfo.ExpTime).getTime()
      if (currenttime > exptime) {
        localStorage.removeItem('UserToken')
      } else {
        this.$store.state.UserToken = tokenInfo.ObjectData.Token
      }
    }
  }
}
</script>

<style lang="less">
    @import './assets/less/common.less';
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
    will-change: transform;
    transition: all .3s;
    position: absolute;
    width:100%;
    left:0;
    height:100%;
}
.slide-right-enter {
    transform: translateX(-100%);
}
.slide-right-leave-active {
    transform: translateX(100%);
}
.slide-left-enter {
    transform: translateX(100%);
}
.slide-left-leave-active {
    transform: translateX(-100%);
}
</style>
