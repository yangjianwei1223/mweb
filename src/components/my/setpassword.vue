<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="accountbox">
        <div class="accountline">
            <div class="borderbottom paddingleftp">
                <span>新密码</span>
                <input type="password" v-model="newpassword" value="" maxlength="16" placeholder="请输入新密码">
            </div>
        </div>
        <div class="accountline">
            <div class="paddingleftp">
                <span>确认密码</span>
                <input type="password" v-model="password" value="" maxlength="16" placeholder="请确认密码">
            </div>
        </div>
    </section>
    <button class="loginbtn">确定</button>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
export default {
  name: 'setpassword',
  components: {
    'vHeader': head
  },
  data () {
    return {
      headinfo: {title: '设置密码'},
      newpassword: '',
      password: ''
    }
  },
  mounted: function () {
  },
  methods: {
    setPassword: function () {
      if (!this.password || !this.newpassword || this.newpassword !== this.password) {
        alert('密码出错')
        return
      }
      let model = {
        Token: this.$store.state.UserToken,
        Password: this.password
      }
      this.$http({
        url: apiport.Account_SetPassword,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('设置密码', res.data)
          // 登陆就是关联没登陆就是微信登陆
          this.$router.back()
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
