<template>
  <div class="seatfooter">
    <a class="act-item comment-btn"><i class="iconfont">&#xe65f;</i><span class="comment-num">客服</span></a>
    <a class="act-item share">
      <i class="iconfont">&#xe61f;</i><span class="like-num">分享</span>
    </a>
    <a id="aPraise" class="act-item like-btn" @click="productpraise" >
      <i class="collect" :class="footdata.IsCurrentUserPraise ? 'likeicon' : 'unlikeicon'"></i><span class="like-num" v-html="footdata.Praisecount < 1 ? '收藏' : footdata.Praisecount"></span>
    </a>
    <a href="javascript:;" @click="isopensku" class="act-item buybtn" v-if="footdata.SaleType!==1">立即租赁</a>
    <template v-else>
      <a @click="isopensku('cart')" class="act-item cartbtn">加入购物车</a>
      <a @click="isopensku" class="act-item buybtn">立即购买</a>
    </template>
</div>
</template>

<script>
export default {
  name: 'detailfooter',
  props: ['footdata'],
  methods: {
    isopensku: function (type) {
      let isopen = !this.$store.state.opensku
      this.$store.commit('OPEN_SKU', isopen)
      this.$emit('getGoodspro', {params: type})
    },
    productpraise: function () {
      this.$emit('clickpraise')
    }
  }
}
</script>

<style lang="less" scoped>
.seatfooter{
  position: fixed;
  left: 0;
  right: 0;
  bottom: -1px;
  width: 100%;
  z-index: 1000;
  display: flex;
  border-top: 1px solid #ededed;
  .act-item{
    display: -webkit-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    line-height: 1;
    height: 1rem;
    -webkit-box-flex: 1;
    flex: 1;
    color: #9fa0a0;
    background-color: #fff;
    border: none;
    margin: 0;
    padding: 0;
    font-size: 14px;
    span{
      font-size: 12px;
    }
    .iconfont{
      font-size: 18px;
      margin-bottom: 2px;
    }
    &.comment-btn,&.share{
      border-right: 1px solid #dcdddd;
      border-radius: 0;
    }
    .likeicon{
      background: url(http://cdn.sys.img.95laibei.com/Content/Images/collect_1.png) no-repeat center;
      background-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 2px;
    }
    .unlikeicon{
      background: url(https://cdn.sys.img.95laibei.com/Content/Images/uncollect.png) no-repeat center;
      background-size: 16px;
      width: 16px;
      height: 16px;
      margin-bottom: 2px;
    }
    &.cartbtn{
      flex: 2;
      background-color: #434343;
      color: #fff;
      border-radius: 0;
      border: none;
    }
    &.buybtn{
      background-color: #ff9c00;
      color: #fff;
      border-radius: 0;
      border: none;
      text-align: center;
      flex: 2;
    }
  }
}
</style>
