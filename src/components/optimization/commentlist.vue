<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <div v-infinite-scroll="infinite" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="_v-container">
      <commentitem :commentlist="commentlist"></commentitem>
    </div>
    <div v-if="showLoading" class="tips">{{tips}}</div>
  </div>
</template>

<script>
import Vue from 'vue'
import infiniteScroll from 'vue-infinite-scroll'
import qs from 'qs'
import apiport from '../../util/api'

import head from '@/components/common/header'
import commentitem from '@/components/common/commentitem'
// eslint-disable-next-line
import swiper from '../common/swiper'

Vue.use(infiniteScroll)
export default {
  name: 'commentlist',
  components: {
    commentitem,
    'vHeader': head
  },
  data () {
    return {
      headinfo: {title: '全部评论'},
      productid: this.$route.params.id,
      busy: false,
      showLoading: true,
      tips: '正在加载',
      pageindex: 0,
      pagesize: 20,
      commentlist: []
    }
  },
  mounted: function () {
  },
  methods: {
    infinite () {
      if (this.busy) {
        return
      }
      this.pageindex += 1
      this.busy = true
      let model = {
        InfomationType: 1,
        InfomationId: this.productid,
        PageIndex: this.pageindex,
        PageSize: this.pagesize
      }
      this.$http({
        url: apiport.CommentBase_GetList,
        method: 'post',
        // header:{
        //   "Content-Type":'application/x-www-form-urlencoded;charset=UTF-8'
        // },
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      }).then((res) => {
        console.log(1)
        console.log(res)
        this.commentlist = this.commentlist.concat(res.data.Data)
        if (res.data.Data.length === 20) {
          this.busy = false
        } else {
          this.tips = '已经到底了...'
        }
      }).catch((error) => {
        console.log(2)
        console.log(error)
        this.busy = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
._v-container{
  margin-top: 1rem;
  /deep/ .commentitem{
    background-color: #fff;
    margin-bottom: .2rem;
  }
}
.tips{
  text-align:center;
  line-height:50px;
}
</style>
