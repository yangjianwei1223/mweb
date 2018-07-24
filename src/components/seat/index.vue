<template>
  <div class="seat">
    <header class="header">
      <div><a class="iconfont back" @click="back">&#xe651;</a></div>
      <div class="tabs">
        <a href="javascript:;" :class="{active:tab==0}" @click="tabfun(0)">座椅租赁</a><a href="javascript:;" :class="{active:tab==1}" @click="tabfun(1)">座椅商城</a>
      </div>
      <div>
      </div>
    </header>
    <div class="container">
      <div class="zulin" v-show="tab==0">
        <div class="seat-sum">
          <a href="/Zulin/RentKnowledge" class="piclink">
            <img src="https://cdn.sys.img.95laibei.com/Content/Images/zuindex-101.png" class="pic" alt="租赁须知">
          </a>
          <a href="/Zulin/ServiceAssurance" class="piclink">
            <img src="https://cdn.sys.img.95laibei.com/Content/Images/zuindex-102.png" class="pic" alt="服务保障">
          </a>
          <a href="/Activitys/SeatInstallVideo" class="piclink">
            <img src="https://cdn.sys.img.95laibei.com/Content/Images/zuindex-103.png" class="pic" alt="安装视频">
          </a>
          <a href="/Zulin/FreeInstall" class="piclink">
            <img src="https://cdn.sys.img.95laibei.com/Content/Images/zuindex-104.png" class="pic" alt="全国门店">
          </a>
        </div>
        <div v-infinite-scroll="infinite" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="_v-container">
          <ul>
            <li>
              <a data-action-url="http://mweb.95laibei.com/Seat/Detail/11699" class="whiteBack clearfix ui-link">
                <img class="lazyDetail" src="https://cdn.product.img.95laibei.com/180622114035070980.jpg@!standard_square_m">
                <p class="ptitle onelinetext">惠尔顿 9个月-12岁 全能宝3 儿童安全座椅</p>
                <p class="rent">押金  <span>¥1398</span></p><p class="sum">已领用<span>1498</span>台</p>
              </a>
            </li>
          </ul>
          <div tip="正在加载" v-if="showLoading" class="tips">{{tips}}</div>
        </div>
      </div>
      <div class="mall" v-show="tab==1">
        座椅商城
      </div>
    </div>
    <go-top></go-top>
  </div>
</template>

<script>
import Vue from 'vue'
import qs from 'qs'
import infiniteScroll from 'vue-infinite-scroll'

import apiport from '../../util/api'
import goTop from '@/components/common/scrolltop'

Vue.use(infiniteScroll)

export default {
  name: 'seat',
  data () {
    return {
      tab: 0,
      page: 0,
      busy: false,
      showLoading: true,
      tips: '正在加载',
      zulilist: []
    }
  },
  components: {
    goTop
  },
  methods: {
    back: function () {
      this.$router.back()
    },
    tabfun: function (index) {
      this.tab = index
    },
    infinite () {
      this.page += 1
      this.busy = true
      let model = {
        Token: '5061b637-a63e-4665-b448-b1b5bfeb4447',
        pageIndex: this.page,
        pageSize: 20
      }
      this.$http({
        url: apiport.BeiQuan_GetNewsList,
        method: 'post',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          if (res.data.Data.length > 0) {
            this.zulilist = this.zulilist.concat(res.data.Data)
            this.busy = false
          } else {
            this.tips = '已经到底了...'
            this.busy = true
          }
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 22;
  background: @base-ycolor;
  display: -webkit-box;
  height: 1rem;
  line-height: 0.8rem;
  text-align: center;
  & > div {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    display: -webkit-box;
    display: -moz-box;
    font-size: 18px;
    color: #000;
  }
  & > div:first-child {
    text-align: left;
    margin-left: 0.2rem;
    -moz-box-pack: start;
    -webkit-box-pack: start;
    min-width: 20%;
  }
  & > div:last-child {
    text-align: right;
    margin-right: 0.2rem;
    -webkit-box-pack: end;
    min-width: 20%;
    font-size: 16px;
  }
  .back{
    font-size: 22px;
  }
  .tabs{
    font-size: 12px;
    a{
      display:inline-block;
      line-height: .6rem;
      padding:0 .2rem;
      border:1px solid #333;
      &.active{
        background-color: #000;
        color:#fff;
      }
      &:first-child{
        border-radius: 4px 0 0 4px;
      }
      &:last-child{
        border-radius:0 4px 4px 0;
      }
    }
  }
}
.seat-sum{
    display:-webkit-flex;
    display:flex;
    overflow:hidden;
    border-left: 1px solid #fff;
    border-right: 1px solid #fff;
    margin-top: 1rem;
    .piclink{
      flex:1;
      font-size: 0;
    }
}
</style>
