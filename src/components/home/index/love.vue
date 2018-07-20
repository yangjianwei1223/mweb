<template>
    <section class="love-floor" v-if="ProductList">
      <div class="title">
        <i class="iconfont">&#xe699;</i> 猜你喜欢
      </div>
      <ul class="find-similar-ul">
        <li class="similar-li" v-for="(item,index) in ProductList" :key="index">
          <router-link :to='"productor/" + item.ProductBaseId'>
            <img v-lazy='item.ImgPath + "@!standard_square_m"' alt="">
            <div>
              <p class="title onelinetext">{{item.Title}}</p>
              <p class="detail" v-if="item.SaleType==3">
                押金 <span class="price">&yen;{{item.Price}}</span>
                <span class="fr">已领用{{item.Sales}}台</span>
              </p>
              <p class="detail" v-else>
                <span class="price">&yen;{{item.Price}}</span>
                <span class="fr">已售出{{item.Sales}}台</span>
              </p>
            </div>
          </router-link>
        </li>
      </ul>
    </section>
</template>

<script>
export default {
  props: ['ProductList']
}
</script>

<style lang="less" scoped>
@import '../../../assets/less/variable';
.love-floor{
  >.title{
    position: relative;
    color:@base-ycolor3;
    font-size:@base-ftsize1;
    margin: .4rem auto .2rem;
    text-align: center;
    &:before,&:after{
      content: '';
      position: absolute;
      top: .2rem;
      width: 1.8rem;
      height: 1px;
    }
    &:before{
      left:.75rem;
      background: -webkit-linear-gradient(left,#F2F2F2,#cdcdcd);
    }
    &:after{
      right:.75rem;
      background: -webkit-linear-gradient(left,#cdcdcd,#F2F2F2);
    }
  }
}
.find-similar-ul{
  overflow: hidden;
  .similar-li{
    float: left;
    width:50%;
    padding-bottom: 4px;
    box-sizing: border-box;
    &:nth-child(odd){
      padding-right:2px;
    }
    &:nth-child(2n){
      padding-left: 2px;
    }
    a{
      display:block;
      background-color: #fff;
      .title{
        padding:0 .2rem;
        font-size:@base-ftsize1;
        color:@base-color3;
        line-height: 2;
      }
      .detail{
        color:@base-color2;
        padding-left:.2rem;
        padding-bottom:.1rem;
        height: 16px;
        line-height: 16px;
        .price{
           color:@base-ycolor3;
        }
        .fr{
             padding-right:.2rem;
           }
      }
    }
  }
}
</style>
