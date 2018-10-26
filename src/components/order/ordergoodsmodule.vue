<template>
  <div class="order-cont toheader">
    <div class="item clearfix">
      <router-link class="goods" :to='goodsinfo.OrderType === 2 ? "/Order/ZulinDetail/" + goodsinfo.OrderBaseId : "/Order/BuyDetail/" + goodsinfo.OrderBaseId'>
        <div class="left">
          <img :src='goodsinfo.GoodsImgPath + "@!standard_square_s"'>
        </div>
        <div class="center">
          <p class="title">{{goodsinfo.GoodsTitle}}</p>
          <p class="style">{{goodsinfo.PropertyValue}}</p>
          <p class="style rentqx" v-if="goodsinfo.RentDetailId > 0">租用期限：{{goodsinfo.RentName}}-{{goodsinfo.RentAmount}}元</p>
        </div>
        <div class="right">
          <p>¥ {{goodsinfo.ActualPayMoney}}</p>
          <p class="thirdtext">×{{goodsinfo.GoodsQuantity}}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ordergoodsmodule',
  props: ['goodsinfo']
}
</script>

<style lang="less" scoped>
.order-cont{
  .goods{
    display: -webkit-box;
    display: flex;
    padding: .2rem 0;
    .left{
      width: 1.6rem;
      margin-left: .2rem;
      margin-right: .2rem;
      font-size: 0;
    }
    .center{
      -webkit-box-flex: 1;
      flex: 1;
      font-size: 12px;
      padding-right: .2rem;
      .title{
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        height: .8rem;
        line-height: .4rem;
      }
      .style{
        line-height: .3rem;
        min-height: .6rem;
        color: #9fa0a0;
        &.rentqx{
          color: #ff9c00;
        }
      }
    }
    .right{
      min-width: 1.4rem;
      margin-right: .2rem;
      text-align: right;
      position: relative;
    }
  }
}
</style>
