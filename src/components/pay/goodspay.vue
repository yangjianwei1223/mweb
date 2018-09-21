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
          <div class="rpay OrderPaySelect" id="zfbPay" @click="payselect(0)">
              <label id="zfbOrderPaySelect" class="selectpays"></label>
              <i class="iconfont zfbicon">&#xe619;</i> 支付宝支付
              <span id="zfbPricePartOrderPay" class="cprice" style="display:none;">¥ {{thirdPayPoint}}</span>
          </div>
          <div class="rpay OrderPaySelect" id="wxPay" @click="payselect(1)">
              <label id="wxOrderPaySelect" class="selectpays"></label>
              <i class="iconfont wxicon">&#xe615;</i> 微信支付
              <span id="wxPricePartOrderPay" class="cprice" style="display:none;">¥ {{thirdPayPoint}}</span>
          </div>
          <div class="rpay OrderPaySelect" id="zmxyPay" style="display:none;" @click="payselect">
              <label id="zmxyOrderPaySelect" class="selectpays"></label>
              <i class="alipayicon"></i> 芝麻信用借还
              <span id="zmxyPayPricePartOrderPay" class="cprice">¥ {{thirdPayPoint}}</span>
          </div>
        </div>
    </section>
    <section class="secsl">
      <div class="paytotal">支付总额：<span class="price"><span id="OrderPayGoodsPay">¥ {{PointsQuantity}}</span></span><span id="OrderPayTotalPoint" class="gstotal"></span></div>
    </section>
    <button class="btnabb" @click="confirmpay">确认支付</button>
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
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
export default {
  name: 'goodspay',
  components: {
    'vHeader': head
  },
  data () {
    return {
      headinfo: {title: '交易支付'},
      paying: false,
      OrderType: 1,
      PointsUsable: 0,
      PointsQuantity: 0,
      thirdPayPoint: 0
    }
  },
  mounted: function () {
    let model = {
      ParentOrderId: this.$route.query.id,
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Order_GetPayDetailById,
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('订单支付信息', res.data)
        let data = res.data
        this.OrderType = data.OrderType
        this.PointsUsable = data.PointsUsable
        this.PointsQuantity = data.PointsQuantity
        this.thirdPayPoint = (Number(data.PointsQuantity - data.PointsUsable)).toFixed(2)
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  },
  methods: {
    confirmpay () {
      let _that = this
      if (document.getElementsByClassName('selected')[0].getAttribute('id') === 'zfbOrderPaySelect') {
        // 支付宝支付
        let model = {
          IsMixPay: 0,
          PaymentMethod: 1,
          Remark: '商品购买',
          Token: this.$store.state.UserToken,
          showUrl: document.location.origin + '/Pay/GoodsPay?id=' + this.$route.query.id,
          type: 1,
          relationId: this.$route.query.id,
          hasPointPay: false,
          hasTimesCardPay: false
        }
        this.$http({
          url: apiport.Alipay_Pay,
          method: 'post',
          data: qs.stringify({reqJson: JSON.stringify(model)})
        })
          .then(res => {
            let result = this.Alipayform(JSON.parse(res.data.AlipayHtml))
            document.getElementsByTagName('body')[0].insertAdjacentHTML('afterBegin', result)
            document.getElementById('alipaysubmit').submit()
          })
          .catch(error => {
            console.log(error)
          })
      } else if (document.getElementsByClassName('selected')[0].getAttribute('id') === 'wxOrderPaySelect') {
        // 微信支付
        let model = {
          IsMixPay: 0,
          PaymentMethod: 2,
          Remark: '商品购买',
          Token: this.$store.state.UserToken,
          type: 1,
          relationId: this.$route.query.id,
          openId: window.sessionStorage.getItem('MainOpenId'),
          // eslint-disable-next-line
          IsWeChatBrowser: navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'
        }
        this.$http({
          url: apiport.WeiXin_GetJsApiParam,
          method: 'post',
          data: qs.stringify({ reqJson: JSON.stringify(model) })
        })
          .then(res => {
            console.log('获取微信的参数appid等', res)
            if (model.IsWeChatBrowser) {
              _that.callpay(JSON.parse(res.data.jsApiParamJson), res.data.payDetailId, _that.sucFun, _that.errFun)
            } else {
              window.location.href = res.data.jsApiParamJson + '&redirect_url=' + encodeURIComponent('https%3a%2f%2ft-mweb.95laibei.com%2f/Pay/GoodsPay?id=' + model.relationId + '&paydetailId=' + res.data.payDetailId + '&paymentmethod=6')
            }
          })
          .catch(error => {
            console.log(2)
            console.log(error)
          })
      }
    },
    callpay (wxJsApiParam, payDetailId, sucFun, errFun) {
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.jsApiCall)
          document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall)
        }
      } else {
        this.jsApiCall(wxJsApiParam, payDetailId, sucFun, errFun)
      }
    },
    jsApiCall (wxJsApiParam, payDetailId, sucFun, errFun) {
      // eslint-disable-next-line
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        wxJsApiParam, // json串
        function (res) {
          alert(JSON.stringify(res))
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            sucFun(payDetailId)
          } else {
            errFun()
          }
        }
      )
    },
    sucFun () {
      alert('支付成功')
      this.$router.push('/My/ZulinBuyIn')
    },
    errFun () {
      alert('支付失败')
    },
    payselect (i) {
      if (i === 0) {
        document.getElementById('zfbOrderPaySelect').setAttribute('class', 'selectpays selected')
        document.getElementById('wxOrderPaySelect').setAttribute('class', 'selectpays')
        document.getElementById('zfbPricePartOrderPay').style.display = 'inline'
        document.getElementById('wxPricePartOrderPay').style.display = 'none'
      } else if (i === 1) {
        document.getElementById('zfbOrderPaySelect').setAttribute('class', 'selectpays')
        document.getElementById('wxOrderPaySelect').setAttribute('class', 'selectpays selected')
        document.getElementById('zfbPricePartOrderPay').style.display = 'none'
        document.getElementById('wxPricePartOrderPay').style.display = 'inline'
      }
    },
    Alipayform (slt) {
      let result = '<form id="alipaysubmit" name="alipaysubmit" action="' + slt.action + '" method="get">'
      result += ' <input type="hidden" name="_input_charset" value="' + slt._input_charset + '"/>'
      result += ' <input type="hidden" name="body" value="' + slt.body + '"/>'
      result += ' <input type="hidden" name="notify_url" value="' + slt.notify_url + '"/>'
      result += ' <input type="hidden" name="out_trade_no" value="' + slt.out_trade_no + '"/>'
      result += ' <input type="hidden" name="partner" value="' + slt.partner + '"/>'
      result += ' <input type="hidden" name="payment_type" value="' + slt.payment_type + '"/>'
      result += ' <input type="hidden" name="return_url" value="' + slt.return_url + '"/>'
      result += ' <input type="hidden" name="seller_id" value="' + slt.seller_id + '"/>'
      result += ' <input type="hidden" name="service" value="' + slt.service + '"/>'
      result += ' <input type="hidden" name="show_url" value="' + slt.show_url + '"/>'
      result += ' <input type="hidden" name="subject" value="' + slt.subject + '"/>'
      result += ' <input type="hidden" name="total_fee" value="' + slt.total_fee + '"/>'
      result += ' <input type="hidden" name="sign" value="' + slt.sign + '"/>'
      result += ' <input type="hidden" name="sign_type" value="' + slt.sign_type + '"/>'
      result += ' <input type="submit" value="确认" style="display:none" /></form>'
      return result
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
  font-size: 16px;
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
