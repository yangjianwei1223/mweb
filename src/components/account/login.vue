<template>
  <div class="login">
    <header class="header">
      <div><a class="iconfont back" @click="back">&#xe651;</a></div>
      <div id="headerTitle">登录</div>
      <div>
          <router-link :to="{name:'index'}">首页</router-link>
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
                <input type="password" v-model="password" placeholder="请输入密码" maxlength="16" @keyup.enter="login">
            </p>
        </div>
    </section>
    <button type="button" class="loginbtn" :class={disabled:disabled} @click="login" :disabled="disabled">立即登录</button>
    <div class="forgetbtn">
      <a href="/" style="display:inline;">忘记密码</a>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import storage from '../../util/storage'
export default {
  name: 'Login',
  data () {
    return {
      tel: '',
      password: '',
      flag: 1
    }
  },
  computed: {
    disabled: function () {
      if (this.tel !== '' && this.password !== '' && this.flag === 1) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    login () {
      let that = this
      if (that.flag === 0) {
        return false
      }
      that.flag = 0
      let model = {
        Mobile: this.tel,
        Password: this.password
      }
      this.$http({
        url: apiport.Account_CheckLoginByPwd,
        method: 'post',
        data: qs.stringify({reqJson: JSON.stringify(model)})
      }).then((res) => {
        that.$store.commit('SET_TOKEN', res.data.Token)
        storage.setUserTokenToStorage(res.data, that.$Global.TokenExpTime)
        that.flag = 1
        if (that.$route.query.redict) {
          that.$router.push({path: that.$route.query.redict})
        } else {
          that.$router.push({name: 'index'})
        }
      }).catch((error) => {
        console.log(2)
        console.log(error)
        that.flag = 1
      })
    },
    back () {
      this.$router.back()
    }
  }
}
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
  .back{
    font-size: 22px;
  }
}
.accountbox{
  margin: 1.4rem auto 0;
  background-color: #fff;
  .accountline{
    position: relative;
    padding-left: .2rem;
    .iconfont{
      float: left;
      width: 20px;
      font-size: 20px;
      line-height: 1rem;
      margin-right: .2rem;
    }
    p{
      position: relative;
      overflow: hidden;
    }
    input{
      -webkit-appearance: none;
      outline: none;
      border: none;
      line-height: .5rem;
      padding: .25rem 0;
      width: 100%;
      color: #3e3a39;
    }
  }
  .accountline:not(:last-child) p{
    border-bottom:1px solid #ededed;
  }
}
.loginbtn{
    display: inline-block;
    width: 7rem;
    background-color: @base-ycolor;
    border: none;
    font-size: 18px;
    color: #fff;
    line-height: .8rem;
    margin: .4rem .25rem .2rem;
    text-align: center;
    &.disabled{
      background-color: @base-color4;
    }
    &:active{
      background-color: @base-ycolor2;
    }
  }
.forgetbtn{
  text-align: right;
  margin-right:.25rem;
  a{
    font-size: @base-ftsize3;
    color:@base-color2;
  }
}
</style>
