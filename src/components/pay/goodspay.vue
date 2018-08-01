<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="sectc">
      <div class="title">使用贝壳支付<span class="validcodePrompt">验证码已发往130****0000</span></div>
      <div class="content">
        <div class="line borderbottom">
          <label id="OrderPayPointSelect" class="unselectpoint"></label>贝壳支付 :
          <span class="price">0<span class="gstotal">(¥ 0)</span></span>
          <span id="SeatNoPointPayRemark">* 安全座椅不可使用</span>
        </div>
      </div>
      <p class="get-voice-validate get" style="display: none;">收不到短信？使用<span data-id="1" class="SendTTSValidCode SendValidCode">语音验证码</span></p>
    </section>
    <section class="sectc" style="margin-top:0">
      <div class="title">使用第三方支付</div>
      <div class="pf">
          <div class="rpay OrderPaySelect" id="zfbPay">
              <label id="zfbOrderPaySelect" class="selectpays selected"></label>
              <i class="iconfont zfbicon">&#xe619;</i> 支付宝支付
              <span id="zfbPricePartOrderPay" class="cprice">¥ 140.01</span>
          </div>
          <div class="rpay OrderPaySelect" id="wxPay">
              <label id="wxOrderPaySelect" class="selectpays"></label>
              <i class="iconfont wxicon">&#xe615;</i> 微信支付
              <span id="wxPricePartOrderPay" class="cprice"></span>
          </div>
          <div class="rpay OrderPaySelect" id="zmxyPay" style="display:none;">
              <label id="zmxyOrderPaySelect" class="selectpays"></label>
              <i class="alipayicon"></i> 芝麻信用借还
              <span id="zmxyPayPricePartOrderPay" class="cprice"></span>
          </div>
        </div>
    </section>
    <section class="secsl">
      <div class="paytotal">支付总额：<span class="price"><span id="OrderPayGoodsPay">¥ 140.01</span></span><span id="OrderPayTotalPoint" class="gstotal"></span></div>
    </section>
    <button class="btnabb">确认支付</button>
    <section class="payingtips" v-show="paying">
      <div class="pcontent">
        <div>
            <img src="https://cdn.sys.img.95laibei.com/Content/Images/paying.png" alt="正在支付中">
        </div>
        <p>支付失败？<span id="reCheckPay">重新选择支付方式</span></p>
      </div>
  </section>
  </div>
</template>

<script>
import head from '@/components/common/header'
export default {
  name: 'goodspay',
  components: {
    'vHeader': head
  },
  data () {
    return {
      headinfo: {title: '交易支付'},
      paying: false
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.sectc{
  box-shadow: 0 -1px 1px #ebebec, 0 1px 1px #ebebec;
  background-color: #fff;
  margin-top: 1rem;
  .title{
    line-height: .8rem;
    background-color: #fff;
    padding-left: .2rem;
    font-size: 15px;
  }
  .validcodePrompt{
    float: right;
    margin-right: .2rem;
    color: #ff9c00;
    display: none;
  }
  .line{
    font-size: 16px;
    margin-left: .2rem;
    line-height: .4rem;
    padding-bottom: .2rem;
    border-bottom: 1px solid #ededed;
    .unselectpoint{
      display: inline-block;
      width: .6rem;
      height: .8rem;
      background: url(https://cdn.sys.img.95laibei.com/Content/Images/rectunchecked.png) no-repeat 0 center;
      background-size: 16px;
      font-size: 0;
      vertical-align: middle;
    }
    #SeatNoPointPayRemark{
      display: block;
      color: #ff9c00;
      font-size: 13px;
    }
    .price{
      color:#9fa0a0;
    }
  }
  .get-voice-validate{
    text-align: right;
    margin-top: .2rem;
    margin-right: .2rem;
    &.get{
      margin-top: 0;
      padding-bottom: .2rem;
    }
  }
  .pf{
    padding-left: .2rem;
    .rpay{
      background-color: #fff;
      line-height: .8rem;
      border-bottom: 1px solid #ededed;
    }
    .selectpays{
      display: inline-block;
      width: .6rem;
      height: .8rem;
      background: url(http://cdn.sys.img.95laibei.com/Content/Images/circleunselect.png) no-repeat 0 center;
      background-size: 16px;
      font-size: 0;
      vertical-align: middle;
      padding-bottom: 3px;
      &.selected{
        background: url(http://cdn.sys.img.95laibei.com/Content/Images/circleselect_1.png) no-repeat 0 center;
        background-size: 16px;
      }
    }
    .zfbicon{
      font-size: 22px;
      color: #00abef;
      vertical-align: bottom;
    }
    .wxicon{
      font-size: 18px;
      margin: 0 2px;
      color: #4fb640;
      vertical-align: bottom;
    }
    .cprice{
      float: right;
      margin-right: .2rem;
      color: @base-ycolor3;
    }
  }
}
.secsl{
  margin: .2rem 0;
  background-color: #fff;
  line-height: .8rem;
  text-align: right;
  padding-right: .2rem;
  .price{
    font-size: 16px;
    color: @base-ycolor3;
  }
}
.btnabb{
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
