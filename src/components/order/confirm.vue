<template>
  <div>
    <v-header :headinfo="headinfo" @hidediv="pagetrigger(1)"></v-header>
    <section class="confirmadd" v-show="deliverypage === 0">
      <router-link class="clearfix" :to='{path:"/My/AddressManage",query:{returnUrl:orderid !== 0 ? "/Order/Confirm/" + orderid : "/Order/Confirm"}}'>
        <div class="iconfont dwlogo">&#xe61a;</div>
        <div class="title">
          <p>{{orderdata.ContactName}}&nbsp;&nbsp; {{orderdata.ContactPhone}}</p>
          <p>{{orderdata.FullAddress}}</p>
        </div>
        <div class="arrow iconfont">&#xe61e;</div>
      </router-link>
      <div v-if="orderdata.IsOverSeas" class="form_base_line">
        <label>身份信息：</label>
        <div class="right_inp">
          <div><input type="text" readonly="readonly" value="请上传清晰端正的身份证正反面照片"></div>
        </div>
      </div>
      <div v-if="orderdata.IsOverSeas" class="form_base_line"><p class="fscolor">海关政策要求，进口商品收货人必须提供真实姓名和身份证信息，加密保存，仅用于清关。</p></div>
      <img-upload v-if="orderdata.IsOverSeas" :uploadimg='imguploaddata' @passimgid="receiveimgid"></img-upload>
    </section>
    <section class="order-cont" v-for="(item, index) in orderdata.OrderInfoList" :key="index" v-show="deliverypage === 0">
        <div class="item">
          <router-link to="" v-for="(item1, index1) in item.GoodsList" :key="index1 + '_1'">
            <div class="left">
              <img :src="item1.ImgPath + '@!standard_square_m'">
            </div>
            <div class="center">
              <p class="title twolinetext">{{item1.GoodsTitle}}</p>
              <p class="style">{{item1.PropertyValue}}</p>
            </div>
            <div class="right">
              <p class="f16">¥ {{item1.GoodsPrice}}</p>
              <p class="thirdtext f16">×{{item1.GoodsQuantity}}</p>
            </div>
          </router-link>
        </div>
        <div class="tag-wrap delivery" @click="pagetrigger(0)">
          <div class="tag">
            <a href="javascript:;">
              <div class="tag-core">配送方式</div>
              <div class="tag-arrow iconfont"><span>{{FreightTemplateId>0?item.FreightList.find(e=>e.FreightTemplateId==FreightTemplateId).Title:""}}</span>&#xe60b;</div>
            </a>
          </div>
        </div>
        <div class="sld clearfix note">
          <label>备注:</label>
          <div class="con mline">
            <input v-model="OrderRemark[index]" class="inp" placeholder="选填:对本交易的说明,建议填写已和卖家协商的信息">
          </div>
        </div>
    </section>
    <section class="lr_form" v-show="deliverypage === 0">
      <div class="yqm">
        <label>邀请码</label>
        <div class="con"><span class="thirdtext" v-if="String(PromotionCode).indexOf('M') > -1">(M为旧邀请码标识)</span><input type="text" :value="PromotionCode" placeholder="请输入邀请码"></div>
      </div>
      <div class="la" @click="pagetrigger(2)">
        <label>优惠券</label>
        <a href="javascript:;" class="tr iconfont">{{coupontips}} &#xe60b;</a>
      </div>
    </section>
    <div class="zcfoot" v-show="deliverypage === 0">
      <p class="left price">合计 :&nbsp;&nbsp;<span>¥ {{parseFloat(orderdata.PayMoney + orderdata.FreightMoney-CouponMoney).toFixed(2)}}</span><i>(含运费&yen;{{orderdata.FreightMoney}})</i></p>
      <a href="javascript:;"  @click="OrderConfirmSubmit" class="right">提交订单</a>
    </div>
    <!-- 选择配送方式 -->
    <div class="pspage" v-show="deliverypage === 1">
      <section class="tag-wrap ps">
        <div class="tag borderbottom">
          <a href="javascript:;">
            <div class="tag-core">选择配送方式</div>
          </a>
        </div>
        <ul class="courier">
          <li class="freightLi0" @click="triggerFreightTemplate(item.FreightTemplateId)" v-for="(item, index) in orderdata.OrderInfoList[0].FreightList" :key="index+'_f'">
            <span class="iconfont textcolorr" v-html="item.FreightTemplateId===FreightTemplateId? '&#xe605;' : '&#xe66e;'"></span>{{item.Title}}
          </li>
        </ul>
      </section>
      <button class="btnabb" @click="pagetrigger(1)">确定</button>
    </div>
    <!-- 选择优惠券 -->
    <div class="couponpage" v-show="deliverypage === 2">
      <div class="couponmenu">
        <div :class="{active: coupontype===1}" @click="triggercoupon(1)">
          <span>可用优惠券(<span>{{orderdata.availableList.length}}</span>)</span>
        </div>
        <div :class="{active: coupontype===2}" @click="triggercoupon(2)">
          <span>不可用优惠券(<span>{{orderdata.unavailableList.length}}</span>)</span>
        </div>
      </div>
      <ul v-show="coupontype===1">
        <v-coupon v-for="(item, index) in orderdata.availableList" :key="index+'_cou'" :couponinfo='item' :class="{checked:item.MbrDiscountCouponId===CouponId}" @emitcoupon="usecoupon(item.MbrDiscountCouponId, item.DeductMoney)"></v-coupon>
      </ul>
      <ul class="unavail" v-show="coupontype===2">
        <v-coupon v-for="(item, index) in orderdata.unavailableList" :key="index+'_uncou'" :couponinfo='item'></v-coupon>
      </ul>
      <button class="btnabb" @click="pagetrigger(1)">确定</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import qs from 'qs'
import apiport from '../../util/api'
import storage from '@/util/storage'
import BaseInfoHelper from '@/util/Global_BaseInfoHelper'
import orderDetail from '@/util/Order_Detail'

import head from '@/components/common/header'
import coupon from '@/components/common/coupon'
import imgupload from '@/components/common/imgupload'
export default {
  name: 'confirm',
  components: {
    'vHeader': head,
    'vCoupon': coupon,
    'imgUpload': imgupload
  },
  data () {
    return {
      headinfo: {'title': '确认购买', leftfun: 1},
      ConsigneeId: 0,
      orderid: '',
      Quantity: 1,
      PromotionCode: 0,
      deliverypage: 0,
      orderdata: {ConsigneeId: 0, ContactName: '', ContactPhone: '', FreightMoney: 0, FullAddress: '', IdCardFrontImgId: '', IdCardFrontPath: '', IdCardOppositeImgId: '', IdCardOppositeImgPath: '', IdentityCard: '', IsOverSeas: '', OrderInfoList: [{FreightList: [{Status: 1, Title: ''}], GoodsList: [{ImgPath: ''}]}], PayMoney: 0, availableList: [], unavailableList: []},
      coupontype: 1,
      CouponId: 0,
      CouponMoney: 0,
      OrderRemark: [''],
      IdCardImgIdArr: [],
      imguploaddata: {
        max: 2,
        imglist: []
      },
      FreightTemplateId:0
    }
  },
  computed: {
    coupontips: function () {
      if (this.CouponId !== 0) {
        return '已选择1张优惠券(省¥' + this.CouponMoney.toFixed(2) + ')'
      } else {
        return this.orderdata.availableList.length + '张可用'
      }
    }
  },
  mounted: function () {
    this.ConsigneeId = window.sessionStorage.getItem('ChooseConsigneeId') || 0
    this.orderid = this.$route.params.id ? this.$route.params.id : 0
    this.Quantity = this.$route.query.Quantity || 1
    if (this.orderid === 0) {
      // 购物车
      let goodsid = storage.getSession('ShoppingCartGoodsIds')
      this.getCartGoodsData(goodsid, this.ConsigneeId)
    } else {
      // 直接购买
      this.getGoodsData(this.orderid, this.ConsigneeId, this.Quantity)
    }
  },
  methods: {
    OrderConfirmSubmit () {
      let _that = this
      orderDetail.CheckPromotionCode(this.PromotionCode).then(function (res) {
        if (res === 1) {
          if (_that.orderdata.IsOverSeas && _that.IdCardImgIdArr.length < 2) {
            alert('请上传身份证正反面各一张')
            return true
          }
          // 组合orderlist参数格式
          let orderlist = []
          let goodslist = []
          _that.orderdata.OrderInfoList.forEach(function (item, index) {
            item.GoodsList.forEach(function (item2) {
              goodslist.push({GoodsId: item2.GoodsId, GoodsQuantity: item2.GoodsQuantity, ProductBaseId: item2.ProductBaseId})
            })
            orderlist.unshift({OrderRemark: _that.OrderRemark[index], FreightTemplateId: _that.FreightTemplateId, GoodsList: goodslist, CuponId: _that.CouponId})
          })
          let model = {
            Token: _that.$store.state.UserToken,
            ConsigneeId: _that.ConsigneeId,
            OrderList: orderlist,
            BuyType: _that.orderid === 0 ? '2' : '1',
            IdentityCard: '',
            IdCardFrontImgId: _that.IdCardImgIdArr[0],
            IdCardOppositeImgId: _that.IdCardImgIdArr[1],
            PromotionCode: _that.PromotionCode
          }
          _that.$http({
            url: apiport.Order_AddBase,
            method: 'post',
            data: qs.stringify({ reqJson: JSON.stringify(model) })
          })
            .then(res => {
              let data = res.data
              storage.DelSessionByKey('ShoppingCartGoodsIds')
              orderDetail.PageToGoodsPay(res.data.ParentOrderId)
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    pagetrigger (i) {
      if (i === 0) {
        this.deliverypage = 1
        this.headinfo.title = '选择配送方式'
      } else if (i === 1) {
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
    getGoodsData (goodsId, consigneeId, quantity) {
      let _that = this
      let model = {
        Token: this.$store.state.UserToken,
        ConsigneeId: consigneeId,
        GoodsBaseId: goodsId,
        GoodsQuantity: quantity
      }
      this.$http({
        url: apiport.Goods_GetBaseConsigneeByUserId,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          let data = res.data
          data.availableList.forEach(function (item, index) {
            item.status = 11
          })
          data.unavailableList.forEach(function (item, index) {
            item.status = 12
          })
          // 身份证照片传递
          if (data.IsOverSeas) {
            if (data.IdCardFrontPath && data.IdCardOppositeImgPath) {
              _that.IdCardImgIdArr.push(data.IdCardFrontImgId, data.IdCardOppositeImgId)
              _that.imguploaddata.imglist.push({imgpath: data.IdCardFrontPath + '@!standard_square_s', imgbaseid: data.IdCardFrontImgId}, {imgpath: data.IdCardOppositeImgPath + '@!standard_square_s', imgbaseid: data.IdCardOppositeImgId})
            }
          }
          _that.orderdata = data
          _that.ConsigneeId = data.ConsigneeId
          _that.FreightTemplateId=data.OrderInfoList[0].FreightList[0].FreightTemplateId
          BaseInfoHelper.GetLoginInfo().then(function (res) {
            _that.PromotionCode = !!res.TGCode ?res.TGCode.toUpperCase():""
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getCartGoodsData (goodsId, consigneeId) {
      let _that = this
      let model = {
        Token: this.$store.state.UserToken,
        ConsigneeId: consigneeId,
        GoodsIds: goodsId
      }
      this.$http({
        url: apiport.Goods_GetData,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          let data = res.data
          data.availableList.forEach(function (item, index) {
            item.status = 11
          })
          data.unavailableList.forEach(function (item, index) {
            item.status = 12
          })
          // 身份证照片传递
          if (data.IsOverSeas) {
            if (data.IdCardFrontPath && data.IdCardOppositeImgPath) {
              _that.IdCardImgIdArr.push(data.IdCardFrontImgId, data.IdCardOppositeImgId)
              _that.imguploaddata.imglist.push({imgpath: data.IdCardFrontPath + '@!standard_square_s', imgbaseid: data.IdCardFrontImgId}, {imgpath: data.IdCardOppositeImgPath + '@!standard_square_s', imgbaseid: data.IdCardOppositeImgId})
            }
          }
          _that.orderdata = data
          _that.ConsigneeId = data.ConsigneeId
          _that.FreightTemplateId=data.OrderInfoList[0].FreightList[0].FreightTemplateId
          BaseInfoHelper.GetLoginInfo().then(function (res) {
            _that.PromotionCode =!!res.TGCode ?res.TGCode.toUpperCase():""
          })
        })
        .catch(error => {
          console.log(error)
        })
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
    },
    receiveimgid (imgid) {
      let index = this.IdCardImgIdArr.indexOf(imgid)
      if (index > -1) {
        this.IdCardImgIdArr.splice(index, 1)
      } else {
        this.IdCardImgIdArr.push(imgid)
      }
    },
    triggerFreightTemplate(id){
      this.FreightTemplateId=id
      this.orderdata.FreightMoney=this.orderdata.OrderInfoList[0].FreightList.find(e=>e.FreightTemplateId==id).FreightMoney
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
        height: .8rem;
        line-height: .4rem;
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
    margin:.2rem auto 1.2rem;
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
    i{
      font-style: normal;
      font-size: 12px;
      color: #9fa0a0;
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
.tag-wrap {
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  .tag{
    height: .88rem;
    padding-left: .2rem;
    display: -webkit-box;
    a{
      width: 100%;
      display: -webkit-box;
      display: box;
      color: #3e3a39;
      &>div{
        -webkit-box-pack: start;
        -moz-box-pack: start;
        -ms-box-pack: start;
        -o-box-pack: start;
        -webkit-box-align: center;
        -moz-box-align: center;
        -ms-box-align: center;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-box;
        display: -o-box;
      }
    }
    .tag-core{
      -moz-box-flex: 1;
      -webkit-box-flex: 1;
      line-height: .4rem;
      font-size: 13px;
      color: #666;
    }
    .tag-arrow{
      padding-right: .2rem;
      line-height: .1rem;
      font-size: 13px;
      color: #333;
      span{
        margin-right: .1rem;
      }
    }
  }
}
.sld.note {
  position: relative;
  line-height: 1rem;
  background-color: #fff;
  margin: 0;
  border-top: 1px solid #dcdddd;
  padding-left: .2rem;
  label{
    float: left;
    width: 1rem;
    margin: 0;
    font-size: 14px;
  }
  .con{
    float: left;
    width: 5.1rem;
    font-size: 12px;
    height: 1rem;
    input{
      width: 5.9rem;
      height: .8rem;
      line-height: .8rem;
      padding: .1rem .2rem .1rem 0;
      -webkit-appearance: none;
      border: 0;
      outline: 0;
      font-size: 12px;
      resize: none;
    }
  }
}
.tag-wrap.ps{
  padding-top: 1rem;
  .tag{
    border-bottom: 1px solid #ededed;
  }
  .courier {
    padding: .3rem .2rem;
    li{
      font-size: 16px;
      line-height: .8rem;
      span{
        margin-right: .2rem;
        font-size: 18px;
        color: @base-ycolor3;
        vertical-align: middle;
      }
    }
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
/*coupon style*/
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
.form_base_line{
  display: -webkit-box;
  display: flex;
  padding: 0 .2rem;
  label{
    width:1.5rem;
    line-height:.8rem;
    font-size: 14px;
  }
  .right_inp {
    -webkit-box-flex: 1;
    flex: 1;
    input {
      height: .8rem;
      line-height: .8rem;
      width: 100%;
      border: 0;
      outline: none;
      color: #999;
    }
  }
  .fscolor {
    font-size: 12px;
    color: #ff4965;
  }
}
</style>
