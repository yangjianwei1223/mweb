<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="confirmadd">
      <router-link class="clearfix" :to='{path:"/My/AddressManage",query:{returnUrl:"/Order/ZulinConfirm/8099"}}'>
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
              <p class="style c1">租用期限：一月-5元</p>
            </div>
            <div class="right">
              <p>¥ 140</p>
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
        <div class="con"><span class="thirdtext" id="OldPromotionCodeMark" style="display:none;">(M为旧邀请码标识)</span><input type="text" id="PromotionCode" data-role="none" value="" placeholder="请输入邀请码"></div>
      </div>
      <div class="la">
        <label>选择免邮券</label>
        <a class="tr ui-link" id="availableCount">0张可用</a>
      </div>
    </section>
    <section class="paydetail">
      <div class="line"><div class="left">领用押金</div><span>¥ 140</span></div>
      <div class="line"><div class="left">优惠券金额</div><span>¥ 0.00</span></div>
      <div class="line"><div class="left">运费</div><span>¥ 0.01</span></div>
    </section>
    <div class="zcfoot">
      <p class="left price">需支付 :&nbsp;&nbsp;<span>¥ 140.01</span></p>
      <a href="javascript:;"  @click="AddZulinBase" class="right">提交订单</a>
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
      headinfo: {'title': '领用确认'},
      ConsigneeId: 0,
      ContactName: '',
      ContactPhone: '',
      FullAddress: '',
      GoodsImgPath: '',
      GoodsTitle: '',
      PropertyValue: '',
      GoodsPrice: '',
      BirthDay: '',
      InsuredPersonSex: 0,
      orderid: ''
    }
  },
  mounted: function () {
    let model = {
      Token: this.$store.state.UserToken,
      GoodsBaseId: this.$route.params.id,
      ConsigneeId: 0,
      RentId: ''
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
        console.log('领用信息', data)
        this.ConsigneeId = data.ConsigneeId
        this.ContactName = data.ContactName
        this.ContactPhone = data.ContactPhone
        this.FullAddress = data.FullAddress
        this.GoodsImgPath = data.GoodsImgPath + '@!standard_square_m'
        this.GoodsTitle = data.GoodsTitle
        this.PropertyValue = data.PropertyValue
        this.GoodsPrice = data.GoodsPrice
        this.BirthDay = data.SeatPolicyModel.BirthDay
        this.InsuredPersonSex = data.SeatPolicyModel.InsuredPersonSex
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  },
  methods: {
    AddZulinBase () {
      // let _that = this
      let model = {
        Token: this.$store.state.UserToken,
        BirthDay: this.BirthDay,
        ConsigneeId: this.ConsigneeId,
        DiscountCouponId: '0',
        GoodsId: this.$route.params.id,
        IdentityCard: '',
        InsuredPersonSex: this.InsuredPersonSex,
        IsChangeDeposit: 0,
        PromotionCode: '17',
        RentId: 0
      }
      this.$http({
        url: apiport.Order_AddZulinBase,
        method: 'post',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          let data = res.data
          console.log('提交订单', data)
          alert('提交订单')
          // _that.$router.push({path: '/Pay/GoodsPay', query: {id: res.data.Data}})
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7ff0669994ee3210&redirect_uri=https%3a%2f%2ft3-mweb.95laibei.com%2fpay%2fWxCode&response_type=code&scope=snsapi_userinfo&state=GoodsPay|' + res.data.Data + '#wechat_redirect'
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
