<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view/>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import '../static/js/rem.js'
import goTop from './components/common/scrolltop'
import SiteAccessLogHelper from './util/Global_SiteAccessLogHelper'
import aJpushHelper from './util/Global_AJpushHelper'
import weiXinHelper from './util/Global_WeiXinHelper'

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
      setTimeout(() => {
      // 获取站点访问信息
        SiteAccessLogHelper.GetSiteAccessInfo()
      }, 3000)
      SiteAccessLogHelper.PageVisit()
      SiteAccessLogHelper.SetAppQueryString()
       //Jpush通知回调，初次加载完成
        if (window.JpushData != undefined && window.JpushData != null
               && window.JpushData != '') {
             aJpushHelper.ReceiveCallBack(false, window.JpushData);
       }
    }
  },
  created: function () {
  },
  mounted:function(){
    window.apiready=function(){
      aJpushHelper.Init();
    };
    window.JpushCallBack=function(type,dataStr) {
        window.JpushData = dataStr;
        aJpushHelper.ReceiveCallBack(true, window.JpushData);
     }
     var _that=this;
     setTimeout(function(){
      //小程序初次进入设置参数
       console.log('start')
       console.log(JSON.stringify(_that.$route.query))
       weiXinHelper.SetParameter(_that.$route.query.smallopenid,_that.$route.query.xcxName)
     },100)
  },
  beforeMount: function () {
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
