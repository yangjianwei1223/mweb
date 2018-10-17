<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section v-if="paydata.HasTimesCard" class="sectc padtop">
      <div class="title">使用次卡支付</div>
      <div class="content">
          <div class="line borderbottom">
              <label id="TimesCardSelect"  v-bind:class="{unselectpoint:!isCheckTimesCardSelect,selectpoint:isCheckTimesCardSelect}" @click="payselect(2)"></label>次卡支付 :
              <span class="price"><span id="TimesCardPrice">{{goodsPrice}}<span class="gstotal">(¥ {{goodsPrice}})</span></span></span>
          </div>
      </div>
    </section>
    <section class="sectc" :class="{padtop: !paydata.HasTimesCard}">
      <div class="title">使用贝壳支付</div>
      <div class="content">
        <div class="line borderbottom">
          <label id="OrderPayPointSelect"  v-bind:class="{unselectpoint:!isCheckOrderPayPoint,selectpoint:isCheckOrderPayPoint}" @click="payselect(3)"></label>贝壳支付 :
          <span class="price">{{pointsUsable}}<span class="gstotal">(¥ {{pointsUsable}})</span></span>
          <span id="SeatNoPointPayRemark" v-if="isShowSeatTip">* 安全座椅不可使用</span>
        </div>
      </div>
    </section>
    <section class="sectc">
      <div class="content">
        <div class="line">
          <p class="validcodep">
            <input type="hidden" id="OrderPayTel" value="15271947990">
            <input type="tel" id="OrderPayValidCode" oninput="Global_CommonHelper.CheckOnlyNumber(this, 4)" data-role="none" name="" value="" placeholder="请输入验证码">
            <button id="OrderPaySendVerifyCode" data-id="0" data-role="none" class="getvalidcodebtn SendValidCode">获取验证码</button>
          </p>
        </div>
        <p class="get-voice-validate get">收不到短信？使用<span data-id="1" class="SendTTSValidCode SendValidCode">语音验证码</span></p>
      </div>
    </section>
    <section class="sectc">
      <div class="title">使用第三方支付</div>
      <div class="pf">
          <div class="rpay OrderPaySelect" id="zfbPay" v-if="!isWx" @click="payselect(0)">
              <label id="zfbOrderPaySelect"  v-bind:class="[selectpays,{selected:checkPayType=='zfb'}]" ></label>
              <i class="iconfont zfbicon">&#xe619;</i> 支付宝支付
              <span id="zfbPricePartOrderPay" class="cprice" v-bind:style="{display:(checkPayType=='zfb'?'inline':'none')}"
              v-html="checkPayType=='zfb'?('&yen; '+thirdPayPoint):''"></span>
          </div>
          <div class="rpay OrderPaySelect" id="wxPay" v-if="!isZfb" @click="payselect(1)">
              <label id="wxOrderPaySelect"  v-bind:class="[selectpays,{selected:checkPayType=='wx'}]"></label>
              <i class="iconfont wxicon">&#xe615;</i> 微信支付
              <span id="wxPricePartOrderPay" class="cprice"  v-bind:style="{display:(checkPayType=='wx'?'inline':'none')}"
               v-html="checkPayType=='wx'?('&yen; '+thirdPayPoint):''"></span>
          </div>
          <div class="rpay OrderPaySelect" id="zmxyPay" v-if="isZfb && isZMXYOrder && OrderType === 2" @click="payselect(4)">
              <label id="zmxyOrderPaySelect"  v-bind:class="[selectpays,{selected:checkPayType=='zhima'}]"></label>
              <i class="alipayicon"></i> 芝麻信用借还
              <span id="zmxyPayPricePartOrderPay" class="cprice" v-html="checkPayType=='zhima'?('&yen; '+thirdPayPoint):''"></span>
          </div>
        </div>
    </section>
    <section class="secsl">
      <div class="paytotal">支付总额：<span class="price"><span id="OrderPayGoodsPay">¥ {{PointsQuantity}}</span></span>
      <span id="OrderPayTotalPoint" class="gstotal" v-html="payTotalHtml">
        </span></div>
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
/* eslint-disable */
import qs from "qs";
import apiport from "../../util/api";
import head from "@/components/common/header";
export default {
  name: "goodspay",
  components: {
    vHeader: head
  },
  data() {
    return {
      headinfo: { title: "交易支付" },
      selectpays:'selectpays',
      paydata: [],
      paying: false,
      OrderType: 1,
      PointsUsable: 0,
      PointsQuantity: 0,
      thirdPayPoint: 0,
      isWx: false,
      isZfb: false,
      isZMXYOrder: false,
      isApp:false,
      checkPayType:-1,
      goodsPrice: 0.0,
      isShowSeatTip: false,
      pointsUsable: 0,
      returnUrl:'',
      setIntervalObj:0,
      orderId:0,
      paydetailId:0,
      payTotalHtml:'',
      isCheckTimesCardSelect:true,
      isCheckOrderPayPoint:true

    };
  },
  mounted: function() {
    let _that = this
    // eslint-disable-next-line
    this.isWx =
      navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
      "micromessenger";
    this.isZfb =
      navigator.userAgent.toLowerCase().indexOf("alipayclient") !== -1;
    if (this.isWx) {
      this.payselect(1);
    } else if (this.isZfb) {
      this.payselect(0);
    }
    let model = {
      ParentOrderId: this.$route.query.id,
      Token: this.$store.state.UserToken
    };
    this.$http({
      url: apiport.Order_GetPayDetailById,
      method: "post",
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log("订单支付信息", res.data);
         let data = res.data;
      if (data != null && data.ResultNo == "00000000") {
        this.paydata = data;
        this.isZMXYOrder = data.IsZMXYOrder;
        this.OrderType = data.OrderType;
        this.PointsUsable = data.PointsUsable;
        this.PointsQuantity = data.PointsQuantity;
        this.thirdPayPoint = Number(
          data.PointsQuantity - data.PointsUsable
        ).toFixed(2);
        this.isShowSeatTip = data.SeatNoPointPay;
        this.goodsPrice = data.GoodsPrice;
        this.pointsUsable = data.PointsUsable;
        //参数校验
         if (!!data.IsLocalOrder) {
            this.returnUrl = "/Local/OrderDetail/" + data.OrderBaseId;
         } else {
                this.returnUrl = "/Order/" + (data.OrderType == 1 ? "BuyDetail" : "ZulinDetail") + "/" + data.OrderBaseId;
         }

        if (data.HasPaySuccess && !data.HasOrderNotPay && paydetailId == "") {
                alert('订单已支付')
                return;
            }
             if (data.HasPaySuccess && data.HasOrderNotPay) {
                alert('订单状态不一致')
                return;
            }
            if (data.PinTuanStatus == 1) {
                alert('订单状态不一致')
                return;
            }
            _that.goodsPrice=data.GoodsPrice;
            _that.pointsUsable=data.PointsUsable;
            _that.PointsQuantity= (Number(data.PointsQuantity)).toFixed(2);
          
            if (data.OrderType == 2 || data.SharedWithPoint == false) {
                  data.PointsUsable = 0;//租赁订单不能使用贝壳支付 或者 使用优惠券且不可以与贝壳同时使用，将余额设置成0 
            }
            var OrderPayTotalPoint = "(";
            if (!!data.HasTimesCard) {
                //可以使用次卡支付
                if (data.GoodsPrice < data.PointsQuantity) {
                    OrderPayTotalPoint += '<i class="iconfont">&#xe62e;</i>' + data.GoodsPrice + ' +';
                }
                else {
                    OrderPayTotalPoint += '<i class="iconfont">&#xe62e;</i>' + data.GoodsPrice;
                }
            }else
            {
               data.GoodsPrice = 0;
               this.isCheckTimesCardSelect=false;
            }
            if (data.PointsUsable > 0 && (data.PointsQuantity - data.GoodsPrice) > 0) {
                //使用贝壳支付
                if (data.PointsUsable < (data.PointsQuantity - data.GoodsPrice)) {
                    OrderPayTotalPoint += '<i class="shellgrey"></i>' + data.PointsUsable + ' +';
                }
                else {
                    OrderPayTotalPoint += '<i class="shellgrey"></i>' + (data.PointsQuantity - data.GoodsPrice).toFixed(2);
                }
            }
            else {
              this.isCheckOrderPayPoint=false;//取消贝壳支付选中
            }
            if (data.PointsUsable == 0 && !data.HasTimesCard) {
                //不可以使用贝壳和次卡的时候隐藏验证法发送
               /* $("#OrderPaySendVerifyCode").attr("disabled", "disabled").addClass("regetvalidcodebtn");
                $("#OrderPaySendVerifyCode").parents(".sectc").css("opacity", ".7");
                $(".accountline").remove();
                $(".get-voice-validate").hide();*/
            }

             //判断是否需要第三方支付
            if ((data.PointsUsable + data.GoodsPrice) < data.PointsQuantity) {
                var thirdPayPoint = data.PointsQuantity - data.PointsUsable - data.GoodsPrice;
                var thirdPayPrice = (Number(thirdPayPoint)).toFixed(2);
               this.thirdPayPoint=thirdPayPrice;
                if (!this.isWx) {
                 this.checkPayType='zfb';
                }
                else {
                  this.checkPayType='wx';
                }
                OrderPayTotalPoint += ' &yen; ' + thirdPayPrice;
            }
            OrderPayTotalPoint += " )";
            this.payTotalHtml=OrderPayTotalPoint;

           if (paydetailId != "") {
                //需要现金支付时处理支付宝和微信网页支付问题
                if (!isWx&& !isZfb &&
                   !isApp) {
                    this.paydata.paying=true
                    this.setIntervalObj = setInterval(this.AutoCheckPayState, 3000);
                } else {
                   let param = {
                        PayDetailId: this.$route.query.paydetailid,
                       // Token: this.$store.state.UserToken,
                        ParentOrderId:his.$route.query.id
                      };
                  this.$http({
                        url: apiport.Points_GetCommonPayById,
                        method: "post",
                        header: {
                          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                        },
                        data: qs.stringify({ reqJson: JSON.stringify(param) })
                      }).then(py=>{
                              var payDetail =py;
                              var CashPayStatus = false;
                              if (payDetail != null && payDetail.ResultNo == "00000000") {
                                  if (payDetail.Status == 1) {
                                      CashPayStatus = true;
                                  }
                                  PayCash = payDetail.Amount;
                                  var thirdPayPoint = PayCash;
                                  var thirdPayPrice = (Number(thirdPayPoint)).toFixed(2);
                                  var OrderPayTotalPoint = "";
                                  if (PayCash < this.paydata.PointsQuantity) {
                                      var TimesCardPayPrice = 0;
                                      PayPoints = 0;
                                      OrderPayTotalPoint += '(';
                                      if (payDetail.HasTimesCardPay) {
                                         document.getElementById("TimesCardSelect").setAttribute("class", "selectpoint");
                                          TimesCardPayPrice =  this.paydata.GoodsPrice;
                                          OrderPayTotalPoint += '<i class="iconfont">&#xe62e;</i>' + TimesCardPayPrice + ' +';
                                      }
                                      if (payDetail.HasPointPay) {
                                          OrderPayTotalPoint += payDetail.HasTimesCardPay ? ' ' : '';
                                          document.getElementById("OrderPayPointSelect").setAttribute("class", "selectpoint");
                                          PayPoints = this.paydata.PointsQuantity - TimesCardPayPrice - thirdPayPoint;
                                          OrderPayTotalPoint += '<i class="shellgrey"></i>' + PayPoints.toFixed(2) + ' +';
                                      }
                                      OrderPayTotalPoint += ' &yen; ' + thirdPayPrice;
                                      OrderPayTotalPoint += " )";
                                  }
                                  else {
                                      PayPoints = 0;
                                      this.isCheckTimesCardSelect=false;
                                      this.isCheckOrderPayPoint=false;
                                     // $("#OrderPaySendVerifyCode").attr("disabled", "disabled").addClass("regetvalidcodebtn");
                                     // $("#OrderPaySendVerifyCode").parents(".sectc").css("opacity", ".7");
                                     // $(".get-voice-validate").hide();
                                  }
                                  this.thirdPayPoint=thirdPayPrice;
                                  //消费方式 1支付宝,2微信公众号,3银联,4 App微信,5芝麻信用支付,6微信h5支付
                                  if (payDetail.PaymentMethod == 1) {
                                    this.checkPayType='zfb';
                                  }
                                  else {
                                     this.checkPayType='wx';
                                  }
                                 this.payTotalHtml=OrderPayTotalPoint;
                              }
                              if (CashPayStatus) {
                                  this.CashPaySucess(paydetailId);
                              }
                              else {
                                  this.CashPayErr();
                              }
                      });
                    
                }
            }

         }else
         {
           var ResultRemark = "信息获取错误";
            if (data != null) {
                ResultRemark = data.ResultRemark;
            }
            /*Global_PopupHelper.alert({
                'title': ResultRemark,
                'confirmCallback': function () { TemplateHelper.changePage(Global_ServiceUrlHelper.CurrentDomain + "/My/BuyIn"); }
            });*/
            alert(ResultRemark);
         }
      })
      .catch(error => {
        console.log(2);
        console.log(error);
      });
  },
  methods: {
    AutoCheckPayState(){
        this.$http({ url: apiport.Order_GetPayState,
                     method: "post",
                     header: {
                          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                        },
                        data:{reqJson: '{"ParentOrderId":"' + this.orderId + '","Token":"' +  this.$store.state.UserToken + '"}'}
                      }).then( slt=>{
                          if (slt != null && slt.ResultNo == "00000000") {
                                          if (slt.PayState > 0) {
                                              if (this.setIntervalObj != null) {
                                                  clearInterval(this.setIntervalObj);
                                              }
                                             this.CashPaySucess();
                                          }
                                      }

                      } );
    },
    CashPaySucess(paydetailId){
        alert('支付成功')
    },
    CashPayErr(){
      alert('支付遇到阻碍')
    },
    confirmpay() {
      let _that = this;
      // 支付前检测
      let chkmodel = {
        ValidCode: "undefined",
        ParentOrderId: this.$route.query.id,
        PayPoints: 0,
        IsMixPay: 0,
        hasPointPay: false,
        hasTimesCardPay: false,
        Token: this.$store.state.UserToken
      };
      this.$http({
        url: apiport.Order_CheckPayment,
        method: "post",
        data: qs.stringify({ reqJson: JSON.stringify(chkmodel) })
      })
        .then(res => {
          if (res.data.ResultNo === "00000000") {
            if (
              document
                .getElementsByClassName("selected")[0]
                .getAttribute("id") === "zfbOrderPaySelect"
            ) {
              // 支付宝支付
              let model = {
                IsMixPay: 0,
                PaymentMethod: 1,
                Remark: "商品购买",
                Token: this.$store.state.UserToken,
                showUrl:
                  document.location.origin +
                  "/Pay/GoodsPay?id=" +
                  this.$route.query.id,
                type: 1,
                relationId: this.$route.query.id,
                hasPointPay: false,
                hasTimesCardPay: false
              };
              this.$http({
                url: apiport.Alipay_Pay,
                method: "post",
                data: qs.stringify({ reqJson: JSON.stringify(model) })
              })
                .then(res => {
                  let result = this.Alipayform(JSON.parse(res.data.AlipayHtml));
                  document
                    .getElementsByTagName("body")[0]
                    .insertAdjacentHTML("afterBegin", result);
                  document.getElementById("alipaysubmit").submit();
                })
                .catch(error => {
                  console.log(error);
                });
            } else if (
              document
                .getElementsByClassName("selected")[0]
                .getAttribute("id") === "wxOrderPaySelect"
            ) {
              // 微信支付
              let model = {
                IsMixPay: 0,
                PaymentMethod: 2,
                Remark: "商品购买",
                Token: this.$store.state.UserToken,
                type: 1,
                relationId: this.$route.query.id,
                openId: JSON.parse(window.sessionStorage.getItem("MainOpenId")),
                // eslint-disable-next-line
                IsWeChatBrowser:
                  navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
                  "micromessenger",
                hasPointPay: false,
                hasTimesCardPay: false
              };
              this.$http({
                url: apiport.WeiXin_GetJsApiParam,
                method: "post",
                data: qs.stringify({ reqJson: JSON.stringify(model) })
              })
                .then(res => {
                  console.log("获取微信的参数appid等", res);
                  if (model.IsWeChatBrowser) {
                    _that.callpay(
                      JSON.parse(res.data.jsApiParamJson),
                      res.data.payDetailId,
                      _that.sucFun,
                      _that.errFun
                    );
                  } else {
                    window.location.href =
                      res.data.jsApiParamJson +
                      "&redirect_url=" +
                      encodeURIComponent(
                        "https%3a%2f%2ft-mweb.95laibei.com%2f/Pay/GoodsPay?id=" +
                          model.relationId +
                          "&paydetailId=" +
                          res.data.payDetailId +
                          "&paymentmethod=6"
                      );
                  }
                })
                .catch(error => {
                  console.log(2);
                  console.log(error);
                });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    callpay(wxJsApiParam, payDetailId, sucFun, errFun) {
      if (typeof WeixinJSBridge === "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            this.jsApiCall,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", this.jsApiCall);
          document.attachEvent("onWeixinJSBridgeReady", this.jsApiCall);
        }
      } else {
        this.jsApiCall(wxJsApiParam, payDetailId, sucFun, errFun);
      }
    },
    jsApiCall(wxJsApiParam, payDetailId, sucFun, errFun) {
      // eslint-disable-next-line
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        wxJsApiParam, // json串
        function(res) {
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            sucFun(payDetailId);
          } else {
            errFun();
          }
        }
      );
    },
    sucFun(payDetailId) {
      this.$router.push("/Order/PaySucess/" + this.$route.query.id);
    },
    errFun() {
      alert("支付失败");
    },
    payselect(i) {
      //支付bao 微信 芝麻信用 
      if (i === 0 || i === 1 || i === 4) {
        var PricePartOrderPayStr = "";
        if (this.goodsPrice >= this.paydata.PointsQuantity) {
          //取消次卡支付
          var thirdPayPoint = this.paydata.PointsQuantity;
          var thirdPayPrice = Number(thirdPayPoint).toFixed(2);
          this.thirdPayPoint=thirdPayPrice;
          this.payTotalHtml='';
         this.isCheckTimesCardSelect=false;
        }
        var TimesCardPayPrice = 0;
        //使用次卡支付
        if (this.isCheckTimesCardSelect) {
          TimesCardPayPrice = this.paydata.GoodsPrice;
        }
        if (
          this.paydata.PointsUsable >=
          this.paydata.PointsQuantity - TimesCardPayPrice
        ) {
          //取消贝壳支付
          var thirdPayPoint = this.paydata.PointsQuantity - TimesCardPayPrice;
          var thirdPayPrice = Number(thirdPayPoint).toFixed(2);
          PricePartOrderPayStr = "&yen; " + thirdPayPrice;
          var OrderPayTotalPoint = "";
          if (TimesCardPayPrice > 0) {
            OrderPayTotalPoint =
              '(<i class="iconfont">&#xe62e;</i>' + TimesCardPayPrice;
            OrderPayTotalPoint += " + &yen; " + thirdPayPrice + ")";
          }
         this.payTotalHtml=OrderPayTotalPoint;
           this.isCheckOrderPayPoint=false;
        }
        this.thirdPayPoint=thirdPayPrice;
        this.PointsQuantity=(Number(this.paydata.PointsQuantity)).toFixed(2)

      }
      //支付宝
      if (i === 0) {
        this.checkPayType='zfb';
      } //微信
      else if (i === 1) {
        this.checkPayType='wx';
      } //芝麻
      else if (i === 4) {
       this.checkPayType='zhima'
        this.PointsQuantity=0
      } //次卡支付
      else if (i === 2) {
        var TimesCardPayPrice = 0; //次卡支付金额
        var PayPoint = 0; //积分支付金额
        var thirdPayPrice = 0; //第三方支付金额
        var OrderPayTotalPoint = "(";//支付金额明细组合html
      
       // document.getElementById("wxPricePartOrderPay").innerHTML = "";
       // document.getElementById("zfbPricePartOrderPay").innerHTML = "";

        if (this.isCheckTimesCardSelect) {
          TimesCardPayPrice = 0;
         this.isCheckTimesCardSelect=false;
        } else {
          TimesCardPayPrice = this.paydata.GoodsPrice;
         this.isCheckTimesCardSelect=true;
         OrderPayTotalPoint += '<i class="iconfont">&#xe62e;</i>' +  this.paydata.GoodsPrice;
        }

        //使用次卡支付
        if (this.paydata.PointsQuantity - TimesCardPayPrice == 0) {
          //不需要支付现金或者贝壳
          this.isCheckOrderPayPoint=false;
          this.checkPayType='';
        } else {
          //使用贝壳支付
          if (this.isCheckOrderPayPoint) {
            if (
              this.paydata.PointsUsable <
              this.paydata.PointsQuantity - TimesCardPayPrice
            ) {
              PayPoint = this.paydata.PointsUsable;
            } else {
              PayPoint = this.paydata.PointsQuantity - TimesCardPayPrice;
            }
           OrderPayTotalPoint += TimesCardPayPrice > 0 ? ' + ' : ''
           OrderPayTotalPoint += '<i class="shellgrey"></i>' + PayPoint.toFixed(2)

            if (PayPoint + TimesCardPayPrice <= this.paydata.PointsQuantity) {
              this.checkPayType='';
            }
          }
          //使用第三方现金支付
          thirdPayPrice =
            this.paydata.PointsQuantity - PayPoint - TimesCardPayPrice;
          if (thirdPayPrice > 0) {
            if (TimesCardPayPrice > 0 || PayPoint > 0) {
              OrderPayTotalPoint += ' + &yen; ' + thirdPayPrice.toFixed(2);
            } else {
              OrderPayTotalPoint = '';
            }
            if (this.checkPayType!='zfb'&&this.checkPayType!='wx') {
              if (this.isWx) {
               this.checkPayType='wx';
              } else {
               this.checkPayType='zfb';
              }
            }
          } else {
           this.checkPayType='';
          }
    
        }

          OrderPayTotalPoint = !!OrderPayTotalPoint ? OrderPayTotalPoint += ')' : '';
          this.payTotalHtml=OrderPayTotalPoint;
          this.thirdPayPoint=thirdPayPrice.toFixed(2);
      }
      //贝壳支付
      else if (i === 3) {
        if (this.paydata.PointsUsable == 0) {
          return;
        }
        var OrderPayTotalPoint = "";
        var thirdPayPoint = 0;
        var thirdPayPrice = 0;
        var TimesCardPayPrice = 0;
        //document.getElementById("wxPricePartOrderPay").innerHTML = ""
        //document.getElementById("zfbPricePartOrderPay").innerHTML = ""
        //使用贝壳支付
        if (!this.isCheckOrderPayPoint) {
          //选择贝壳支付
          if (this.goodsPrice >= this.paydata.PointsQuantity) {
            //取消次卡支付
            this.isCheckTimesCardSelect=false;
             OrderPayTotalPoint = '(<i class="shellgrey"></i>' + slt.PointsUsable + ' )';
          }
        
          if (this.isCheckTimesCardSelect) {
            TimesCardPayPrice = this.paydata.GoodsPrice;
          }
          if (
            this.paydata.PointsUsable <
            this.paydata.PointsQuantity - TimesCardPayPrice
          ) {
            thirdPayPoint =
              this.paydata.PointsQuantity -
              this.paydata.PointsUsable -
              TimesCardPayPrice;
            if (thirdPayPoint > 0) {
              thirdPayPrice = Number(thirdPayPoint).toFixed(2);
               PricePartOrderPayStr = '&yen; ' + thirdPayPrice;
              if (TimesCardPayPrice > 0) {
                OrderPayTotalPoint = '(<i class="iconfont">&#xe62e;</i>' + TimesCardPayPrice + ' + <i class="shellgrey"></i>' + this.paydata.PointsUsable + ' + &yen; ' + thirdPayPrice + ' )';
              } else {
                 OrderPayTotalPoint = '(<i class="shellgrey"></i>' + this.paydata.PointsUsable + ' + &yen; ' + thirdPayPrice + ' )';
              }
            } else {
              if (TimesCardPayPrice > 0) {
                  OrderPayTotalPoint = '(<i class="iconfont">&#xe62e;</i>' + TimesCardPayPrice + ' + <i class="shellgrey"></i>' + this.paydata.PointsUsable + ' )';
              } else {
                 OrderPayTotalPoint = '(<i class="shellgrey"></i>' + this.paydata.PointsUsable + ' )';
              }
              this.checkPayType="";
            }
          } else {
            thirdPayPoint = this.paydata.PointsQuantity - TimesCardPayPrice;
            thirdPayPrice = Number(thirdPayPoint).toFixed(2);
            PricePartOrderPayStr = '&yen; ' + thirdPayPrice;
            if (TimesCardPayPrice > 0) {
              OrderPayTotalPoint = '(<i class="iconfont">&#xe62e;</i>' + TimesCardPayPrice + ' + <i class="shellgrey"></i>' + thirdPayPrice + ' )';
            } else {
              OrderPayTotalPoint = '(<i class="shellgrey"></i>' + thirdPayPrice + ' )';
            }
           this.checkPayType="";
          }
          this.isCheckOrderPayPoint=true;
        } else {
          //取消贝壳支付
          if (this.isCheckTimesCardSelect) {
            TimesCardPayPrice = this.goodsPrice;
          }
          thirdPayPoint = this.paydata.PointsQuantity - TimesCardPayPrice;
          //第三方支付金额
          if (thirdPayPoint > 0) {
            thirdPayPrice = Number(thirdPayPoint).toFixed(2);
             PricePartOrderPayStr = '&yen; ' + thirdPayPrice;
            var OrderPayTotalPoint = "";
            if (TimesCardPayPrice > 0) {
                OrderPayTotalPoint = '(<i class="iconfont">&#xe62e;</i>' + TimesCardPayPrice;
               OrderPayTotalPoint += ' + &yen; ' + thirdPayPrice + ' )';
            }
            
            if (this.checkPayType!='wx'&&this.checkPayType!='zfb') {
              if (this.isWx) {
                this.checkPayType='wx';
              } else {
                this.checkPayType='zfb';
              }
            }
          } else {
            if (TimesCardPayPrice > 0) {
               OrderPayTotalPoint = '(<i class="iconfont">&#xe62e;</i>' + TimesCardPayPrice + ' )';
            }
          }
         this.isCheckOrderPayPoint=false;
        }
        this.payTotalHtml=OrderPayTotalPoint;
         this.thirdPayPoint=thirdPayPrice;
      }
    },
    Alipayform(slt) {
      let result =
        '<form id="alipaysubmit" name="alipaysubmit" action="' +
        slt.action +
        '" method="get">';
      result +=
        ' <input type="hidden" name="_input_charset" value="' +
        slt._input_charset +
        '"/>';
      result += ' <input type="hidden" name="body" value="' + slt.body + '"/>';
      result +=
        ' <input type="hidden" name="notify_url" value="' +
        slt.notify_url +
        '"/>';
      result +=
        ' <input type="hidden" name="out_trade_no" value="' +
        slt.out_trade_no +
        '"/>';
      result +=
        ' <input type="hidden" name="partner" value="' + slt.partner + '"/>';
      result +=
        ' <input type="hidden" name="payment_type" value="' +
        slt.payment_type +
        '"/>';
      result +=
        ' <input type="hidden" name="return_url" value="' +
        slt.return_url +
        '"/>';
      result +=
        ' <input type="hidden" name="seller_id" value="' +
        slt.seller_id +
        '"/>';
      result +=
        ' <input type="hidden" name="service" value="' + slt.service + '"/>';
      result +=
        ' <input type="hidden" name="show_url" value="' + slt.show_url + '"/>';
      result +=
        ' <input type="hidden" name="subject" value="' + slt.subject + '"/>';
      result +=
        ' <input type="hidden" name="total_fee" value="' +
        slt.total_fee +
        '"/>';
      result += ' <input type="hidden" name="sign" value="' + slt.sign + '"/>';
      result +=
        ' <input type="hidden" name="sign_type" value="' +
        slt.sign_type +
        '"/>';
      result +=
        ' <input type="submit" value="确认" style="display:none" /></form>';
      return result;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.padtop {
  padding-top: 1rem;
}
.sectc {
  box-shadow: 0 -1px 1px #ebebec, 0 1px 1px #ebebec;
  background-color: #fff;
  font-size: 16px;
  .title {
    line-height: 0.8rem;
    background-color: #fff;
    padding-left: 0.2rem;
    font-size: 15px;
  }
  .line {
    font-size: 16px;
    margin-left: 0.2rem;
    line-height: 0.4rem;
    padding-bottom: 0.2rem;
    .unselectpoint {
      display: inline-block;
      width: 0.6rem;
      height: 0.8rem;
      background: url(https://cdn.sys.img.95laibei.com/Content/Images/rectunchecked.png)
        no-repeat 0 center;
      background-size: 16px;
      font-size: 0;
      vertical-align: middle;
    }
    .selectpoint {
      display: inline-block;
      width: 0.6rem;
      height: 0.8rem;
      background: url(http://cdn.sys.img.95laibei.com/Content/Images/rectselect_1.png)
        no-repeat 0 center;
      background-size: 16px;
      font-size: 0;
      vertical-align: middle;
    }
    #SeatNoPointPayRemark {
      display: block;
      color: #ff9c00;
      font-size: 13px;
    }
    .price {
      color: @base-ycolor3;
      .gstotal {
        color: @base-ycolor4;
      }
    }
    .validcodep {
      position: relative;
      overflow: hidden;
      padding-right: 3rem;
      input {
        -webkit-appearance: none;
        outline: none;
        border: none;
        line-height: 0.5rem;
        padding: 0.25rem 0;
        width: 100%;
        color: #3e3a39;
      }
      .getvalidcodebtn {
        position: absolute;
        top: 0.15rem;
        right: 0.25rem;
        padding: 0.1rem 0.2rem;
        background-color: transparent;
        border: 1px solid #f1bc19;
        color: #f1bc19;
        border-radius: 4px;
        line-height: 0.4rem;
        outline: 0;
      }
    }
  }
  .get-voice-validate {
    font-size: 12px;
    text-align: right;
    margin-top: 0;
    margin-right: 0.2rem;
    &.get {
      padding-bottom: 0.2rem;
    }
    span {
      color: @base-ycolor3;
    }
  }
  .pf {
    padding-left: 0.2rem;
    .rpay {
      background-color: #fff;
      line-height: 0.8rem;
      border-bottom: 1px solid #ededed;
      .alipayicon {
        display: inline-block;
        width: 22px;
        height: 22px;
        background: url(https://cdn.sys.img.95laibei.com/Content/Images/alipay.png)
          no-repeat;
        background-size: 20px;
        vertical-align: middle;
      }
    }
    .selectpays {
      display: inline-block;
      width: 0.6rem;
      height: 0.8rem;
      background: url(http://cdn.sys.img.95laibei.com/Content/Images/circleunselect.png)
        no-repeat 0 center;
      background-size: 16px;
      font-size: 0;
      vertical-align: middle;
      padding-bottom: 3px;
      &.selected {
        background: url(http://cdn.sys.img.95laibei.com/Content/Images/circleselect_1.png)
          no-repeat 0 center;
        background-size: 16px;
      }
    }
    .zfbicon {
      font-size: 22px;
      color: #00abef;
      vertical-align: bottom;
    }
    .wxicon {
      font-size: 18px;
      margin: 0 2px;
      color: #4fb640;
      vertical-align: bottom;
    }
    .cprice {
      float: right;
      margin-right: 0.2rem;
      color: @base-ycolor3;
    }
  }
}
.secsl {
  margin: 0.2rem 0;
  background-color: #fff;
  line-height: 0.8rem;
  text-align: right;
  padding-right: 0.2rem;
  .price {
    font-size: 16px;
    color: @base-ycolor3;
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
