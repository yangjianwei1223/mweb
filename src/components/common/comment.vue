<template>
  <section class="order-comment" v-if="commentlist.length>0">
    <h3>宝贝评价
      <router-link v-if="total>1" :to='"/Optimization/CommentList/" + ProductBaseId'>查看全部
        <span class="iconfont ">&#xe61e;</span>
      </router-link>
    </h3>
    <section class="mmcomment">
      <commentitem :commentlist="commentlist"></commentitem>
    </section>
  </section>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'

import commentitem from '@/components/common/commentitem'
export default {
  name: 'comment',
  props: ['ProductBaseId'],
  components: {
    commentitem
  },
  data () {
    return {
      commentlist: [],
      total: 0
    }
  },
  mounted: function () {
    console.log(this.ProductBaseId)
    let model = {
      InfomationType: 1,
      InfomationId: this.ProductBaseId,
      PageIndex: 1,
      PageSize: 1
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
      this.commentlist = res.data.Data
      this.total = res.data.Total
    }).catch((error) => {
      console.log(2)
      console.log(error)
    })
  }
}
</script>

<style lang="less" scoped>
.order-comment{
  background-color: #fff;
  h3{
    height: .8rem;
    line-height: .8rem;
    padding: 0 .2rem;
    border-bottom: 1px solid #f2f2f2;
    font-size: 14px;
    color: #333;
    margin-bottom: .2rem;
    a{
      float: right;
      text-align: right;
      color: #666;
      font-size: 12px;
      span{
        float: right;
        width: auto;
        margin-left: .2rem;
        color: #cbcbcb;
        font-size: 12px;
        line-height: .8rem;
        text-align: right;
      }
    }
  }
  .mmcomment {
    margin-bottom: .2rem;
  }
}
</style>
