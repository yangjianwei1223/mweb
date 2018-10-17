<template>
  <div>
    <v-header :headinfo="headinfo" @hidediv="backordelivery"></v-header>
    <section class="confirmadd" v-show="deliverypage === 0">
      <router-link class="clearfix" :to='{path:"/My/AddressManage",query:{returnUrl:orderid !== 0 ? "/Order/Confirm/" + orderid : "/Order/Confirm"}}'>
        <div class="iconfont dwlogo">&#xe61a;</div>
        <div class="title">
          <p>{{orderdata.ContactName}}&nbsp;&nbsp; {{orderdata.ContactPhone}}</p>
          <p>{{orderdata.FullAddress}}</p>
        </div>
        <div class="arrow iconfont">&#xe61e;</div>
      </router-link>
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
        <div class="tag-wrap delivery" @click="checkdelivery" v-show="item.FreightList[0].Status === 1">
          <div class="tag">
            <a href="javascript:;">
              <div class="tag-core">配送方式</div>
              <div class="tag-arrow iconfont"><span>{{item.FreightList[0].Title}}</span>&#xe60b;</div>
            </a>
          </div>
        </div>
        <div class="sld clearfix note">
          <label>备注:</label>
          <div class="con mline">
            <input id="OrderComfirmRemark_0" class="inp" placeholder="选填:对本交易的说明,建议填写已和卖家协商的信息">
          </div>
        </div>
    </section>
    <section class="lr_form" v-show="deliverypage === 0">
      <div class="yqm">
        <label>邀请码</label>
        <div class="con"><span class="thirdtext" id="OldPromotionCodeMark" style="display:none;">(M为旧邀请码标识)</span><input type="text" :value="PromotionCode" placeholder="请输入邀请码"></div>
      </div>
      <div class="la">
        <label>优惠券</label>
        <a href="javascript:;" class="tr iconfont" id="availableCount">{{orderdata.availableList.length}}张可用 &#xe60b;</a>
      </div>
    </section>
    <div class="zcfoot" v-show="deliverypage === 0">
      <p class="left price">合计 :&nbsp;&nbsp;<span>¥ {{parseFloat(orderdata.PayMoney + orderdata.FreightMoney).toFixed(2)}}</span><i>(含运费&yen;{{orderdata.FreightMoney}})</i></p>
      <a href="javascript:;"  @click="OrderConfirmSubmit" class="right">提交订单</a>
    </div>
    <!-- 选择配送方式 -->
    <section class="tag-wrap ps" v-show="deliverypage === 1">
      <div class="tag borderbottom">
        <a href="javascript:;">
          <div class="tag-core">选择配送方式</div>
        </a>
      </div>
      <ul class="courier">
        <li class="freightLi0">
          <span class="iconfont textcolorr"></span>免邮
        </li>
      </ul>
    </section>
    <button v-show="deliverypage === 1" class="btnabb">确定</button>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'

import head from '@/components/common/header'
export default {
  name: 'confirm',
  components: {
    'vHeader': head
  },
  data () {
    return {
      headinfo: {'title': '确认购买', leftfun: 1},
      ConsigneeId: 0,
      orderid: '',
      Quantity: 1,
      PromotionCode: 99010,
      deliverypage: 0,
      orderdata: {ConsigneeId: 0, ContactName: '', ContactPhone: '', FreightMoney: 0, FullAddress: '', IdCardFrontImgId: '', IdCardFrontPath: '', IdCardOppositeImgId: '', IdCardOppositeImgPath: '', IdentityCard: '', IsOverSeas: '', OrderInfoList: [{FreightList: [{Status: 1, Title: ''}], GoodsList: [{ImgPath: ''}]}], PayMoney: 0, availableList: []}
    }
  },
  mounted: function () {
    this.ConsigneeId = window.sessionStorage.getItem('ChooseConsigneeId') || 0
    this.orderid = this.$route.params.id ? this.$route.params.id : 0
    this.Quantity = this.$route.query.Quantity || 1
    if (this.orderid === 0) {
      // 购物车
    } else {
      // 直接购买
      this.getGoodsData(this.orderid, this.ConsigneeId, this.Quantity)
    }
  },
  methods: {
    OrderConfirmSubmit () {
      // let _that = this
      let model = {
        Token: this.$store.state.UserToken,
        ConsigneeId: this.ConsigneeId,
        OrderList: this.$route.params.id,
        BuyType: '',
        IdentityCard: '',
        IdCardFrontImgId: '',
        IdCardOppositeImgId: '',
        PromotionCode: ''
      }
      this.$http({
        url: apiport.Order_AddBase,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          let data = res.data
          console.log('提交订单', data)
          let openid = JSON.parse(window.sessionStorage.getItem('MainOpenId'))
          // eslint-disable-next-line
          if (!openid && navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7ff0669994ee3210&redirect_uri=https%3a%2f%2ft-mweb.95laibei.com%2fpay%2fWxCode&response_type=code&scope=snsapi_userinfo&state=GoodsPay|' + res.data.ParentOrderId + '#wechat_redirect'
            return true
          }
          // _that.$router.push({path: '/Pay/GoodsPay', query: {id: res.data.Data}})
          window.location.href = '/Pay/GoodsPay?id=' + res.data.ParentOrderId
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    checkdelivery () {
      this.deliverypage = 1
      this.headinfo.title = '选择配送方式'
    },
    backordelivery () {
      if (this.deliverypage === 1) {
        this.deliverypage = 0
        this.headinfo.title = '确认购买'
      }
    },
    getGoodsData (goodsId, consigneeId, quantity) {
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
          console.log('商品信息', data)
          this.orderdata = data
          this.ConsigneeId = data.ConsigneeId
        })
        .catch(error => {
          console.log(error)
        })
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
  position: absolute;
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
</style>
