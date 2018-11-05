<template>
  <div class="login">
    <header class="header">
      <div><a class="iconfont back" @click="back">&#xe651;</a></div>
      <div id="headerTitle">登录/注册</div>
      <div>
          <router-link :to='"/"'>首页</router-link>
      </div>
    </header>
    <section class="accountbox">
        <div class="accountline">
            <i class="iconfont">&#xe62d;</i>
            <p class="borderbottom">
                <input type="tel" v-model="tel" placeholder="请输入手机号码" maxlength="11">
            </p>
        </div>
        <div class="accountline">
            <i class="iconfont">&#xe62b;</i>
            <p class="validcodep">
                <input type="valid" v-model="valid" placeholder="请输入手机验证码" maxlength="4" @keyup.enter="login">
                <button type="button" id="sendVerifyCode" @click="GetValidCode(0)" class="getvalidcodebtn" style="">获取验证码</button>
            </p>
        </div>
    </section>
    <p class="get-voice-validate">收不到短信？使用<span class="SendTTSValidCode" @click="GetValidCode(1)">语音验证码</span></p>
    <button type="button" class="loginbtn" :class={disabled:disabled} @click="login" :disabled="disabled">立即登录</button>
    <router-link :to='"/account/login"' class="forgetbtn" data-role="none">密码登录</router-link>
     <div class="thirdparty" :style="{display:((isWX||isApp)?'block':'none')}">
        <p class="title thirdtext">其他登录方式</p>
        <a  id="wx_login"  class="weixin" @click="wxLogin"><img src="https://cdn.sys.img.95laibei.com/Content/Images/thirdweixin.png@!standard_src_src"/><p>微信</p></a>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import qs from "qs";
import apiport from "../../util/api";
import storage from "../../util/storage";
import CommonHelper from "../../util/Global_CommonHelper";
import ValidCodeHelper from "../../util/Global_ValidCodeHelper";
import weiXinHelper from "../../util/Global_WeiXinHelper";
import connectLoginHelper from "../../util/Global_ConnectLoginHelper";
import apicloudHelper from "../../util/Global_ApicloudHelper";

export default {
  name: "index",
  data() {
    return {
      tel: "",
      valid: "",
      flag: 1,
      returnUrl:'',
      isWX:false,
      isApp:false
    };
  },
  mounted:function()
  {
     var returnUrl="/";
      if (this.$route.query.ReturnUrl!=undefined&&this.$route.query.ReturnUrl!='')
            {
                returnUrl = this.$route.query.ReturnUrl;
                if (returnUrl.IndexOf(',') != -1)
                {
                    returnUrl = returnUrl.Split(',')[1];
                }
            }
     this.returnUrl=returnUrl
     this.isWX=weiXinHelper.IsWXBrowser()
     this.isApp=apicloudHelper.IsApp()
  },
  computed: {
    disabled: function() {
      if (this.tel !== "" && this.valid !== "" && this.flag === 1) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    login() {
      let that = this;
      if (that.flag === 0) {
        return false;
      }
      that.flag = 0;
      if (that.tel == "") {
        this.$alert('手机号码不能为空')
        that.flag = 1;
        return;
      }
      if (!apiport.MobileCheckStr.test(that.tel)) {
        this.$alert("您填写的手机号格式有误，请输入11位大陆手机号码");
        that.flag = 1;
        return;
      }
      if (that.valid == "") {
        this.$alert("验证码不能为空");
        that.flag = 1;
        return;
      } else if (that.valid.length != 4) {
        this.$alert("验证码位数错误");
        that.flag = 1;
        return;
      }

      let model = {
        Mobile: this.tel,
        ValidCode: this.valid,
        RegRequestURL: location.href
      };
      this.$http({
        url: apiport.Account_CheckLoginByValidCode,
        method: "post",
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          if (!!res.data && res.data.ResultNo == "00000000") {
            that.$store.commit("SET_TOKEN", res.data.Token);
            CommonHelper.LoginSuccess(res.data);
            that.$router.push({ name: "index" });
          } else {
            this.$alert(res.data.ResultRemark);
          }
          that.flag = 1;
        })
        .catch(error => {
          that.flag = 1;
        });
    },
    back() {
      this.$router.back();
    },
    GetValidCode(type) {
      ValidCodeHelper.GetValidCode(21,this.tel, "sendVerifyCode", type);
    },
    wxLogin:function()
    {
      storage.setSession(this.returnUrl,"wx_login_backurl");
      if(this.isWX)
      {
         window.location.href= apiport.CurrentDomain + "/WeChat/Authorize?state=wxlogin";
      }else
      {
          connectLoginHelper.wxlogin();
      }  
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../assets/less/variable";
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 22;
  background: @base-ycolor;
  display: -webkit-box;
  height: 1rem;
  line-height: 0.8rem;
  text-align: center;
  & > div {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    display: -webkit-box;
    display: -moz-box;
    font-size: 18px;
    color: #000;
  }
  & > div:first-child {
    text-align: left;
    margin-left: 0.2rem;
    -moz-box-pack: start;
    -webkit-box-pack: start;
    min-width: 20%;
  }
  & > div:last-child {
    text-align: right;
    margin-right: 0.2rem;
    -webkit-box-pack: end;
    min-width: 20%;
    font-size: 16px;
  }
  .back {
    font-size: 22px;
  }
}
.accountbox {
  margin: 1.4rem auto 0;
  background-color: #fff;
  .accountline {
    position: relative;
    padding-left: 0.2rem;
    .iconfont {
      float: left;
      width: 20px;
      font-size: 20px;
      line-height: 1rem;
      margin-right: 0.2rem;
    }
    p {
      position: relative;
      overflow: hidden;
    }
    input {
      -webkit-appearance: none;
      outline: none;
      border: none;
      line-height: 0.5rem;
      padding: 0.25rem 0;
      width: 100%;
      color: #3e3a39;
    }
  }
  .accountline:not(:last-child) p {
    border-bottom: 1px solid #ededed;
  }
}
.loginbtn {
  display: inline-block;
  width: 7rem;
  background-color: @base-ycolor;
  border: none;
  font-size: 18px;
  color: #fff;
  line-height: 0.8rem;
  margin: 0.4rem 0.25rem 0.2rem;
  text-align: center;
  &.disabled {
    background-color: @base-color4;
  }
  &:active {
    background-color: @base-ycolor2;
  }
}
.forgetbtn {
    display:inline-block;
    width:7rem;
    background-color:transparent;
    border:none;
    font-size:15px;
    color:#9fa0a0!important;
    line-height:1;
    margin:10px .25rem;
    text-align:center;
}
.accountbox .accountline .getvalidcodebtn {
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
.get-voice-validate {
  font-size: 12px;
  text-align: right;
  margin-top: 0.2rem;
  margin-right: 0.2rem;
}
.get-voice-validate > span {
  color: #ff9c00;
}
.get-voice-validate.get {
  margin-top: 0;
  padding-bottom: 0.2rem;
}

.thirdparty{
    margin-top:80px;
    width:100%;
    text-align:center;
}
.thirdparty .title:before,.thirdparty .title:after{
    content:"";
    display:inline-block;
    height:1px;
    width:2rem;
    background-color:#dcdddd;
    vertical-align:middle;
    margin:0 12px;
}
.thirdparty .weixin{
    display:inline-block;
    margin:30px 10px;
}
.thirdparty .weixin img{
    width:40px;
    border:1px solid #dcdddd;
    border-radius:50%;
    padding:10px;
}
</style>
