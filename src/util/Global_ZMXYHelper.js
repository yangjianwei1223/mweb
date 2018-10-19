/* eslint-disable */ 
import qs from "qs";
import BaseInfoHelper from './Global_BaseInfoHelper'
import apiport from './api'
import http from './http.js'

var ApplyRentCreate = function (ApplyRecordId, ErrFun) {
    var Token = BaseInfoHelper.GetToken();
    var model = { ApplyRecordId: ApplyRecordId, Token:Token }
    http({
        url: apiport.AlipayZMXY_ApplyRentCreate,
        method: "post",
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          var data=res.data;
          if (data.ResultNo == "00000000") {
            location.href = data.Data;
        }
        else {
            ErrFun();
        }
        })
        .catch(error => {
            console.log(2);
            console.log(error);
        });
}

var Pay = function (relationId, SucFun, ErrFun) {
    var result = null;
    var Token = new BaseInfoHelper.GetToken();
    var model = {
        Token: Token,
        relationId: relationId
    }
    http({
        url: apiport.AlipayZMXY_RentCreate,
        method: "post",
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          var data=res.data;
          if (data.ResultNo == "00000000") {
            location.href = data.Data;
        }
        else {
            ErrFun();
        }
        })
        .catch(error => {
            console.log(2);
            console.log(error);
        });
}

var IsAlipayBrowser = function () {
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
    if (ua.indexOf("alipayclient")>0) {
        return true;
    }
    else {
        return false;
    }
}

export default {
    Pay:Pay,
    IsAlipayBrowser:IsAlipayBrowser,
    ApplyRentCreate:ApplyRentCreate

}