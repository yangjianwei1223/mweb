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
            <input type="valid" v-model="valid" data-role="none" name="" value="" placeholder="请输入验证码">
            <button id="OrderPaySendVerifyCode" data-id="0" v-bind:class="{'getvalidcodebtn':true,regetvalidcodebtn:!isValid}" :disabled="!isValid" @click="sendValidCode(0)">获取验证码</button>
          </p>
        </div>
        <p class="get-voice-validate get">收不到短信？使用<span data-id="1" class="SendTTSValidCode" @click="sendValidCode(1)">语音验证码</span></p>
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
import weiXinHelper from "../../util/Global_WeiXinHelper"; 
import alipayHelper from "../../util/Global_AlipayHelper"; 
import zmxyHelper from "../../util/Global_ZMXYHelper"; 
import baseInfoHelper from "../../util/Global_BaseInfoHelper"; 
import validCodeHelper from "../../util/Global_ValidCodeHelper"; 

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
      orderId:'',
      paydetailId:'',
      payTotalHtml:'',
      isCheckTimesCardSelect:true,
      isCheckOrderPayPoint:true,
      IsLocalOrder:false,//是否为本地母婴
      valid: "",
      tel:"",
      isValid:true

    };
  },
  mounted: function() {
     let _that = this 
     baseInfoHelper.GetLoginInfo().then(function (res) {
        var loginResult = res;
        if (loginResult == null) {
            var returnUrl = apiport.CurrentDomain + "/Pay/GoodsPay?id=" +this.$route.query.id +"&paydetailId="+this.$route.query.paydetailId;
            var url = "/Index/Account?ReturnUrl=" + returnUrl;
             this.$router.push(url);
        }
        else {
         _that.tel=loginResult.Mobile;
        }
     })
      
        
    this.paydetailId= this.$route.query.paydetailId==undefined?'':this.$route.query.paydetailId;
    this.orderId=this.$route.query.id;
  
    // eslint-disable-next-line
    this.isWx =weiXinHelper.IsWXBrowser();
    this.isZfb =zmxyHelper.IsAlipayBrowser();

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
        _that.paydata = data;
        _that.isZMXYOrder = data.IsZMXYOrder;
        _that.OrderType = data.OrderType;
        _that.PointsUsable = data.PointsUsable;
        _that.PointsQuantity = data.PointsQuantity;
        _that.thirdPayPoint = Number(
          data.PointsQuantity - data.PointsUsable
        ).toFixed(2);
        _that.isShowSeatTip = data.SeatNoPointPay;
        _that.goodsPrice = data.GoodsPrice;
        _that.pointsUsable = data.PointsUsable;
        _that.IsLocalOrder=data.IsLocalOrder;

        //参数校验
         if (!!data.IsLocalOrder) {
            _that.returnUrl = "/Local/OrderDetail/" + data.OrderBaseId;
         }else if (!!data.IsRecharge) {
             _that.returnUrl = "/Activitys/FreeSeatApply"
          }
          else {
            _that.returnUrl = "/Order/" + (data.OrderType == 1 ? "BuyDetail" : "ZulinDetail") + "/" + data.OrderBaseId;
         }

        if (data.HasPaySuccess && !data.HasOrderNotPay && _that.paydetailId == "") {
                alert('订单已支付')
                 this.$router.push(_that.returnUrl)
                return;
            }
             if (data.HasPaySuccess && data.HasOrderNotPay) {
                alert('订单状态不一致')
                this.$router.push(_that.returnUrl)
                return;
            }
            if (data.PinTuanStatus == 1) {
                alert('订单状态不一致')
                this.$router.push(_that.returnUrl)
                return;
            }
            _that.goodsPrice=data.GoodsPrice;
            _that.pointsUsable=data.PointsUsable;
            _that.PointsQuantity= (Number(data.PointsQuantity)).toFixed(2);
          
            if (data.SharedWithPoint == false) {
                 data.PointsUsable = 0;// 使用优惠券且不可以与贝壳同时使用，将余额设置成0 
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
               _that.isCheckTimesCardSelect=false;
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
              _that.isCheckOrderPayPoint=false;//取消贝壳支付选中
            }
            if (data.PointsUsable == 0 && !data.HasTimesCard) {
                //不可以使用贝壳和次卡的时候隐藏验证法发送
               /* $("#OrderPaySendVerifyCode").attr("disabled", "disabled").addClass("regetvalidcodebtn");
                $("#OrderPaySendVerifyCode").parents(".sectc").css("opacity", ".7");
                $(".accountline").remove();
                $(".get-voice-validate").hide();*/
                this.isValid=false;
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

           if (_that.paydetailId != "") {
                //需要现金支付时处理支付宝和微信网页支付问题
                if (!_that.isWx&& !_that.isZfb &&
                   !_that.isApp) {
                    _that.paying=true
                    _that.setIntervalObj = setInterval(_that.AutoCheckPayState, 3000);
                } else {
                   let param = {
                        PayDetailId:_that.paydetailId,
                       // Token: this.$store.state.UserToken,
                        ParentOrderId:this.$route.query.id
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
                                         this.isCheckTimesCardSelect=true;
                                          TimesCardPayPrice =  this.paydata.GoodsPrice;
                                          OrderPayTotalPoint += '<i class="iconfont">&#xe62e;</i>' + TimesCardPayPrice + ' +';
                                      }
                                      if (payDetail.HasPointPay) {
                                          OrderPayTotalPoint += payDetail.HasTimesCardPay ? ' ' : '';
                                         this.isCheckOrderPayPoint=true;
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
      let para={
        ParentOrderId:this.$route.query.id,
        Token: this.$store.state.UserToken
      };
        this.$http({ url: apiport.Order_GetPayState,
                     method: "post",
                    data: qs.stringify({ reqJson: JSON.stringify(para) })
                      }).then( res=>{
                           var slt=res.data;
                          if (slt != null && slt.ResultNo == "00000000") {
                                          if (slt.PayState > 0) {
                                              alert('支付成功');
                                              if (this.setIntervalObj != null) {
                                                  clearInterval(this.setIntervalObj);
                                              }
                                             this.CashPaySucess();
                                             this.paying=false;
                                          }
                                      }

                      });
    },
    CashPaySucess(paydetailId){
       //  alert(this.orderId);
        alert('支付成功')
     //   return;
      // Global_StorageHelper.DelSessionByKey("validCodeCache31");
        if (this.paydata.IsPinTuan) {
            this.$router.push(apiport.CurrentDomain + "/PinTuan/OrderDetail?code=" + this.paydata.PinTuanCode);
        }
         else if (this.paydata.IsRecharge) {
            this.$router.push(apiport.CurrentDomain + '/Activitys/FreeSeatApply');
        }
        else if (this.paydata.IsLocalOrder) {
            this.$router.push(apiport.CurrentDomain + "/Local/PaySuccess/" + this.orderId.replace("local", ""));
        }
        else {
            this.$router.push(apiport.CurrentDomain + "/Order/PaySucess/" + this.orderId);
        }
    },
    CashPayErr(){
      alert('支付遇到阻碍')
    },
    confirmpay() {
        try {
                if (this.checkPayType=="zhima") {
                    if (!this.isZfb) {
                        alert('该订单为芝麻信用订单,请在支付宝中完成付款操作');
                        return;
                    }
                }
              var valid =this.valid;
                var thirdPayPoint = 0;
                if ( this.isCheckTimesCardSelect || this.isCheckOrderPayPoint) {
                    if (valid == "") {
                        alert('验证码不能为空');
                        return false;
                    }
                    else if (valid.length != 4) {
                        alert('验证码位数错误');
                        return false;
                    }
                }
                var TimesCardPayPrice = 0;//次卡支付金额
                var PayPoints=0;
                if (this.isCheckTimesCardSelect) {
                    TimesCardPayPrice = this.paydata.GoodsPrice;
                }
                if (this.isCheckOrderPayPoint) {
                    if (this.paydata.PointsUsable < (this.paydata.PointsQuantity - TimesCardPayPrice)) {
                        PayPoints = this.paydata.PointsUsable;
                    }
                    else {
                        PayPoints =  this.paydata.PointsQuantity - TimesCardPayPrice;
                    }
                }
                thirdPayPoint =  this.paydata.PointsQuantity - TimesCardPayPrice - PayPoints;
                if (thirdPayPoint > 0) {
                    //现金支付或混合支付
                   // PayCash = (Number(thirdPayPoint)).toFixed(2);
                    this.CashPay(PayPoints);
                }
                else {
                    //不需要现金支付
                    var model={
                      ValidCode:valid,
                      ParentOrderId:this.$route.query.id,
                      PointPay: PayPoints > 0,
                      TimesCardPay: TimesCardPayPrice > 0,
                      Token:Token
                    }
                    this.PointPay(model);
                }
            } catch (err) {
                //SetErrSession(err);
            }
    },
    CashPay(PayPoints){
        //第三方支付验证
        var IsMixPay = 0;
        var hasPointPay = false;
         var hasTimesCardPay = false;
        if (!!this.isCheckTimesCardSelect) {
            hasTimesCardPay = true;
        }
        if (!!this.isCheckOrderPayPoint) {
            hasPointPay = true;
        }
        if (hasPointPay || hasTimesCardPay) {
            //混合支付
            IsMixPay = 1;
        }
        var OrderId=this.$route.query.id;
        let chkmodel = {
            ValidCode: this.valid,
            ParentOrderId: this.$route.query.id,
            PayPoints: PayPoints,
            IsMixPay:IsMixPay,
            hasPointPay: hasPointPay,
            hasTimesCardPay: hasTimesCardPay,
            Token: this.$store.state.UserToken
          };
          this.$http({
            url: apiport.Order_CheckPayment,
            method: "post",
            data: qs.stringify({ reqJson: JSON.stringify(chkmodel) })
        })
        .then(res=>{
                var data=res.data;
                if (typeof (data.ResultNo) != "undefined" && data.ResultNo == "00000000") {
                    //对接第三方支付
                    if (this.checkPayType == "zfb") {
                        //支付宝支付
                        var return_url = apiport.CurrentDomain + '/Pay/GoodsPay?id=' + OrderId;
                        alipayHelper.Pay(IsMixPay, hasPointPay, hasTimesCardPay, "商品购买", return_url, 1, OrderId, this.CashPaySucess, this.CashPayErr);
                    }
                    else if (this.checkPayType='wx') {
                        if (weiXinHelper.IsWXSmallProgram()) {
                            //启用自动刷新方法操作
                            this.paying=true;
                            this.setIntervalObj = setInterval(this.AutoCheckPayState, 3000);
                        }
                        //微信支付
                       weiXinHelper.Pay(IsMixPay, hasPointPay, hasTimesCardPay, "商品购买", 1, OrderId, this.CashPaySucess, this.CashPayErr);
                    }
                    else if (this.checkPayType='zhima') {
                        //芝麻信用借还
                        if (this.IsLocalOrder) {
                            alert("本地母婴不支持芝麻信用借还");
                       }
                        else {
                            zmxyHelper.Pay(OrderId, this.CashPaySucess, this.CashPayErr);
                        }
                    }
                    else if (this.checkPayType='bankcard') {
                        //银行卡
                        alert("支付宝支付未做");
                    }
                }
                else if (typeof (data.ResultRemark) != "undefined") {
                   alert('支付失败');
                }
                else {
                      alert('支付失败');
                }


        });
    
    },
    PointPay(model){
         // Global_CommonHelper.ConfirmLoadingShow();
         let _that=this;
          this.$http({
            url: apiport.Order_Pay,
            method: "post",
            data: qs.stringify({ reqJson: JSON.stringify(model) })
        })
        .then(res=>{
                   var data=res.data;
                    if (typeof (data.ResultNo) != "undefined" && data.ResultNo == "00000000") {
                            //  Global_StorageHelper.DelSessionByKey("validCodeCache31");
                              if (this.paydata.IsPinTuan) { 
                                 window.location= apiport.CurrentDomain + "/PinTuan/OrderDetail?code=" + _that.paydata.PinTuanCode;
                              }
                              else if (this.paydata.IsLocalOrder) {
                                  window.location=apiport.CurrentDomain + "/Local/PaySuccess/" + _that.orderId.replace("local", "");
                              }
                              else {
                                   window.location=apiport.CurrentDomain + "/Order/PaySucess/" + _that.orderId;
                              }
                          }
                          else if (typeof (data.ResultRemark) != "undefined") {
                              if (data.ResultNo != "10010033") {
                                  //订单状态修改不提示信息
                                  alert('对不起，支付失败：'+data.ResultRemark)
                              }
                          }
                          else {
                            alert('对不起，支付失败')
                          }
                //Global_CommonHelper.ConfirmLoadingHide();
        }).catch(error => {
          alert('对不起，支付失败')
                  console.log(2);
                  console.log(error);
                });
        
    },
    sucFun(payDetailId) {
      this.$router.push("/Order/PaySucess/" + this.$route.query.id);
    },
    errFun() {
      alert("支付失败");
    },
    sendValidCode(dataid){
       validCodeHelper.GetValidCode(31,this.tel, "OrderPaySendVerifyCode", dataid);
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
             this.thirdPayPoint=thirdPayPrice;
        }
      
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
/*支付页面添加正在支付的提示*/
.payingtips{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(122,122,122,0.5);
    z-index: 1000;
}
.payingtips .pcontent{
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    background: #fff;
    width: 5.5rem;
    text-align: center;
    padding: .45rem 0;
    border-radius: 10px;
    box-sizing: content-box;
}
.payingtips .pcontent img{
    display:block;
    width:2.11rem;
    margin: 0 auto;
}
.payingtips .pcontent p{
    margin-top: .1rem;
    font-size: 11px;
    color: #666;
}
.payingtips .pcontent span{
    color: #E62327;
    font-size: 12px;
}

</style>
