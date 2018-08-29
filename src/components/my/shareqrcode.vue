<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <div class="wrap"><img :src="src" alt=""></div>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'

export default {
  name: 'share',
  components: {
    vHeader: head
  },
  data () {
    return {
      headinfo: {title: '我的二维码'},
      src: ''
    }
  },
  mounted: function () {
    let model = {
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Account_GetBaseByToken,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('登陆信息', res.data)
        this.src = 'https://mweb.95laibei.com/QRCode/GenerateMyPromoterImg?mbrIconUrl=' + res.data.FaceImage + '&mbrNickname=' + res.data.Nickname + '&tgCode=' + res.data.InvitationCode
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  }
}
</script>

<style lang="less" scoped>
.wrap{
  position:absolute;
  top:1rem;
  bottom:0;
  left: 0;
  width:100%;
  background-color: #fff;
  overflow-y: auto;
}
</style>
