import qs from 'qs'
import ApicloudHelper from './Global_ApicloudHelper'
import BaseInfoHelper from './Global_BaseInfoHelper'
import apiport from './api'
import wx from 'weixin-js-sdk'
import http from './http.js'

/* eslint-disable */
function IsWXBrowser () {
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    }
    else {
        return false;
    }
}

function IsWXSmallProgram()
{  
    if (window.__wxjs_environment === 'miniprogram') {
        return true;
    } else {
        return false;
    }
}

function GetOpenId()
{
    var openId = "";
    var dataSession = window.sessionStorage.getItem("MainOpenId");
    if (!!dataSession) {
        openId =dataSession;
    }
    return openId;
}

var SetParameter = function (smallopenid,xcxName) {
    //小程序OPENid
    var openId = smallopenid
    if (openId != ""&&openId!=undefined)
        window.sessionStorage.setItem("smallopenid", openId);
    //小程序name
    var xcxName = xcxName;
    if (xcxName != ""&&xcxName!=undefined)
       window.sessionStorage.setItem("xcxName", xcxName);
}

var Pay = function (IsMixPay, hasPointPay, hasTimesCardPay, remark, type, relationId, sucFun, errFun) {
    var Token = BaseInfoHelper.GetToken();
   if (ApicloudHelper.IsApp() || IsWXSmallProgram()) {
        //app微信、微信小程序支付
        var openId = "", xcxname = "";
        var paymentMethod=4;
        if (IsWXSmallProgram()) {
            openId = window.sessionStorage.getItem("smallopenid");
            xcxname = window.sessionStorage.getItem("xcxName");
            paymentMethod = 7;
        } else {
            openId = GetOpenId();
        }
   
        var model = {
            IsMixPay: IsMixPay,
            PaymentMethod: paymentMethod,
            Remark: remark,
            type: type,
            relationId: relationId,
            Token: Token,
            openId: openId,
            xcxname: xcxname,
            hasPointPay: hasPointPay,
            hasTimesCardPay: hasTimesCardPay
        };
        var url = IsWXSmallProgram() ?apiport.WeiXin_XCXGetOrderId : apiport.WeiXin_GetOrderId;
  
        http({
            url: url,
            method: "post",
            data: qs.stringify({ reqJson: JSON.stringify(model) })
          })
        .then(res => {
            var data=res.data;
            if (data.ResultNo == "00000000") {
                if (ApicloudHelper.IsApp()) {
                    //APP支付
                    ApicloudHelper.wxPay(data.mchId, data.nonceStr, data.orderId, data.payDetailId, data.timeStamp, data.sign, sucFun, errFun);
                } else {
                    var parameter = "?timeStamp=" + data.timeStamp +
                        "&nonceStr=" + data.nonceStr +
                         "&package=" + data.orderId+
                    "&signType=" + data.signType +
                    "&paySign=" + data.sign;
                    wx.miniProgram.navigateTo({ url: '/pages/pay/xcxpay'+parameter });
                }
            }
            else {
                errFun();
            }
        }).catch(error=>{

            errFun();
        });
    }
    else {
        //微信浏览器、浏览器微信支付
        var openId = GetOpenId();
        var model = {
            IsMixPay: IsMixPay,
            PaymentMethod: 2,
            Remark: remark,
            Token:Token,
            type: type,
            relationId: relationId,
            openId: openId,
            IsWeChatBrowser: IsWXBrowser(),
            hasPointPay: hasPointPay,
            hasTimesCardPay: hasTimesCardPay
        };
        var payDetailId = 0;
        http({
            url: apiport.WeiXin_GetJsApiParam,
            method: "post",
            data: qs.stringify({ reqJson: JSON.stringify(model) })
          })
            .then(res => {
              console.log("获取微信的参数appid等", res);
              var data=res.data;
              if (data.ResultNo == "00000000") {
                if (IsWXBrowser()) {
                    callpay(JSON.parse(data.jsApiParamJson), data.payDetailId, sucFun, errFun);
                } else {
                    console.log(apiport.CurrentDomain + "/Pay/GoodsPay?id=" + relationId + "&paydetailId=" + data.payDetailId + "&paymentmethod=6");
                    window.location.href = data.jsApiParamJson
                   + "&redirect_url=" + encodeURIComponent(apiport.CurrentDomain + "/Pay/GoodsPay?id=" + relationId + "&paydetailId=" + data.payDetailId + "&paymentmethod=6");
                }
            }
            else {
                errFun();
            }
            })
            .catch(error => {
              console.log(2);
              console.log(error);
            });
    }
    
}

var callpay = function (wxJsApiParam, payDetailId, sucFun, errFun) {
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady',jsApiCall, false);
        }
        else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
        }
    }
    else {
        jsApiCall(wxJsApiParam, payDetailId, sucFun, errFun);
    }
}

var jsApiCall = function (wxJsApiParam, payDetailId, sucFun, errFun) {
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        wxJsApiParam,//josn串
        function (res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                sucFun(payDetailId);
            }
            else {
                errFun();
            }
        }
   );
}

export default {
    IsWXBrowser: IsWXBrowser,
    GetOpenId: GetOpenId,
    IsWXSmallProgram:IsWXSmallProgram,
    Pay:Pay,
    SetParameter:SetParameter
}
