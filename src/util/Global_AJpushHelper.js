/* eslint-disable */
import qs from "qs";
import ApicloudHelper from './Global_ApicloudHelper'
import BaseInfoHelper from './Global_BaseInfoHelper'
import apiport from './api'
import storage from './storage'
import http from './http.js'

    var IsExist = function () {
        if (!ApicloudHelper.IsApp()) {
            return false;
        }
        var ajpush = api.require('ajpush');
        if (ajpush == undefined || ajpush == null) {
            return false;
        } else {
            return true;
        }
    }

    var Init = function () {
        // setListerer(); api js 实现监听
        if (!IsExist())
            return;
        setSystemType();
        setRegisterId();
    }

    //加入标签，自动添加前缀
    //默认添加 标签 all 和 system
    var JoinTag = function (alias, tags) {
        if (!IsExist())
            return;
         var ajpush = api.require('ajpush');
         getTagPrevFix().then(function(res){
            var pre =res;
            if (tags == undefined || tags == null)
            {
                tags = [];
            }
            if (GetStorage().SystemType==0)
            {
                tags.push("ios");
            } else if (GetStorage().SystemType == 1) {
                tags.push("android");
            } else {
                tags.push("other");
            }
            tags.push("all");
            for (var i = 0; i < tags.length; i++) {
                tags[i] = pre + tags[i];
            }
            var param = { alias: pre+alias, tags: tags };
            ajpush.bindAliasAndTags(param, function (ret) {
                var statusCode = ret.statusCode;
               // alert('极光绑定Tag成功');
            });
         });
        
     }

    var GetStorage = function () {
         var model = { SystemType: 2, RegistrationId: '' };
         if (!IsExist())
            return model;
         var sysTypeStorage = storage.getLocal("jpushSystemType");
         if (sysTypeStorage != undefined && sysTypeStorage.ObjectData != null) {
             model.SystemType = sysTypeStorage.ObjectData;
         } else {
             model.SystemType =2;
         }
         var registerStorage = storage.getLocal("jpushRegisterId");
         if (registerStorage != undefined && registerStorage.ObjectData != null) {
             model.RegistrationId = registerStorage.ObjectData;
         } else {
             model.RegistrationId = '';
         }
         return model;
     }

    //极光推送  type 0 消息 1ios点击通知 2android点击通知
     var ReceiveCallBack = function (showConfirm, dataJson) {
         //var id = ajpush.id;
         //var title = ajpush.title;
         //var content = ajpush.content;
         var ajpush = JSON.parse(dataJson);
         var sysType = GetStorage().SystemType;
         var extra = ajpush.extra;
         if (extra.IsLink == '1') {
             if (showConfirm && sysType==0) {
               /*  Global_PopupHelper.confirm({
                     'title': getfromatMsg(ajpush.content),
                     'confirmName': '查看',
                     'cancelName': "忽略",
                     'confirmCallback': function () {
                         TemplateHelper.changePage(Global_ServiceUrlHelper.CurrentDomain + extra.LinkUrl);
                     }
                 });*/
             } else {
                // TemplateHelper.changePage(Global_ServiceUrlHelper.CurrentDomain + extra.LinkUrl);
             }
         } else {
            /* Global_PopupHelper.alert({
                 'title': "【通知】：" + getfromatMsg(ajpush.content)
             });
             */
         }
         

     }
    
     var getfromatMsg = function (content) {
         return content.replace(/@_@/g, "\n");
     }

     var setListerer = function () {
         var ajpush = api.require('ajpush');
         if (api.systemType != 'ios') {
             ajpush.init(function (ret) {
                 if (ret && ret.status) {
                     //success
                 } else {
                     alert('推送模块加载失败');
                 }
             });

             api.addEventListener({
                 name: 'appintent'
             }, function (ret, err) {
                 if (ret && ret.appParam.ajpush) {
                     var ajpush = ret.appParam.ajpush;
                     //var id = ajpush.id;
                     //var title = ajpush.title;
                     //var content = ajpush.content;
                     //var extra = ajpush.extra;
                     alert('点击通知:' + JSON.stringify(ret));
                 }
             });

         } else {
             api.addEventListener({
                 name: 'noticeclicked'
             }, function (ret, err) {
                 if (ret && ret.value) {
                     var ajpush = ret.value;
                     //var content = ajpush.content;
                     //var extra = ajpush.extra;
                     alert('点击通知:' + JSON.stringify(ret));
                 }
             });
         }

         ajpush.setListener(
          function (ret) {
              //var id = ret.id;
              //var title = ret.title;
              //var content = ret.content;
              //var extra = ret.extra;
              alert('接收到消息:' + JSON.stringify(ret));
          }
         );
     }

    // 0 iso 1 android 2 other
     var setSystemType = function () {
         var str = api.systemType.toString();
         if (str.toLowerCase() == "ios") {
             storage.setLocal("jpushSystemType", 0);
         } else if (str.toLowerCase() == "android") {
            storage.setLocal("jpushSystemType", 1);
         } else {
            storage.setLocal("jpushSystemType", 2);
         }
     }
     var setRegisterId = function () {
         var ajpush = api.require('ajpush');
         ajpush.getRegistrationId(function (ret) {
             var registrationId = ret.id;
             storage.setLocal("jpushRegisterId", registrationId);
         });
     };

    //tag前缀 示例: laibei_ 
     var getTagPrevFix = function () {
       return new Promise((resolve, reject) =>{
        http({
            url: apiport.SysConfig_GetJpushTagprevfix,
            method: "post",
            data: qs.stringify({})
          })
        .then(res => {
            var result=res.data;
            if (result.ResultNo == '00000000') {
                resolve(result.TagPrevfix);
            }else
            {
                resolve("");
            }
            
        }).catch(error=>{
            reject(error);
        });

       });
     }

     export default {
        getTagPrevFix:getTagPrevFix,
        Init:Init,
        JoinTag:JoinTag,
        ReceiveCallBack:ReceiveCallBack,
        GetStorage:GetStorage
    }