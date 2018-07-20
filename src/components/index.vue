<template>
  <div class="home">
    <div class="header">
      <a href="javascript:;" id="AppScan" class="iconfont scan" v-show="aa" style="visibility: hidden;">&#xe69a;</a>
      <router-link :to="{name:'search'}" class="search">儿童安全座椅</router-link>
      <a href="javascript:;" class="iconfont message">&#xe67a;</a>
    </div>
    <v-swiper :swiperdata="FirstBanner"></v-swiper>
    <!-- 四个icon -->
    <fouricon :MenuList="MenuList"></fouricon>
    <!-- 广告位banner -->
    <adbanner :MiddleActivity="MiddleActivity"></adbanner>
    <!-- 座椅推荐 -->
    <zytj :FreeSeat="FreeSeat"></zytj>
    <!-- 热门活动 -->
    <hotact :FlashSaleLeft="FlashSaleLeft" :FlashSaleRight="FlashSaleRight"></hotact>
    <!-- 优选推荐 -->
    <yxtj :OptimizationList="OptimizationList"></yxtj>
    <!-- 活动列表 -->
    <activitylist :ActivityList="ActivityList"></activitylist>
    <!-- 猜你喜欢 -->
    <love :ProductList="ProductList"></love>
    <div class="dropload-down" v-if="ProductList">
        <div class="dropload-noData">已经到底了</div>
    </div>
    <v-footer :urlRouter="$route.path" />
    <go-top></go-top>
  </div>
</template>

<script>
import qs from 'qs'
import adbanner from './home/index/adbanner'
import swiper from './common/swiper'
import fouricon from './home/index/fouricon'
import zytj from './home/index/zytj'
import yxtj from './home/index/yxtj'
import hotact from './home/index/hotact'
import activitylist from './home/index/activitylist'
import love from './home/index/love'
import footer from './common/footer'
import goTop from '@/components/common/scrolltop'
import apiport from '../util/api'

export default {
  name: 'Index',
  data () {
    return {
      aa: 1,
      FirstBanner: [],
      MenuList: [],
      MiddleActivity: [],
      FreeSeat: [],
      ActivityList: [],
      FlashSaleLeft: [],
      FlashSaleRight: [],
      OptimizationList: [],
      ProductList: [],
      homedata: {}
    }
  },
  components: {
    'v-footer': footer,
    'v-swiper': swiper,
    love,
    activitylist,
    yxtj,
    hotact,
    zytj,
    fouricon,
    adbanner,
    goTop
  },
  computed: {
  },
  mounted: function () {
    // 首页数据请求
    let model1 = {
      TopN: 20,
      PreferredBaseId: '51',
      SeatTopNum: 14
    }
    this.$http({
      url: apiport.Home_GetHomeList,
      method: 'post',
      // header:{
      //   "Content-Type":'application/x-www-form-urlencoded;charset=UTF-8'
      // },
      data: qs.stringify({ reqJson: JSON.stringify(model1) })
    }).then((res) => {
      console.log(1)
      console.log(res)
      this.homedata = res.data
      this.FirstBanner = res.data.FirstBanner
      this.MenuList = res.data.MenuList
      this.MiddleActivity = res.data.MiddleActivity.slice(0, 1)
      this.FreeSeat = res.data.FreeSeat.slice(0, 3)
      this.FlashSaleLeft = res.data.FlashSaleLeft
      this.FlashSaleRight = res.data.FlashSaleRight.slice(0, 2)
      this.ActivityList = res.data.ActivityList
      this.OptimizationList = res.data.OptimizationList
      this.ActivityList = res.data.ActivityList
      this.ProductList = res.data.ProductList
    }).catch((error) => {
      console.log(2)
      console.log(error)
    })
  },
  beforeRouteEnter (to, from, next) {
    console.log(123123)
    next()
  },
  beforeRouteLeave (to, from, next) {
    console.log(32123123)
    next()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../assets/less/variable';
.header{
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 640px;
  z-index: 22;
  background: @base-ycolor;
  display: flex;
  .scan,.message{
    display: block;
    width:1rem;
    height:1rem;
    line-height: 1rem;
    text-align: center;
    font-size: 18px;
  }
  .search{
    display: block;
    margin: .2rem auto;
    height: .6rem;
    line-height: .6rem;
    font-size: 14px;
    color: #b5b5b6;
    text-indent: 10px;
    background-color: rgba(255,255,255,.8);
    border-radius: .3rem;
    box-sizing: border-box;
    -webkit-flex:1;
    flex: 1;
    &::before{
      content: "\e608";
      font-family: "iconfont" !important;
      margin-right: 5px;
      font-size: @base-ftsize4;
    }
  }
}
.swiper{
  margin-top: 1rem;
}
.dropload-down{
  position: relative;
  padding-bottom:50px;
  height:50px;
  line-height: 50px;
  text-align:center;
  color:@base-color2;
  .dropload-noData{
    &:before{
      content: "";
      position: absolute;
      top: .26rem;
      left: 36%;
      width: 13px;
      height: 18px;
      background: url(https://cdn.sys.img.95laibei.com/Content/Images/daishu.png) no-repeat center;
      background-size: contain;
    }
  }
}
</style>
