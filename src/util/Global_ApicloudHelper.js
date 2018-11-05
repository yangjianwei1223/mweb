/* eslint-disable */
function IsApp() {
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象        
    if (ua.indexOf("apicloud_laibei") > 0) {
        return true;
    } else {
        return false;
    }
}
    //获取accesstoken
    var WX_getToken = function (SucFun) {
        var wx = api.require('wx');
        WX_auth(wx, callback)
        function callback(ret) {
            if (ret.status) {
                wx.getToken({
                    apiKey: '',
                    apiSecret: '',
                    code: ret.code
                }, function (ret, err) {
                    if (err.code == 0) {
                        SucFun(ret);
                    }
                });
            }
        }
    }

      //去授权
  var WX_auth = function (wx, callback) {
        wx.auth({
            apiKey: ''
        }, function (ret, err) {
            callback(ret);
        });
    }
//应用版本号
function get_appVersion() {
    if (!api) {
        return "";
    }
    return api.appVersion;
}
//系统类型
function get_systemType() {
    if (!api) {
        return "";
    }
    return api.systemType;
}
//手机平台的系统版本
function get_systemVersion() {
    if (!api) {
        return "";
    }
    return api.systemVersion;
}
//设备唯一标识
function get_deviceId() {
    if (!api) {
        return "";
    }
    return api.deviceId;
}
//设备型号
function get_deviceModel() {
    if (!api) {
        return "";
    }
    return api.deviceModel;
}
//设备名称
function get_deviceName() {
    if (!api) {
        return "";
    }
    return api.deviceName;
}
//运营商名称
function get_operator() {
    if (!api) {
        return "";
    }
    return api.operator;
}
//屏幕分辨率宽
function get_screenWidth() {
    if (!api) {
        return "";
    }
    return api.screenWidth;
}
//屏幕分辨率高
function get_screenHeight() {
    if (!api) {
        return "";
    }
    return api.screenHeight;
}
//当前网络连接类型
function get_connectionType() {
    if (!api) {
        return "";
    }
    return api.connectionType;
}

var wxPay = function (mchId, nonceStr, orderId, payDetailId, timeStamp, sign, sucFun, errFun) {
    try {
        var wxpay = api.require('wxPay');
        wxpay.payOrder({
            orderId: orderId,
            mchId: mchId,
            nonceStr: nonceStr,
            timeStamp: timeStamp,
            sign: sign

        }, function (ret, err) {
            if (ret.status) {
                sucFun(payDetailId);
            }
            else {
                errFun();
            }
        });
    }
    catch (err) {
        //Global_CommonHelper.ConfirmLoadingHide();
        //Global_CommonHelper.SetTryCatchLog(err);
    }
}

var aliPay = function (orderInfo, SucFun, ErrFun) {
   // var orderInfo='it_b_pay=30m&notify_url=https%3a%2f%2ft-base-api.95laibei.com%2fMwebNotify%2fPay%2fAlipayNotify&out_trade_no=18950&partner=2088821856628860&payment_type=1&seller_id=itit%4095laibei.com&service=mobile.securitypay.pay&subject=%e5%95%86%e5%93%81%e8%b4%ad%e4%b9%b0&total_fee=0.01&sign=ocTcUZrZLtZJJWxCysn5e4kHmr2Q8pMY412vIbtY4mSLJZvVZayFTdTanS5cjzVHGeqPlefqmeacyQyzQioQgtx3UhRfePWqfcctb1Q23Q%2fjOw8bsoEzOUBe1BCNmHJ2gPNeE5bdc2LrOWrRG%2fU4MJkHC6WFWw0HFVS1atSWYO0%3d&sign_type=RSA'
   //alert('dnew'+orderInfo);
    try {
        var alipay = api.require('aliPay');
        alipay.payOrder({
            orderInfo: orderInfo
        }, function (ret, err) {
            if (ret.code == "9000") {
                SucFun();
                //Global_CommonHelper.ConfirmLoadingHide();
            }
            else {
                alert(JSON.stringify(err));
                ErrFun();
                //Global_CommonHelper.ConfirmLoadingHide();
            }
        })
    }
    catch (err) {
        //Global_CommonHelper.SetTryCatchLog(err);
       // Global_CommonHelper.ConfirmLoadingHide();
    }
}

export default {
    IsApp: IsApp,
    get_appVersion: get_appVersion,
    get_systemType: get_systemType,
    get_systemVersion: get_systemVersion,
    get_deviceId: get_deviceId,
    get_deviceModel: get_deviceModel,
    get_deviceName: get_deviceName,
    get_operator: get_operator,
    get_screenWidth: get_screenWidth,
    get_screenHeight: get_screenHeight,
    get_connectionType: get_connectionType,
    wxPay:wxPay,
    aliPay:aliPay,
    WX_getToken:WX_getToken
}