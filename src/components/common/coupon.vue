<template>
  <li :class="{used:couponinfo.status===2,overdue:couponinfo.status===3}" @click="checkcoupon()">
    <div class="fline" v-if="couponinfo.Type === 1">
      <div class="loan">
        ¥&nbsp;<span>{{couponinfo.DeductMoney}}</span>
        <p>满¥{{couponinfo.OrderMoney}}使用</p>
      </div>
      <div class="copy">
        <p class="title twolinetext">{{couponinfo.Title}}</p>
        <p v-if="couponinfo.IsLimitGoodsUsed || couponinfo.IsLimitCategoryUsed"><i class="iconfont">&#xe60d;</i> 指定商品适用</p>
        <p v-else-if="couponinfo.ZuLinGoodsUsed && !couponinfo.GeneralGoodsUsed"><i class="iconfont">&#xe60d;</i> 租赁商品适用</p>
        <p v-else-if="!couponinfo.ZuLinGoodsUsed && couponinfo.GeneralGoodsUsed"><i class="iconfont">&#xe60d;</i> 普通商品适用</p>
        <p v-else><i class="iconfont">&#xe60d;</i> 全场通用券</p>
        <div v-if="couponinfo.status===2" class=touse></div>
        <div v-else-if="couponinfo.status===3" class="touse"></div>
        <div v-else-if="couponinfo.status===11" class="checkbox iconfont">&#xe605;</div>
        <div v-else-if="couponinfo.status===12"></div>
        <router-link v-else-if="couponinfo.IsLimitGoodsUsed || couponinfo.IsLimitCategoryUsed" class="touse" :to='"/My/CouponValidProList/" + couponinfo.DiscountCouponId'>立即使用</router-link>
        <router-link v-else-if="couponinfo.ZuLinGoodsUsed && !couponinfo.GeneralGoodsUsed" class="touse" to='/Zulin'>立即使用</router-link>
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
        <p v-if="couponinfo.IsLimitGoodsUsed">(部分商品可用)</p>
          <div v-if="couponinfo.status===2" class=touse></div>
        <div v-else-if="couponinfo.status===3" class="touse"></div>
        <div v-else-if="couponinfo.status===11" class="checkbox iconfont">&#xe605;</div>
        <div v-else-if="couponinfo.status===12"></div>
        <router-link v-else-if="couponinfo.IsLimitGoodsUsed || couponinfo.IsLimitCategoryUsed" class="touse" :to='"/My/CouponValidProList/" + couponinfo.DiscountCouponId'>立即使用</router-link>
        <router-link v-else-if="couponinfo.ZuLinGoodsUsed && !couponinfo.GeneralGoodsUsed" class="touse" to='/Zulin'>立即使用</router-link>
        <router-link v-else class="touse" to='/'>立即使用</router-link>
      </div>
    </div>
    <div v-if="couponinfo.status===1 || couponinfo.status===11 || couponinfo.status===12" class="time">{{couponinfo.BeginTime}}至{{couponinfo.EndTime}}</div>
    <div v-else-if="couponinfo.status===2" class="time">{{couponinfo.UsedTime}}已使用</div>
    <div v-else class="time">{{couponinfo.EndTime}}已过期</div>
  </li>
</template>

<script>
export default {
  props: ['couponinfo'],
  methods: {
    checkcoupon () {
      this.$emit('emitcoupon')
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
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
  .fline .copy .checkbox{
    position: absolute;
    top: 25px;
    right: 10px;
    font-size: 30px;
    color: #ccc;
  }
  &.checked .fline .copy .checkbox{
    color: @base-ycolor3;
  }
}
</style>
