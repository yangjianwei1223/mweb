<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <div>
        <div class="bindphone">
            <img :src="headimgurl" /><p>{{Nickname}}</p>
        </div>
        <section class="accountbox">
            <div class="accountline">
                <p class="borderbottom">
                    <input id="tel" type="tel" v-model="tel" data-role="none" value="" placeholder="手机号码" />
                </p>
            </div>
            <div class="accountline">
                <p class="validcodep">
                    <input id="valid"  type="valid"  v-model="valid" data-role="none" value="" maxlength="4" placeholder="请输入手机验证码" />
                    <button type="button" id="sendVerifyCode" @click="GetValidCode(0)" data-role="none" class="getvalidcodebtn">获取验证码</button>
                </p>
            </div>
        </section>
        <p class="get-voice-validate">收不到短信？使用<span class="SendTTSValidCode" @click="GetValidCode(1)">语音验证码</span></p>
        <button type="button" data-role="none" class="loginbtn" :class={disabled:disabled} @click="bindphone" :disabled="disabled">关联手机</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import qs from "qs";
import apiport from "../../util/api";
import head from "@/components/common/header";
import storage from "../../util/storage";
import CommonHelper from "../../util/Global_CommonHelper";
import ValidCodeHelper from "../../util/Global_ValidCodeHelper";
export default {
  name: "AccountBindphone",
  components: {
    vHeader: head
  },
  data() {
    return {
      headinfo: { title: "关联手机号" },
      headimgurl: this.$route.query.headimgurl,
      Nickname: this.$route.query.nickname,
      tel: "",
      valid: "",
      flag: 1
    };
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
  mounted: function() {},
  methods: {
    GetValidCode(type) {
      ValidCodeHelper.GetValidCode(51, this.tel, "sendVerifyCode", type);
    },
    bindphone() {
      var that = this;
      if (this.flag === 0) {
        return false;
      }
      this.flag = 0;
      if (this.tel == "") {
        alert("手机号码不能为空");
        this.flag = 1;
        return;
      }
      if (!apiport.MobileCheckStr.test(this.tel)) {
        alert("您填写的手机号格式有误，请输入11位大陆手机号码");
        this.flag = 1;
        return;
      }
      if (this.valid == "") {
        alert("验证码不能为空");
        this.flag = 1;
        return;
      } else if (this.valid.length != 4) {
        alert("验证码位数错误");
        this.flag = 1;
        return;
      }
      let model = {
        Mobile: this.tel,
        ValidCode: this.valid,
        Type: this.$route.query.type,
        OpenId: this.$route.query.openid,
        RegRequestURL: apiport.CurrentDomain + "/Account/Bindphone",
        access_token: this.$route.query.access_token
      };
      this.$http({
        url: apiport.Account_AddConnectMBRBase,
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
              if (res.data.ResultNo == "04130001") {
                if (that.$route.query.type == 1) {
                  ResultRemark = "您的手机已经关联过其他微信";
                } else if (that.$route.query.type == 2) {
                  ResultRemark = "您的手机已经关联过其他QQ";
                }
              } else {
                ResultRemark = res.data.ResultRemark;
              }
            }
            alert(ResultRemark);
          }
          that.flag = 1;
        })
        .catch(error => {
          that.flag = 1;
        });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/less/variable";
.bindphone {
  margin: 30px auto;
  text-align: center;
}
.bindphone img {
  width: 60px;
  height: 60px;
  border: 1px solid #dcdddd;
  border-radius: 50%;
}
.accountbox {
  margin: 0.4rem auto 0;
  background-color: #fff;
  box-shadow: 0 1px 1px #ebebec, 0 -1px 1px #ebebec;
}
.accountbox .accountline {
  position: relative;
  padding-left: 0.2rem;
}
.accountbox .accountline .iconfont {
  float: left;
  width: 20px;
  font-size: 20px;
  line-height: 1rem;
  margin-right: 0.2rem;
}
.accountbox .accountline input {
  -webkit-appearance: none;
  outline: none;
  border: none;
  line-height: 0.5rem;
  padding: 0.25rem 0;
  width: 100%;
  color: #3e3a39;
}
.accountbox .accountline p.validcodep {
  padding-right: 3rem;
}
.accountbox .accountline > p {
  position: relative;
  overflow: hidden;
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
.borderbottom {
  border-bottom: 1px solid #ededed;
}
.loginbtn {
  display: inline-block;
  width: 7rem;
  background-color: #f1bc19;
  border: none;
  font-size: 18px;
  color: #fff !important;
  line-height: 0.8rem;
  margin: 0.4rem 0.25rem 0.2rem;
  text-align: center;
}
.loginbtn.disabled {
  background-color: #dcdddd;
  opacity: 1;
}
</style>
