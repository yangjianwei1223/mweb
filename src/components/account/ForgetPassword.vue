<template>
<div>
  <div id="firstPage">
    <header class="header">
      <div><a class="iconfont back" @click="back">&#xe651;</a></div>
      <div id="headerTitle">忘记密码</div>
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
                <input type="valid" v-model="valid" placeholder="请输入手机验证码" maxlength="4" @keyup.enter="nextForgetPage">
                <button type="button" id="sendVerifyCode" @click="GetValidCode(0)" class="getvalidcodebtn" style="">获取验证码</button>
            </p>
        </div>
    </section>
    <p class="get-voice-validate">收不到短信？使用<span class="SendTTSValidCode" @click="GetValidCode(1)">语音验证码</span></p>
    <button type="button" class="loginbtn" :class={disabled:disabled} @click="nextForgetPage" :disabled="disabled">下一步</button>
  </div>
  <div id="SecondPage" style="display:none;">
    <header class="header">
      <div><a class="iconfont back" @click="SecondPageBack">&#xe651;</a></div>
      <div>设置密码</div>
      <div>
      </div>
    </header>
    <section class="accountbox">
        <div class="accountline">
            <p class="borderbottom paddingleftp">
                <span>新密码</span>
                <input id="new-pwd" type="password"  v-model="password"  data-role="none" value="" maxlength="16" placeholder="请输入新密码" />
            </p>
        </div>
        <div class="accountline">
            <p class="paddingleftp">
             <span>确认密码</span>
                <input id="repeat-pwd" type="password" v-model="repeatPassword" data-role="none" value="" maxlength="16" placeholder="请确认密码" />
            </p>
        </div>
    </section>
    <button type="button" id="btnForgetReg" @click="btnForgetReg" data-role="none" class="loginbtn" :class={disabled:disabledrepeat} :disabled="disabledrepeat">确定</button>
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

export default {
  name: "AccountForgetPassword",
  data() {
    return {
      tel: "",
      valid: "",
      flag: 1,
      password: "",
      repeatPassword: ""
    };
  },
  computed: {
    disabled: function() {
      if (this.tel !== "" && this.valid !== "" && this.flag === 1) {
        return false;
      } else {
        return true;
      }
    },
    disabledrepeat: function() {
      if (
        this.password !== "" &&
        this.repeatPassword !== "" &&
        this.flag === 1
      ) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    btnForgetReg() {
      let that = this;
      if (that.flag === 0) {
        return false;
      }
      that.flag = 0;
      if (!this.TelAndValidCheck()) {
        that.flag = 1;
        return;
      }
      if (this.password == "") {
        alert("密码不能为空");
        that.flag = 1;
        return;
      }
      if (!apiport.PasswordCheckStr.test(this.password)) {
        alert("请填写正确的密码6-16位");
        that.flag = 1;
        return;
      }
      if (this.repeatPassword != this.password) {
        alert("密码不一致");
        that.flag = 1;
        return;
      }

      let model = {
        Mobile: this.tel,
        ValidCode: this.valid,
        Password: this.password
      };
      this.$http({
        url: apiport.Account_ChangePassword,
        method: "post",
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          if (!!res.data && res.data.ResultNo == "00000000") {
            that.$store.commit("SET_TOKEN", res.data.Token);
            CommonHelper.LoginSuccess(res.data);
            that.$router.push({ name: "index" });
          } else {
            var ResultRemark = "操作失败，请重试";
              if (!!res.data && !!res.data.ResultRemark) {
                ResultRemark = res.data.ResultRemark;
              }
              alert(ResultRemark);
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
      ValidCodeHelper.GetValidCode(21, this.tel, "sendVerifyCode", type);
    },
    nextForgetPage() {
      if (this.TelAndValidCheck()) {
        var model = { BizType: 11, Mobile: this.tel, ValidCode: this.valid };
        this.$http({
          url: apiport.Account_CheckValidCode,
          method: "post",
          data: qs.stringify({ reqJson: JSON.stringify(model) })
        })
          .then(res => {
            if (!!res.data && res.data.ResultNo == "00000000") {
              document.getElementById("firstPage").style.display = "none";
              document.getElementById("SecondPage").style.display = "block";
            } else {
              var ResultRemark = "验证码错误";
              if (!!res.data && !!res.data.ResultRemark) {
                ResultRemark = res.data.ResultRemark;
              }
              alert(ResultRemark);
            }
          })
          .catch(error => {});
      }
    },
    TelAndValidCheck() {
      if (this.tel == "") {
        alert("手机号码不能为空");
        return false;
      }
      if (!apiport.MobileCheckStr.test(this.tel)) {
        alert("您填写的手机号格式有误，请输入11位大陆手机号码");
        return false;
      }
      if (this.valid == "") {
        alert("验证码不能为空");
        return false;
      } else if (this.valid.length != 4) {
        alert("验证码位数错误");
        return false;
      }
      return true;
    },
    SecondPageBack() {
      document.getElementById("SecondPage").style.display = "none";
      document.getElementById("firstPage").style.display = "block";
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
  display: inline-block;
  width: 7rem;
  background-color: transparent;
  border: none;
  font-size: 15px;
  color: #9fa0a0 !important;
  line-height: 1;
  margin: 10px 0.25rem;
  text-align: center;
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
.accountbox .paddingleftp {
  position: relative;
  overflow: hidden;
  padding-left: 80px;
}
.accountbox p.paddingleftp.padr {
  height: 1rem;
  padding-right: 1.5rem;
}
.accountbox .paddingleftp span {
  position: absolute;
  left: 0;
  top: 0;
  line-height: 1rem;
  font-size: 13px;
}
</style>
