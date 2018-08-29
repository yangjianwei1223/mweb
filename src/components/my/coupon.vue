<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <div class="header">
      <div :class="{active:status===1}" @click="changestatus(1)">待使用({{UnUsedCount}})</div>
      <div :class="{active:status===2}" @click="changestatus(2)">已使用({{UsedCount}})</div>
      <div :class="{active:status===3}" @click="changestatus(3)">已过期({{OutCount}})</div>
    </div>
    <ul class="couponlist" v-infinite-scroll="getcouponlist" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-listen-for-event="reload">
      <li v-for="(item, index) in couponlist" :key="index" :class="{used:status===2,overdue:status===3}">
        <div class="fline" v-if="item.Type === 1">
          <div class="loan">
            ¥&nbsp;<span>{{item.DeductMoney}}</span>
            <p>满¥{{item.OrderMoney}}使用</p>
          </div>
          <div class="copy">
            <p class="title twolinetext">{{item.Title}}</p>
            <p v-if="item.IsLimitGoodsUsed || item.IsLimitCategoryUsed"><i class="iconfont">&#xe60d;</i> 指定商品适用</p>
            <p v-else-if="item.ZuLinGoodsUsed && !item.GeneralGoodsUsed"><i class="iconfont">&#xe60d;</i> 租赁商品适用</p>
            <p v-else-if="!item.ZuLinGoodsUsed && item.GeneralGoodsUsed"><i class="iconfont">&#xe60d;</i> 普通商品适用</p>
            <p v-else><i class="iconfont">&#xe60d;</i> 全场通用券</p>
            <div v-if="status===2" class=touse></div>
            <div v-else-if="status===3" class="touse"></div>
            <router-link v-else-if="item.IsLimitGoodsUsed || item.IsLimitCategoryUsed" class="touse" :to='"/My/CouponValidProList/" + item.DiscountCouponId'>立即使用</router-link>
            <router-link v-else-if="item.ZuLinGoodsUsed && !item.GeneralGoodsUsed" class="touse" to='/Zulin'>立即使用</router-link>
            <!-- <router-link v-else-if="!item.ZuLinGoodsUsed && item.GeneralGoodsUsed" class="touse" to='/'>立即使用</router-link> -->
            <router-link v-else class="touse" to='/'>立即使用</router-link>
          </div>
        </div>
        <div class="fline" v-else>
          <div class="loan">
            <span>免邮券</span>
          </div>
          <div class="copy">
            <p>限抵用于安全座椅邮费</p>
            <p>全平台可用</p>
            <p v-if="item.IsLimitGoodsUsed">(部分商品可用)</p>
             <div v-if="status===2" class=touse></div>
            <div v-else-if="status===3" class="touse"></div>
            <router-link v-else-if="item.IsLimitGoodsUsed || item.IsLimitCategoryUsed" class="touse" :to='"/My/CouponValidProList/" + item.DiscountCouponId'>立即使用</router-link>
            <router-link v-else-if="item.ZuLinGoodsUsed && !item.GeneralGoodsUsed" class="touse" to='/Zulin'>立即使用</router-link>
            <!-- <router-link v-else-if="!item.ZuLinGoodsUsed && item.GeneralGoodsUsed" class="touse" to='/'>立即使用</router-link> -->
            <router-link v-else class="touse" to='/'>立即使用</router-link>
          </div>
        </div>
        <div v-if="status===1" class="time">{{item.BeginTime}}至{{item.EndTime}}</div>
        <div v-else-if="status===2" class="time">{{item.UsedTime}}已使用</div>
        <div v-else class="time">{{item.EndTime}}已过期</div>
      </li>
    </ul>
    <div tip="正在加载" v-if="showLoading" class="tips">{{tips}}</div>
    <go-top></go-top>
  </div>
</template>

<script>
import Vue from 'vue'
import qs from 'qs'
import apiport from '../../util/api'
import infiniteScroll from 'vue-infinite-scroll'
import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'
Vue.use(infiniteScroll)
export default {
  name: 'coupon',
  components: {
    vHeader: head,
    goTop: goTop
  },
  data () {
    return {
      headinfo: {title: '优惠券'},
      UnUsedCount: 0,
      UsedCount: 0,
      OutCount: 0,
      couponlist: [],
      currentPageIndex: 0,
      status: 1,
      pageSize: 20,
      busy: false,
      showLoading: true,
      tips: '正在加载'
    }
  },
  mounted: function () {
    this.getcouponcount()
  },
  methods: {
    getcouponcount () {
      let model = {
        Token: this.$store.state.UserToken
      }
      this.$http({
        url: apiport.Account_GetCouponCount,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('优惠券数量', res.data)
          this.UnUsedCount = res.data.UnUsedCount
          this.UsedCount = res.data.UsedCount
          this.OutCount = res.data.OutCount
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    getcouponlist () {
      this.currentPageIndex += 1
      this.busy = true
      let model = {
        Token: this.$store.state.UserToken,
        Status: this.status,
        pageIndex: this.currentPageIndex,
        pageSize: this.pageSize
      }
      this.$http({
        url: apiport.Account_GetCouponList,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('优惠券', res.data)
          if (res.data.Data.length > 0) {
            this.couponlist = this.couponlist.concat(res.data.Data)
            this.busy = false
            this.$emit('reload')
          } else {
            this.tips = '已经到底了...'
            this.busy = true
          }
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    changestatus (i) {
      if (this.status === i) {
        return true
      }
      this.couponlist = []
      this.status = i
      this.currentPageIndex = 0
      this.tips = '正在加载'
      this.busy = false
      this.getcouponlist()
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.header{
  position:fixed;
  top:1rem;
  left: 0;
  width:100%;
  display: flex;
  line-height: .8rem;
  background-color: #fff;
  z-index: 222;
  div{
    flex:1;
    text-align: center;
    &.active{
      color:@base-ycolor3;
    }
  }
}
.couponlist{
  padding-top: 1.8rem;
  li{
    width: 6.5rem;
    padding: 0 10px;
    margin: 20px auto;
    position: relative;
    color: #000;
    border: 1px solid #FF9C00;
    border-radius: 6px;
    background-color: #FFEFDC;
    &.used,&.overdue{
      background-color: #E5E5E5;
      border: 1px solid #CCC;
      &::before{
        border-color: #ccc #ccc transparent transparent;
      }
      &::after{
        border-color: transparent transparent #ccc #ccc;
      }
    }
    &::before,&::after{
      content: "";
      display: block;
      width: 10px;
      height: 10px;
      border: 1px solid #FF9C00;
      background-color: #efefef;
      -webkit-transform: rotateZ(45deg);
      -moz-transform: rotateZ(45deg);
      transform: rotateZ(45deg);
      border-color: #ff9c00 #ff9c00 transparent transparent;
      position: absolute;
      bottom: 34px;
    }
    &:before{
      border-color: #ff9c00 #ff9c00 transparent transparent;
      left: -7px;
    }
    &:after{
      border-color: transparent transparent #ff9c00 #ff9c00;
      right: -7px;
    }
    .fline{
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: center;
      .loan{
        width: 100px;
        padding: 30px 0;
        text-align: center;
        border-right: 1px dashed #999;
        span{
          font-size: 30px;
        }
        p{
          font-size: 13px;
          color: #666;
        }
      }
      .copy{
        position: relative;
        font-size: 12px;
        line-height: 24px;
        margin-left: 20px;
        flex: 1;
        .title{
          font-size: 15px;
          color: #000;
          width: 2.5rem;
        }
        .iconfont{
          color: #999;
        }
        .touse{
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 70px;
          line-height: 30px;
          border-radius: 15px;
          text-align: center;
          font-size: 13px;
          background-color: #FF9C00;
          color: #fff;
        }
      }
    }
    &.used .fline .copy .touse{
      width: 60px;
      height: 49px;
      background: url(https://cdn.sys.img.95laibei.com/Content/Images/couponused.png) no-repeat;
      background-size: cover;
    }
    &.overdue .fline .copy .touse{
      width: 60px;
      height: 49px;
      background: url(https://cdn.sys.img.95laibei.com/Content/Images/couponoverdue.png) no-repeat;
      background-size: cover;
    }
    .time{
      font-size: 12px;
      color: #666;
      line-height: 40px;
      border-top: 1px dashed #999;
    }
  }
}
.tips{
  text-align:center;
  line-height:50px;
  margin-bottom:50px;
}
@media screen and (max-width: 330px){
  .couponlist .coupon .loan{
    width: 75px;
  }
}
</style>
