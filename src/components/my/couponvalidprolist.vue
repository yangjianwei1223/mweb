<template>
  <div>
    <v-header :headnfo='headinfo'></v-header>
    <go-top></go-top>
  </div>
</template>

<script>
import Vue from 'vue'
import qs from 'qs'
import apiport from '../../util/api'
import infiniteScroll from 'vue-infinite-scroll'
import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'
Vue.use(infiniteScroll)

export default {
  name: 'CouponValidProList',
  components: {
    vHeader: head,
    goTop: goTop
  },
  data () {
    return {
      headinfo: {title: '优惠活动'},
      currentPageIndex: 0,
      pageSize: 20,
      busy: false,
      showLoading: true,
      tips: '正在加载'
    }
  },
  methods: {
    infinite () {
      this.currentPageIndex += 1
      this.busy = true
      let getlisturl = apiport.Order_GetMyList
      if (this.OrderState === 4) {
        getlisturl = apiport.Order_GetMyRefundList
      }
      let model = {
        Token: this.$store.state.UserToken,
        OrderType: 2,
        OrderState: this.OrderState,
        pageIndex: this.currentPageIndex,
        pageSize: this.pageSize
      }
      this.$http({
        url: getlisturl,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('优惠活动', res.data)
          if (res.data.Data.length > 0) {
            this.orderlist = this.orderlist.concat(res.data.Data)
            this.busy = false
          } else {
            this.tips = '已经到底了...'
            this.busy = true
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
