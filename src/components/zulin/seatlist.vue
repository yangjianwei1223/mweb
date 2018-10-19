<template>
  <div>
    <v-header :headinfo="headinfo"  @rightbtn1click="skipchat"></v-header>
    <div v-infinite-scroll="infinite" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="_v-container">
      <ul class="dbitem clearfix">
        <seatmoudle v-for="(item,index) in zulinlist" :key="index" :seatinfo="item"></seatmoudle>
      </ul>
      <div tip="正在加载" class="tips">{{tips}}</div>
    </div>
    <go-top></go-top>
  </div>
</template>

<script>
import Vue from 'vue'
import qs from 'qs'
import infiniteScroll from 'vue-infinite-scroll'
import apiport from '../../util/api'
import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'
import seatmoudle from './seatmoudle'

Vue.use(infiniteScroll)
export default {
  name: 'zulinlist',
  components: {
    'vHeader': head,
    goTop,
    seatmoudle
  },
  data () {
    return {
      headinfo: {'title': '低押金超值租', rightbtntext1: '&#xe67a;'},
      busy: false,
      page: 0,
      tips: '正在加载',
      zulinlist: [],
      type: 1
    }
  },
  mounted () {
    this.type = this.$route.params.id === 'long' ? 2 : 1
    this.headinfo.title = this.$route.params.id === 'long' ? '座椅0元租' : '低押金超值租'
  },
  methods: {
    infinite () {
      this.page += 1
      this.busy = true
      let model = {
        pageIndex: this.page,
        pageSize: 20,
        type: this.type
      }
      this.$http({
        url: apiport.Product_GetZulinList,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log(res)
          if (res.data.Data.length > 0) {
            this.zulinlist = this.zulinlist.concat(res.data.Data)
            this.busy = false
          } else {
            this.tips = '已经到底了...'
            this.busy = true
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    skipchat () {
      this.$router.push('/wechat/im')
    }
  }
}
</script>

<style scoped>
._v-container{
  margin-top: 1rem;
}
.tips{
  text-align:center;
  line-height:50px;
  margin-bottom:50px;
}
</style>
