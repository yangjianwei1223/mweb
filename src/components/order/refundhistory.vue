<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'

export default {
  name: 'ApplyRefund',
  components: {
    vHeader: head
  },
  data () {
    return {
      headinfo: {title: '申请退租'},
      refunddata: {}
    }
  },
  mounted () {
    let model = {
      OrderGoodsId: this.$route.params.id,
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Order_GetRefundByOrderGoodsId,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('申请退租', res.data)
        let data = res.data
        this.refunddata = data
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>

<style scoped>

</style>
