<template>
  <div>
    <v-header :headinfo="headinfo" @hidediv="pagetrigger(1)"></v-header>
    <div v-show="deliverypage === 0">
    <section class="confirmadd" v-show="deliverypage === 0">
      <router-link class="clearfix" :to='{path:"/My/AddressManage",query:{returnUrl:"/Order/ZulinConfirm/" + orderid}}'>
        <div class="iconfont dwlogo">&#xe61a;</div>
        <div class="title">
          <p>{{ContactName}}&nbsp;&nbsp; {{ContactPhone}}</p>
          <p>{{FullAddress}}</p>
        </div>
        <div class="arrow iconfont">&#xe61e;</div>
      </router-link>
    </section>
    <section class="order-cont">
        <div class="item">
          <router-link to="">
            <div class="left">
              <img :src="GoodsImgPath">
            </div>
            <div class="center">
              <p class="title twolinetext">{{GoodsTitle}}</p>
              <p class="style">{{PropertyValue}}</p>
              <p class="style c1" v-if="rentid">租用期限：{{RentName + '-' + RentAmount + '元'}}</p>
            </div>
            <div class="right">
              <p>¥ {{GoodsPrice}}</p>
              <p class="thirdtext">×1</p>
            </div>
          </router-link>
        </div>
    </section>
    <section class="lr_form">
        <div class="title">宝宝信息</div>
        <div class="linput">
            <label>出生日期/预产期</label>
            <input disabled="" type="text" :value="BirthDay" style="color:#9fa0a0;">
            <input type="date" class="dateinput" data-role="none" value="" placeholder="请选择出生日期/预产期">
        </div>
        <div class="lradio">
            <label>宝宝性别</label>
            <div class="group">
                <div class="ilwrap">
                    <input type="radio" id="InsuredPersonSex0" data-role="none" name="InsuredPersonSex" value="0" :checked="InsuredPersonSex === 0">
                    <label for="InsuredPersonSex0">男孩&nbsp;&nbsp;</label>
                </div>
                <div class="ilwrap">
                    <input type="radio" id="InsuredPersonSex1" data-role="none" name="InsuredPersonSex" value="1" :checked="InsuredPersonSex === 1">
                    <label for="InsuredPersonSex1">女孩&nbsp;&nbsp;</label>
                </div>
                <div class="ilwrap">
                    <input type="radio" id="InsuredPersonSex2" data-role="none" name="InsuredPersonSex" value="2" :checked="InsuredPersonSex === 2">
                    <label for="InsuredPersonSex2">未知&nbsp;&nbsp;</label>
                </div>
            </div>
        </div>
    </section>
    <section class="lr_form">
      <div class="yqm">
        <label>邀请码</label>
        <div class="con"><span class="thirdtext" id="OldPromotionCodeMark" style="display:none;">(M为旧邀请码标识)</span><input type="text" :value="PromotionCode" placeholder="请输入邀请码"></div>
      </div>
      <div class="la" @click="pagetrigger(2)">
        <label>选择免邮券</label>
        <a class="tr iconfont" id="availableCount">{{coupontips}} &#xe60b;</a>
      </div>
    </section>
    <section class="paydetail">
      <div class="line"><div class="left">领用押金</div><span>¥ {{GoodsPrice}}</span></div>
      <div class="line"><div class="left">优惠券金额</div><span>¥ {{CouponMoney}}</span></div>
      <div class="line"><div class="left">运费</div><span>¥ {{FreightMoney}}</span></div>
    </section>
    <div class="zcfoot">
      <p class="left price">需支付 :&nbsp;&nbsp;<span>¥ {{parseFloat(GoodsPrice + FreightMoney-CouponMoney).toFixed(2)}}</span></p>
      <a href="javascript:;"  @click="AddZulinBase" class="right">提交订单</a>
    </div>
    </div>
        <!-- 选择优惠券 -->
    <div class="couponpage" v-show="deliverypage === 2">
      <div class="couponmenu">
        <div :class="{active: coupontype===1}" @click="triggercoupon(1)">
          <span>可用优惠券(<span>{{availableList.length}}</span>)</span>
        </div>
        <div :class="{active: coupontype===2}" @click="triggercoupon(2)">
          <span>不可用优惠券(<span>{{unavailableList.length}}</span>)</span>
        </div>
      </div>
      <ul v-show="coupontype===1">
        <v-coupon v-for="(item, index) in availableList" :key="index+'_cou'" :couponinfo='item' :class="{checked:item.MbrDiscountCouponId===CouponId}" @emitcoupon="usecoupon(item.MbrDiscountCouponId, item.DeductMoney)"></v-coupon>
      </ul>
      <ul class="unavail" v-show="coupontype===2">
        <v-coupon v-for="(item, index) in unavailableList" :key="index+'_uncou'" :couponinfo='item'></v-coupon>
      </ul>
      <button class="btnabb" @click="pagetrigger(1)">确定</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import qs from 'qs'
import apiport from '../../util/api'
import BaseInfoHelper from '@/util/Global_BaseInfoHelper'
import orderDetail from '@/util/Order_Detail'
import head from '@/components/common/header'
import coupon from '@/components/common/coupon'
export default {
  name: 'zulinconfirm',
  components: {
    'vHeader': head,
    'vCoupon': coupon,
  },
  data () {
    return {
      headinfo: {'title': '领用确认', leftfun: 1},
      ConsigneeId: 0,
      ContactName: '',
      ContactPhone: '',
      FullAddress: '',
      GoodsImgPath: '',
      GoodsTitle: '',
      PropertyValue: '',
      GoodsPrice: '',
      FreightMoney: '',
      BirthDay: '',
      InsuredPersonSex: 0,
      orderid: '',
      rentid: '',
      RentName: '',
      RentAmount: '',
      PromotionCode: '',
      deliverypage:0,
      coupontype: 1,
      CouponId: 0,
      CouponMoney: 0,
      availableList:[],
      unavailableList:[]
    }
  },
  computed:{
    coupontips: function () {
      if (this.CouponId !== 0) {
        return '已选择1张优惠券(省¥' + this.CouponMoney.toFixed(2) + ')'
      } else {
        return this.availableList.length + '张可用'
      }
    }
  },
  mounted: function () {
    let _that = this
    this.ConsigneeId = window.sessionStorage.getItem('ChooseConsigneeId') || 0
    this.orderid = this.$route.params.id
    this.rentid = this.$route.query.rentid ? this.$route.query.rentid : ''
    let model = {
      Token: this.$store.state.UserToken,
      GoodsBaseId: this.orderid,
      ConsigneeId: this.ConsigneeId,
      RentId: this.rentid
    }
    this.$http({
      url: apiport.Goods_GetZulinByGoodsId,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        let data = res.data
        this.ConsigneeId = data.ConsigneeId
        this.ContactName = data.ContactName
        this.ContactPhone = data.ContactPhone
        this.FullAddress = data.FullAddress
        this.GoodsImgPath = data.GoodsImgPath + '@!standard_square_m'
        this.GoodsTitle = data.GoodsTitle
        this.PropertyValue = data.PropertyValue
        this.GoodsPrice = data.GoodsPrice
        this.FreightMoney = data.FreightMoney
        this.BirthDay = data.SeatPolicyModel.BirthDay
        this.InsuredPersonSex = data.SeatPolicyModel.InsuredPersonSex
        this.RentName = data.RentName
        this.RentAmount = data.RentAmount
        data.availableList.forEach(function (item, index) {
          item.status = 11
        })
        data.unavailableList.forEach(function (item, index) {
          item.status = 12
        })
        this.availableList=data.availableList
        this.unavailableList=data.unavailableList
        BaseInfoHelper.GetLoginInfo().then(function (res) {
            _that.PromotionCode = !!res.TGCode ?res.TGCode.toUpperCase():""
          })
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    AddZulinBase () {
      let _that = this
      let model = {
        Token: this.$store.state.UserToken,
        BirthDay: this.BirthDay,
        ConsigneeId: this.ConsigneeId,
        DiscountCouponId: '0',
        GoodsId: this.$route.params.id,
        IdentityCard: '',
        InsuredPersonSex: this.InsuredPersonSex,
        IsChangeDeposit: 0,
        PromotionCode: this.PromotionCode,
        RentId: 0
      }
      orderDetail.CheckPromotionCode(this.PromotionCode).then(function (res) {
        if (res === 1) {
          _that.$http({
            url: apiport.Order_AddZulinBase,
            method: 'post',
            data: qs.stringify({ reqJson: JSON.stringify(model) })
          })
            .then(res => {
              orderDetail.PageToGoodsPay(res.data.Data)
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    pagetrigger (i) {
      if (i === 1) {
        if (this.deliverypage === 0) {
          this.$router.back()
        } else {
          this.deliverypage = 0
          this.headinfo.title = '确认购买'
        }
      } else {
        this.deliverypage = 2
        this.headinfo.title = '选择优惠券'
      }
    },
    triggercoupon (i) {
      if (i === this.coupontype) {
        return true
      } else {
        this.coupontype = i
      }
    },
    usecoupon (couponid, money) {
      if (this.CouponId === couponid) {
        this.CouponId = 0
        this.CouponMoney = 0
      } else {
        this.CouponId = couponid
        this.CouponMoney = money
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.confirmadd{
  margin: 1rem 0 .2rem;
  background:#fff;
  &>a{
    border-bottom:1px solid #ededed;
    display:-webkit-box;
    display:flex;
    align-items: center;
    .dwlogo{
      font-size: 20px;
      color: #9fa0a0;
      text-indent: .2rem;
    }
  }
  .title {
    flex: 1;
    padding:.2rem 0 .2rem .2rem;
    font-size:14px;
    p:first-child{
      margin-bottom: .2rem;
    }
  }
}
.order-cont{
  margin-bottom: .2rem;
  background:#fff;
  a{
    display:-webkit-box;
    display: flex;
    padding: .2rem 0;
    .left{
      width: 1.6rem;
      margin-left: .2rem;
      margin-right: .2rem;
      font-size: 0;
    }
    .center{
      -webkit-box-flex: 1;
      flex: 1;
      font-size: 12px;
      padding-right: .2rem;
      .title{
        height: .6rem;
        line-height: .3rem;
      }
      .style{
        line-height: .3rem;
        min-height: .6rem;
        color:#9fa0a0;
      }
      .c1{
        color:@base-ycolor3;
      }
    }
    .right{
      min-width: 1.4rem;
      margin-right: .2rem;
      text-align: right;
      position: relative;
      .thirdtext{
        color:#9fa0a0;
      }
    }
  }
}
.lr_form{
    background-color:#fff;
    margin-top:.2rem;
    border-top:1px solid #dcdddd;
    border-bottom:1px solid #dcdddd;
    .title{
      text-align: center;
      line-height: .8rem;
      border-bottom: 1px solid #dcdddd;
      font-size: 16px;
    }
    .linput{
      display: -webkit-box;
      display: flex;
      margin-left: .2rem;
      border-bottom: 1px solid #dcdddd;
      height: .8rem;
      -webkit-box-align: center;
      align-items: center;
      label{
        width: 2.8rem;
        margin: 0;
        font-size: 14px;
      }
      input{
        -webkit-box-flex: 1;
        flex: 1;
        -webkit-appearance: none;
        border: none;
        outline: none;
        text-align: right;
        padding-right: .2rem;
        background-color: #fff;
        color:#9fa0a0;
      }
      .dateinput{
        position: absolute;
        right: 0;
        opacity: .01;
        width: 2rem;
        height: .8rem;
        z-index: 2;
      }
    }
    .lradio{
      display: -webkit-box;
      display: flex;
      margin-left: .2rem;
      height: .8rem;
      -webkit-box-align: center;
      align-items: center;
      label{
        width: 2.8rem;
        margin: 0;
        font-size: 14px;
      }
      .group{
        -webkit-box-flex: 1;
        flex: 1;
        color: #b5b5b6;
        text-align: right;
        .ilwrap{
          display: inline-block;
          &>label:before{
            content: "\e66e";
            font-family: iconfont;
            font-size: 16px;
            color: #b5b5b6;
            margin-right: 4px;
            vertical-align: middle;
          }
          &>input:checked+label:before{
            content: "\e605";
            color: #f1bc19;
          }
        }
        input{
          display:none;
        }
      }
    }
    .yqm{
      display: -webkit-box;
      display: flex;
      margin-left: .2rem;
      height: .8rem;
      border-bottom: 1px solid #dcdddd;
      -webkit-box-align: center;
      align-items: center;
      label{
        width: 2rem;
        margin: 0;
        font-size: 14px;
      }
      .con{
        -webkit-box-flex: 1;
        flex: 1;
        color: #b5b5b6;
        text-align: right;
        padding-right: .2rem;
        input{
          width: 96px;
          border: none;
          outline: none;
          text-align: right;
          padding-left: 4px;
        }
      }
    }
    .la{
      display: -webkit-box;
      display: flex;
      margin-left: .2rem;
      height: .8rem;
      -webkit-box-align: center;
      align-items: center;
      label{
        width: 2.8rem;
        margin: 0;
        font-size: 14px;
      }
      .tr{
        -webkit-box-flex: 1;
        flex: 1;
        color: #b5b5b6;
        text-align: right;
        padding-right: .2rem;
      }
    }
}
.paydetail{
    background-color: #fff;
    padding: .2rem;
    border-bottom: 1px solid #dedddd;
    font-size: 14px;
    line-height: 24px;
    border-top: 1px solid #dcdddd;
    margin-top: .2rem;
    .line{
      text-align: right;
      .left{
        float: left;
      }
    }
}
.zcfoot{
  position: fixed;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  bottom: 0;
  display: flex;
  line-height: 1rem;
  background-color: #fff;
  .left{
    flex: 2.5;
    font-size: 16px;
    font-weight: 400;
    color: #3e3a39;
    text-align: right;
    margin-right: .2rem;
    span{
      color: @base-ycolor3;
    }
  }
  .right{
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #fff;
    background-color: @base-ycolor3;
  }
}
.btnabb {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: #ff9c00;
  font-size: 16px;
  color: #fff;
  padding: 12px;
  border: none;
}
.couponmenu{
  padding-top: 1rem;
  display:-webkit-box;
  display:flex;
  background-color:#fff;
  font-size:14px;
  &>div{
    flex: 1;
    line-height: 40px;
    text-align: center;
    &.active>span{
      color:#f1bc19;
      padding-bottom:9px;
      border-bottom:2px solid #f1bc19;
    }
  }
}
.couponpage{
  ul{
    padding-bottom: 1rem;
  }
  .unavail li{
    background-color: #E5E5E5;
    border: 1px solid #CCC;
    &::before{
      border-color: #ccc #ccc transparent transparent;
    }
    &::after{
      border-color: transparent transparent #ccc #ccc;
    }
  }
}
</style>
