/* eslint-disable */
import apiport from './api'
import storage from './storage'
function GetQueryString (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = null;
    if (!!window.location.search) {
        r = window.location.search.substr(1).match(reg);
    }
    if (r == null) {
        //解决/Article/List/3390 格式问题
        reg = /(?:(\/{1}))(\d+)(?:[?&]?)/gi;
        var matchResult = window.location.href.match(reg);
        var result = "";
        if (matchResult != null && matchResult.length > 0) {
            result = matchResult[matchResult.length - 1];
        }
        if (!!result) {
            return result.match(/\d+/) != null ? result.match(/\d+/)[0] : "";
        }
        return "";
    }

    if (r != null) return unescape(r[2]); return null;
}
function LoginSuccess(data) {
    storage.setUserTokenToStorage(data, apiport.TokenExpTime);
    storage.DelSessionByKey("BaseInfo");
    storage.DelSessionByKey("validCodeCache21");
}
function addClass(element, className) {
    if (!new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className)) element.className += ' ' + className;
}
function removeClass(element, className) {
    element.className = element.className.replace(new RegExp("(^|\\s)" + className + "(?=(\\s|$))", "g"), '');
}
function ChechNumberOneDecimal(_this){
    var reg1 = /^\d{0,5}(\.\d{0,2})?$/g;
    if (!reg1.test(_this.pointsPay)) {
        var len = _this.pointsPay.length - 1;
        _this.pointsPay = parseFloat(_this.pointsPay.substring(0, len)) ;
    }
}
export default {
    GetQueryString: GetQueryString,
    LoginSuccess: LoginSuccess,
    addClass: addClass,
    removeClass: removeClass,
    ChechNumberOneDecimal:ChechNumberOneDecimal,
}