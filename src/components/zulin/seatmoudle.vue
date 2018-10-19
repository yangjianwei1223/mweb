<template>
  <li>
    <router-link :to='"/Seat/Detail/"+seatinfo.ProductBaseId' class="clearfix">
      <img class="lazyDetail" v-lazy='seatinfo.ImgPath+"@!standard_square_m"'>
      <p class="ptitle onelinetext">{{seatinfo.Title}}</p>
      <p class="rent">押金  <span>¥{{seatinfo.Price}}</span></p><p class="sum">已领用<span>{{seatinfo.Sales}}</span>台</p>
    </router-link>
  </li>
</template>

<script>
export default {
  props: ['seatinfo']
}
</script>

<style lang="less" scoped>
li{
  width: 50%;
  float: left;
  margin-top:.1rem;
  box-sizing:border-box;
  a{
    display:block;
    background-color: #fff;
  }
  img{
    height: 3.7rem;
    display: block;
  }
  .ptitle{
    padding:0 .2rem;
    font-size:13px;
    color:#333;
    line-height:2;
  }
  .rent{
    float:left;
    padding-left:.2rem;
    padding-bottom: .1rem;
    font-size:12px;
    color:#929292;
    width: 1.6rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    span{
      font-size:13px;
      color:#ff9c00;
    }
  }
  .sum{
    float: right;
    padding-right: .2rem;
    padding-bottom: .1rem;
    font-size: 10px;
    color: #929292;
    width: 1.6rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
  }
}
li:nth-child(2n){
  padding-left: .1rem;
}
</style>
