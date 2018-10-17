/* eslint-disable */
import qs from 'qs'
import storage from './storage'
import apiport from './api'
import http from './http.js'
import CommonHelper from './Global_CommonHelper.js'
var tel_reg = apiport.MobileCheckStr;//手机判断正则(11位数字)
var wait = 60;
var IsDisabled = false;
var ValidCodeTime = null;
function GetValidCode(bizType, tel, btnSendName, type) {
    if (IsDisabled) {
        return;
    }
    IsDisabled = true;
    if (tel == "") {
        alert("手机号码不能为空")
        IsDisabled = false;
        return;
    }
    if (!apiport.MobileCheckStr.test(tel)) {
        alert("您填写的手机号格式有误，请输入11位大陆手机号码")
        IsDisabled = false;
        return;
    }

    var CodeCacheTime = GetValidCodeTime(tel);
    if (CodeCacheTime.StartTime <= 60 && CodeCacheTime.StartTime > 0) {
        alert("获取验证码过于频繁，请稍后再试")
        IsDisabled = false;
        return;
    }
    wait = 60;
    type = !!type ? type : 0;
    var model = {
        BizType: bizType,
        Mobile: tel,
        type: type
    }
    http({
        url: apiport.Account_AddValidCode,
        method: "post",
        data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
        .then(res => {
            if (!!res.data && res.data.ResultNo == "00000000") {
                var dataCurrent = new Date();
                var validCodeCache = {
                    mobile: tel,
                    time: dataCurrent
                }
                storage.setSession(JSON.stringify(validCodeCache), "validCodeCache" + bizType);
                storage.setSession(JSON.stringify(dataCurrent), "validCodeTime" + tel);
                time(btnSendName);
            } else {
                alert("信息发送失败，请重试");
            }
            IsDisabled = false;
        })
        .catch(error => {
            IsDisabled = false;
        });
}
function time(o) {
    if (wait == 0) {
        document.getElementsByClassName("SendTTSValidCode")[0].style.color = "";
        IsDisabled = false;
        CommonHelper.removeClass(document.getElementById(o), "regetvalidcodebtn");
        document.getElementById(o).innerHTML = '获取验证码'
        validCode = "";
        wait = 60;
    } else {
        document.getElementsByClassName("SendTTSValidCode")[0].style.color = "#9fa0a0";
        IsDisabled = true;
        CommonHelper.addClass(document.getElementById(o), "regetvalidcodebtn");
        document.getElementById(o).innerHTML = "重新获取(" + wait + ")"
        wait--;
        ValidCodeTime = setTimeout(() => {
            time(o);
        }, 1000);
    }
}
function GetValidCodeTime(tel) {
    var StartTime = -1;//时间
    var codeCache = storage.getSession("validCodeTime" + tel);
    if (codeCache != null) {
        codeCache = JSON.parse(codeCache);
        var cachetime = new Date(codeCache);
        var now = new Date();
        var d = (now.getTime() - cachetime.getTime()) / 1000;
        StartTime = d;
    }
    return StartTime;
}

export default {
    GetValidCode:GetValidCode
}