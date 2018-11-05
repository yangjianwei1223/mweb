<template>
  <div>

  </div>
</template>

<script>
/* eslint-disable */
import qs from 'qs'
import apiport from '../../util/api'
import BaseInfoHelper from '../../util/Global_BaseInfoHelper'
import storage from '../../util/storage';
export default {
  name: 'logincenter',
  data () {
    return {
      access_token: this.$route.query.access_token,
      openid: this.$route.query.openid
    }
  },
  mounted () {
    let _that=this;
    let model = {
      AccessToken: this.access_token,
      Openid: this.openid
    }

    this.$http({
      url: apiport.WeiXin_GetUserInfo,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        let data=res.data;
        BaseInfoHelper.GetLoginInfo().then(function(loginresult){
           var token=data.Token
          if(loginresult!=null)
          {
            alert('微信绑定账号:'+JSON.stringify(data))
            _that.Binding('1', _that.openid,BaseInfoHelper.GetToken(),_that.access_token)
          }else
          {
          //  alert('微信关联登陆')
            var returnUrl ="/"
            var wx_login_backurl =storage.getSession("wx_login_backurl");
            if (wx_login_backurl != null&&wx_login_backurl!="") {
                returnUrl = wx_login_backurl;
            }
            if (!!token) {
                //将数据保存到页面缓存
                storage.setUserTokenToStorage({ Token: token, Sex:data.Sex},_that.$Global.TokenExpTime);
                storage.DelSessionByKey("BaseInfo");               
                _that.$router.push(returnUrl);
            }
            else {
                var url = "/Account/Bindphone?type=1&openid=" + _that.openid + "&headimgurl=" + data.Headimgurl
                 + "&nickname=" + data.Nickname + "&access_token=" + _that.access_token + "&ReturnUrl=" + returnUrl;
                // alert(url)
                _that.$router.push(url);
            }
          }
        })
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  },
  methods: {
    Binding (Type, OpenId, Token, accessToken) {
      let model = {
        Type: Type,
        OpenId: OpenId,
        Token: Token,
        access_token: accessToken
      }
      this.$http({
        url: apiport.Account_BindingConnect,
        method: 'post',
       header: {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"},
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      }).then(res => {
          var data=res.data;
          // alert('微信关联登陆中心'+JSON.stringify(data))
          if(!!data && typeof (data.ResultNo) != "undefined" && data.ResultNo == "00000000"){
            this.$router.push({path: '/My/Bindset'})
          }else
          {
             this.$router.push({name: 'index'})
          }
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>

</style>
