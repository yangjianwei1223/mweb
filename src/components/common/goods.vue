<template>
  <li class="goods-item">
    <router-link :to='goods.SaleType === 3 ? "/Seat/Detail/" + goods.ProductBaseId : "/Optimization/Detail/" + goods.ProductBaseId' class="clearfix">
      <img class="specialdetail_lazyload_img" :src=' goods.ImgPath + "@!standard_src_l"'>
      <p class="title">{{goods.Title}}</p>
      <p class="price"><span>&yen; {{goods.Price}}</span></p>
    </router-link>
  </li>
</template>

<script>
export default {
  props: ['goods']
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.goods-item{
  a{
    display: block;
    background-color: #fff;
    font-size: 0;
    img{
      height: 3.7rem;
    }
    .title{
      padding: 0 .2rem;
      font-size: 13px;
      color: #333;
      line-height: 2;
      .onelinetext()
    }
    .price{
      float: left;
      width: 1.6rem;
      font-size: 10px;
      color:#929292;
      padding-left: .2rem;
      padding-bottom: .1rem;
      .onelinetext();
      span{
        font-size: 13px;
        color: @base-ycolor3;
      }
    }
  }
}
</style>
