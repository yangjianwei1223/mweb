<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="confirmadd">
      <router-link class="clearfix" :to='{path:"/My/AddressManage",query:{returnUrl:"/Order/Confirm/" + orderid}}'>
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
            </div>
            <div class="right">
              <p>¥ {{GoodsPrice}}</p>
              <p class="thirdtext">×{{Quantity}}</p>
            </div>
          </router-link>
        </div>
        <div class="tag-wrap delivery" id="Distribution_0" data-tid="0" data-money="0" data-chooseid="28">
          <div class="tag">
            <a class="ui-link">
              <div class="tag-core">配送方式</div>
              <div class="tag-arrow iconfont"><span id="DistributionTitle_0">免邮</span>&#xe60b;</div>
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
    <section class="lr_form">
      <div class="yqm">
        <label>邀请码</label>
        <div class="con"><span class="thirdtext" id="OldPromotionCodeMark" style="display:none;">(M为旧邀请码标识)</span><input type="text" :value="PromotionCode" placeholder="请输入邀请码"></div>
      </div>
      <div class="la">
        <label>选择免邮券</label>
        <a class="tr ui-link" id="availableCount">0张可用</a>
      </div>
    </section>
    <div class="zcfoot">
      <p class="left price">合计 :&nbsp;&nbsp;<span>¥ {{parseFloat(GoodsPrice + FreightMoney).toFixed(2)}}</span><i>(含运费&yen;{{FreightMoney}})</i></p>
      <a href="javascript:;"  @click="OrderConfirmSubmit" class="right">提交订单</a>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'

import head from '@/components/common/header'
export default {
  name: 'zulinconfirm',
  components: {
    'vHeader': head
  },
  data () {
    return {
      headinfo: {'title': '确认购买'},
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
      Quantity: 1,
      PromotionCode: 99010
    }
  },
  mounted: function () {
    this.ConsigneeId = window.sessionStorage.getItem('ChooseConsigneeId') || 0
    this.orderid = this.$route.params.id
    this.Quantity = this.$route.query.Quantity
    let model = {
      Token: this.$store.state.UserToken,
      GoodsBaseId: this.orderid,
      ConsigneeId: this.ConsigneeId
    }
    this.$http({
      url: apiport.Goods_GetZulinByGoodsId,
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        let data = res.data
        console.log('购买信息', data)
        this.ConsigneeId = data.ConsigneeId
        this.ContactName = data.ContactName
        this.ContactPhone = data.ContactPhone
        this.FullAddress = data.FullAddress
        this.GoodsImgPath = data.GoodsImgPath + '@!standard_square_m'
        this.GoodsTitle = data.GoodsTitle
        this.PropertyValue = data.PropertyValue
        this.GoodsPrice = data.GoodsPrice
        this.FreightMoney = data.FreightMoney
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
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
          let openid = window.sessionStorage.getItem('MainOpenId')
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
</style>
