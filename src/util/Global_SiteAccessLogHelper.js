import qs from 'qs'
import storage from './storage'
import apiport from './api'
import http from './http.js'
import BaseInfoHelper from './Global_BaseInfoHelper'
import CommonHelper from './Global_CommonHelper'
function GetSiteAccessInfo () {        
    var SiteAccessLog = storage.getSession("SiteAccessLog");
    var SiteAccessLocal = storage.getLocal("SiteAccesslocalStorage");
    var ClientIdData = storage.getLocal("ClientId");
    var AppQueryString = storage.getSession("AppQueryString");
    if (SiteAccessLocal == null) {
        var model = {
            AppChannel: "",
            AppType: "",
            AppVersion: "",
            SystemType: "",
            DeviceId: "",
            DeviceModel: "",
            DeviceName: "",
            Operator: "",
            ScreenWidth: "",
            ScreenHeight: "",
            ConnectionType: "",
            MemberAccount: "",
            PositionType: "1",
            Longitude: "",
            Latitude: "",
            URL: window.location.href,
            GUID: ""
        }      

        if (ClientIdData != null) {                
            model.GUID = ClientIdData;
        }
        if (AppQueryString != null) {
            var querystring = JSON.parse(AppQueryString);
            model.AppChannel = querystring.AppChannel;
            model.AppType = querystring.AppType;
        }


        // if (Global_ApicloudHelper.IsApp()) {                        
        //     model.AppVersion = Global_ApicloudHelper.get_appVersion();
        //     model.SystemType = Global_ApicloudHelper.get_systemType();
        //     model.DeviceId = Global_ApicloudHelper.get_deviceId();
        //     model.DeviceModel = Global_ApicloudHelper.get_deviceModel();
        //     model.DeviceName = Global_ApicloudHelper.get_deviceName();
        //     model.Operator = Global_ApicloudHelper.get_operator();
        //     model.ScreenWidth = Global_ApicloudHelper.get_screenWidth();
        //     model.ScreenHeight = Global_ApicloudHelper.get_screenHeight();
        //     model.ConnectionType = Global_ApicloudHelper.get_connectionType();
        //     if (model.AppChannel == "" && model.SystemType == "ios") {
        //         model.AppChannel = "AS";
        //         if (model.AppType == "") model.AppType = "12";
        //     }
        // }
        // else
        // {
        //     if (Global_WeiXinHelper.IsWXBrowser()) {
        //         model.AppChannel = "WX";
        //     }
        //     else {
        //         model.AppChannel = "OT";
        //     }
        // }
        model.AppChannel = "OT";
        let GetLoginInfo=BaseInfoHelper.GetLoginInfo();
        Promise.all([GetLoginInfo]).then((res) => {
            model.MemberAccount = res[0].BaseId;
            AddSiteAccessLog(model);
        }) 
        
        
    }
}
function AddSiteAccessLog (model) {
    http({
        url: apiport.Common_AddSiteAccessLog,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model)})
      }).then((res) => {
        if (!!res.data && res.data.ResultNo == "00000000") {
            var resultStr = {
                AppChannel: model.AppChannel,
                AppType: model.AppType,
                AppVersion: model.AppVersion,
                SystemType: model.SystemType,
                DeviceId: model.DeviceId,
                DeviceModel: model.DeviceModel,
                DeviceName: model.DeviceName,                        
                ScreenWidth: model.ScreenWidth,
                ScreenHeight: model.ScreenHeight,                       
                GUID: res.data.GUID
            }
            storage.setSession(JSON.stringify(resultStr),"SiteAccessLog");
            storage.setLocal(JSON.stringify(resultStr),"SiteAccesslocalStorage");
            storage.setLocal( res.data.GUID,"ClientId");
        }
      }).catch((error) => {
      })
}
function PageVisit(){
    var RouteUrl = GetRouteUrl();
    var Token = BaseInfoHelper.GetToken();
    var model = {
        Token: Token,
        PositionType: "1",
        Longitude: "0",
        Latitude: "0",
        FullUrl: RouteUrl.FullUrl,
        AbsoluteUrl: RouteUrl.AbsoluteUrl,
        VisitOrigin: RouteUrl.VisitOrigin,
        ClientId: "",
        SessionId: ""
    }
    var AppInfo = storage.getSession("LocationInfo");
    if (AppInfo != null) {
        var localtionInfo = JSON.parse(AppInfo);
        model.Longitude = localtionInfo.Longitude;
        model.PositionType = localtionInfo.PositionType;
        model.Latitude = localtionInfo.Latitude;
    }
    var Client = storage.getLocal("ClientId");
    if (Client != null) {
        model.ClientId = Client;
    }
    else {
        var guid = newGUID();
        model.ClientId = guid;
        storage.setLocal(guid,"ClientId");
    }

    var Conversation = storage.getSession("Conversation");//存储会话
    if (Conversation != null) {
        model.SessionId = Conversation;
    }
    else {
        var guid = newGUID();
        model.SessionId = guid;
        storage.setSession(guid,"Conversation");
    }
    AddPageVisit(model);
}
/* -------------------------------------生成GUID码开始--------------------------------------- */
function newGUID () {
    var date = new Date(); var guidStr = '';
    var sexadecimalDate = hexadecimal(getGUIDDate(date), 16);
    var sexadecimalTime = hexadecimal(getGUIDTime(date), 16);
    for (var i = 0; i < 9; i++) {
        guidStr += Math.floor(Math.random() * 16).toString(16);
    }
    guidStr += sexadecimalDate;
    guidStr += sexadecimalTime;
    while (guidStr.length < 32) {
        guidStr += Math.floor(Math.random() * 16).toString(16);
    }
    return formatGUID(guidStr);
}
/*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */
function hexadecimal (num, x, y) {
    if (y != undefined) { return parseInt(num.toString(), y).toString(x); }
    else { return parseInt(num.toString()).toString(x); }
}
 /* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
 function getGUIDDate (date) {
    return date.getFullYear() + addZero(date.getMonth() + 1) + addZero(date.getDay());
}
/* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
function addZero (num) {
    if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
        return '0' + Math.floor(num);
    } else {
        return num.toString();
    }
}
/* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
function getGUIDTime (date) {
    return addZero(date.getHours()) + addZero(date.getMinutes()) + addZero(date.getSeconds()) + addZero(parseInt(date.getMilliseconds() / 10));
}
/* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
function formatGUID (guidStr) {
    var str1 = guidStr.slice(0, 8) + '-', str2 = guidStr.slice(8, 12) + '-', str3 = guidStr.slice(12, 16) + '-', str4 = guidStr.slice(16, 20) + '-', str5 = guidStr.slice(20);
    return str1 + str2 + str3 + str4 + str5;
}
/* --------------------------------------生成GUID码结束------------------------------------- */
//获取地址
function GetRouteUrl () {
    var FullUrl = window.location.href.toLowerCase();
    var AbsoluteUrl = GetAbsoluteUrl();
    var VisitOrigin = "";
    if (typeof (window.VisitOrigin) != "undefined" && window.VisitOrigin != FullUrl) {
        VisitOrigin = window.VisitOrigin;
    }
    var route = { FullUrl: FullUrl, AbsoluteUrl: AbsoluteUrl, VisitOrigin: VisitOrigin };
    return route;
}
function GetAbsoluteUrl (linkUrl) {
    var AbsoluteUrl = "/";
    var urlArr = location.pathname.split("?")[0].split("/");
    if (urlArr != null && urlArr.length > 0) {
        for (var i = 0; i < urlArr.length; i++) {
            if (!!urlArr[i] && !/^[0-9]*$/.test(urlArr[i])) {
                AbsoluteUrl += urlArr[i] + (i == urlArr.length - 1 ? "" : "/");
            }
        }
    }
    return AbsoluteUrl.toLowerCase();
}
function AddPageVisit (model) {
    http({
        url: apiport.APIDomain + "/MWeb/BehaviorAnalysis/AddPageVisit",
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model)})
    }).then((res) => {
    }).catch((error) => {
    })
}
function SetAppQueryString () {
    var AppChannel = CommonHelper.GetQueryString("AppChannel");
    var AppType = CommonHelper.GetQueryString("AppType");
    var AppQueryString = {
        AppChannel: AppChannel,
        AppType: AppType
    }
    if (AppChannel != null && AppType != null) {
        storage.setSession(JSON.stringify(AppQueryString),"AppQueryString");
    }        
}
export default {
    GetSiteAccessInfo: GetSiteAccessInfo,
    PageVisit: PageVisit,
    SetAppQueryString: SetAppQueryString
}