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
  name: 'buyin',
  components: {
    vHeader: head
  },
  data () {
    return {
      headinfo: {title: '我的订单'},
      OrderState: 0,
      cunrrentPageIndex: 1,
      pageSize: 20
    }
  },
  mounted: function () {
    let model = {
      Token: this.$store.state.UserToken,
      OrderType: 1,
      OrderState: this.OrderStatus,
      pageIndex: this.cunrrentPageIndex,
      pageSize: this.pageSize
    }
    this.$http({
      url: apiport.Order_GetMyList,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('我买到的', res.data)
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
</style>
