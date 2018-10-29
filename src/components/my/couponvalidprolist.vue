<template>
  <div>
    <v-header :headinfo='headinfo' @rightbtn1click="skipchat"></v-header>
    <div style="height: 1px;"></div>
    <div v-infinite-scroll="infinite" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="couponactive">
      <div class="coupon-desc">
        <p class="title">以下商品<span class="mj">满{{couponinfo.OrderMoney}}减{{couponinfo.DeductMoney}}</span></p>
      </div>
      <ul class="clearfix">
        <goods v-for="(list,index) in goodslist" :key="index" :goods="list" class="item"></goods>
      </ul>
    </div>
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
import goods from '@/components/common/goods'
Vue.use(infiniteScroll)

export default {
  name: 'CouponValidProList',
  components: {
    vHeader: head,
    goTop: goTop,
    goods
  },
  data () {
    return {
      headinfo: {title: '优惠活动', rightbtntext1: '&#xe67a;'},
      currentPageIndex: 0,
      pageSize: 20,
      busy: false,
      showLoading: true,
      tips: '正在加载',
      couponinfo: {},
      goodslist: []
    }
  },
  methods: {
    infinite () {
      this.currentPageIndex += 1
      this.busy = true
      let model = {
        CuponId: this.$route.params.id,
        pageIndex: this.currentPageIndex,
        pageSize: this.pageSize
      }
      this.$http({
        url: apiport.Account_GetCouponProductList,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('优惠活动', res.data.ProductList.Data)
          if (res.data.ProductList.Data.length > 0) {
            this.couponinfo = res.data
            this.goodslist = this.goodslist.concat(res.data.ProductList.Data)
            this.busy = false
          } else {
            this.tips = '已经到底了...'
            this.busy = true
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    skipchat () {
      this.$router.push({path: '/wechat/im'})
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.couponactive{
  margin-top: 1rem;
  .coupon-desc{
    background-color: #fff;
    padding: .3rem;
    text-align: center;
    span{
      color: #ff9c00;
    }
  }
  .item{
    float: left;
    width: 50%;
    margin-top: .1rem;
    box-sizing: border-box;
    &:nth-child(2n) {
      padding-left: .1rem;
    }
  }
}
.tips{
  text-align:center;
  line-height:50px;
  margin-bottom:50px;
}
</style>
