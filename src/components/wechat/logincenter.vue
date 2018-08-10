<template>
  <div>

  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
export default {
  name: 'logincenter',
  data () {
    return {
      access_token: this.$route.query.access_token,
      openid: this.$route.query.openid
    }
  },
  mounted () {
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
        console.log('微信关联登陆中心', res.data)
        // 登陆就是关联没登陆就是微信登陆
        this.Binding('1', this.openid, res.data.Token, res.data.access_token)
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
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('微信关联登陆中心', res.data)
          this.$router.push({path: '/My/Bindset'})
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
