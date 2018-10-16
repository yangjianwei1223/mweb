<template>
  <div>
    微信获取code的中转页面
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
export default {
  name: 'wxcode',
  data () {
    return {
      code: this.$route.query.code,
      state: this.$route.query.state
    }
  },
  mounted: function () {
    let model = {
      code: this.code
    }
    this.$http({
      url: apiport.WeiXin_GetOpenId,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('获取微信openid信息', res)
        console.log(this.state.indexOf('GoodsPay|'))
        // 支付页面
        if (this.state.indexOf('GoodsPay|') > -1) {
          let stateArr = this.state.split('|')
          if (stateArr.length > 1) {
            window.sessionStorage.setItem('MainOpenId', JSON.stringify(res.data.openId))
            // this.$router.push({path: '/Pay/GoodsPay', query: {id: stateArr[1], openId: res.data.openId}})
            window.location.href = '/Pay/GoodsPay?id=' + stateArr[1] + '&openId=' + res.data.openId
          } else {
            this.$router.push({path: '/My/BuyIn'})
          }
        } else if (this.state.indexOf('wxlogin') > -1) {
          // 关联页面
          this.$router.push({path: '/WeChat/LoginCenter', query: {openid: res.data.openId, access_token: res}})
          // end 关联页面
        }
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  }
}
</script>

<style scoped>

</style>
