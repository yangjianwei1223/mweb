<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
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
  name: 'optimizationlist',
  components: {
    vHeader: head,
    goTop: goTop
  },
  data () {
    return {
      headinfo: {title: '母婴用品'},
      currentPageIndex: 0,
      pageSize: 20,
      busy: false,
      showLoading: true,
      tips: '正在加载'
    }
  },
  mounted () {
    console.log('母婴用品')
    let model = {
      Token: this.$store.state.UserToken,
      OrderType: 2,
      OrderState: this.OrderState,
      pageIndex: this.currentPageIndex,
      pageSize: this.pageSize
    }
    this.$http({
      url: apiport.Product_GetProductListByCategory,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('母婴分类', res.data)
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
