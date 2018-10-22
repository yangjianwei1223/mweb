<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <swiper :options="swiperOption" ref="mySwiper" class="express-swiper">
      <swiper-slide v-for="(item, index) in goodsinfo" :key="index" :class="{active:index === whichgoods}">
          <a href="javascript:;">
            <img :src='item.GoodsImgPath+"@!standard_square_s"' @click="exslideTo(index)">
          </a>
      </swiper-slide>
    </swiper>
    <section class="expressname">
      <div>{{expressdata[whichgoods].ShipperName}}</div>
      <div class="thirdtext">运单号：<span>{{expressdata[whichgoods].LogisticCode}}</span></div>
    </section>
    <section class="expresslist">
      <ul>
        <li v-for="(item, index) in expressdata[whichgoods].Traces" :key="index+'_ex'">
          <span class="dot"></span>
          <div class="event">{{item.AcceptStation}}</div>
          <div class="time thirdtext">{{item.AcceptTime}}</div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
import {swiper, swiperSlide} from 'vue-awesome-swiper'
export default {
  name: 'express',
  components: {
    vHeader: head,
    swiper,
    swiperSlide
  },
  data () {
    return {
      headinfo: {title: '物流信息'},
      // 轮播config
      swiperOption: {
      // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
        debugger: true,
        slidesPerView: '3.5', // 设置slider容器能够同时显示的slides数量(carousel模式)。可以设置为数字（可为小数，小数不可loop），或者 'auto'则自动根据slides的宽度来设定数量。loop模式下如果设置为'auto'还需要设置另外一个参数loopedSlides
        autoplay: false
      },
      goodsinfo: [],
      expressdata: [{ShipperName: ''}],
      whichgoods: 0
    }
  },
  mounted () {
    // 获取商品信息
    let model = {
      OrderBaseId: this.$route.params.id,
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Order_GetBaseDetailByID,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('商品信息', res.data)
        if (res.data.ResultNo === '00000000') {
          this.goodsinfo = res.data.OrderGoodsList
          this.getExpressData()
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    getExpressData () {
      let model = {
        OrderBaseId: this.$route.params.id,
        Token: this.$store.state.UserToken
      }
      this.$http({
        url: apiport.Common_GetExpressByOrderId,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('物流信息', res.data)
          if (res.data.ResultNo === '00000000') {
            this.expressdata = res.data.ExpressList
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    exslideTo (index) {
      console.log(index)
      this.swiper().slideTo(index, 1000, false)
      this.whichgoods = index
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
@import '../../../static/css/swiper.min.css';
.express-swiper{
  padding-top: 1rem;
  background-color: #b5b5b6;
  /deep/ .swiper-wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: -webkit-box;
    display: flex;
    transition-property: transform;
    box-sizing: content-box;
    padding: 20px 0;
    box-sizing: border-box;
    img{
      width: 1.8rem;
      max-width: 100%;
      margin-left: 10px;
      border-radius: 6px;
    }
  }
  .active{
    transform: scale(1.1);
    opacity: 1;
    &::after{
      content: "";
      display: block;
      position: absolute;
      width: 0;
      height: 0;
      bottom: -20px;
      left: 10px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 14px solid #fff;
    }
  }
}
.expressname {
  background-color: #fff;
  padding: .2rem;
  line-height: .6rem;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  .thirdtext {
    color: #9fa0a0;
  }
}
.expresslist {
  position: relative;
  background-color: #fff;
  margin: .2rem 0;
  line-height: .6rem;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  &::before{
    content: "";
    position: absolute;
    top: .4rem;
    bottom: 0;
    width: 2px;
    left: 25px;
    background-color: #9fa0a0;
  }
  li {
    position: relative;
    padding-top: .15rem;
    margin-left: 50px;
    border-bottom: 1px solid #ededed;
    .dot {
      position: absolute;
      top: .4rem;
      left: -30px;
      margin-left: 2px;
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background-color: #9fa0a0;
    }
    &:first-child .dot{
      margin-left: 0;
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background-color: #F1BC19;
    }
    &:first-child .event {
      color: #F1BC19;
    }
    .time{
      font-size: 14px;
      color: @base-ycolor4;
    }
  }
}
</style>
