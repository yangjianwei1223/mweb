/* eslint-disable */
    import qs from 'qs'
    import storage from './storage'
    import apiport from './api'
    import http from './http.js'
    import router from '../router'
    import aJpushHelper from './Global_AJpushHelper.js'
    import apicloudHelper from './Global_ApicloudHelper.js'
    import Global from './Global'

    var CheckLogin = function (AccessToken, Openid) {
         var JpushRegisterId = aJpushHelper.GetStorage().RegistrationId;
         var SystemType = aJpushHelper.GetStorage().SystemType;
         //alert('jpushRegiId(测试忽略该提示):'+JpushRegisterId);
         return new Promise((resolve, reject) =>{
            http({
                url: apiport.APIDomain + "/MWeb/WeiXin/GetUserInfo",
                method: "post",
                data: qs.stringify({ reqJson: '{"AccessToken":"' + AccessToken + '","Openid":"' + Openid + '","JpushRegisterId":"' 
                + JpushRegisterId + '","SystemType":"' + SystemType + '"}'
               })
              })
            .then(res => {
                var result=res.data;
             resolve(result);
            }).catch(error=>{
                reject(error);
            });
    
           });
    }


  var wxlogin = function () {
    apicloudHelper.WX_getToken(SucCallBack);
        function SucCallBack(ret) {
            var returnUrl = apiport.CurrentDomain;
            CheckLogin(ret.accessToken, ret.openId).then(function(data){
                if (typeof (data.ResultNo) != "undefined" && data.ResultNo == "00000000" && !!data.Token) {
                    //极光推送加标签
                    if (apicloudHelper.IsApp())
                        aJpushHelper.JoinTag(data.BaseId, []);
                    //将数据保存到页面缓存
                    storage.setUserTokenToStorage({ Token: data.Token, Sex: data.aSex },Global.TokenExpTime);
                           
                    var wx_login_backurl = storage.getSession("wx_login_backurl");
                    if (wx_login_backurl!= undefined&&wx_login_backurl!='') {
                        returnUrl = wx_login_backurl;
                    }
                    router.push({path:returnUrl})            
                }
                else {
                    var url = "/Account/Bindphone?type=1&headimgurl=" + data.Headimgurl + "&nickname=" + data.Nickname + "&openid=" + ret.openId + "&access_token=" + ret.accessToken + "&ReturnUrl=" + returnUrl;
                    router.push({path:url})
                }
            });
       
        }
    }

    export default {
        CheckLogin: CheckLogin,
        wxlogin: wxlogin
    }