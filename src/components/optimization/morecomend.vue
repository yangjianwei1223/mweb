<template>
    <div>
        <div class="headimg">
            <span>更多精选商品</span>
        </div>
        <ul class="dbitem clearfix">
            <li v-for="(item,index) in ListOtherProducts" :key="index">
            <router-link :to='"/Optimization/Detail/"+item.ProductBaseId' class="clearfix">
                <img class="lazyDetail" v-lazy='item.ImgPath+"@!standard_square_m"' :key="item.ProductBaseId">
                <p class="ptitle twolines-ellipsis">{{item.Title}}</p>
                <p class="price optimization-list-category-price">¥ {{item.Price}}</p>
            </router-link>
            </li>
        </ul>
        <div class="sole">
            <span>已经到底了</span>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
import qs from 'qs'
import apiport from '../../util/api'
export default {
    name: 'morecommendproductsonoptimdetail',
    data () {
        return {
            ListOtherProducts: []
        }
    },
    methods:{
        gotRelatedProducts: function() {
            let model1 = {
                ProductBaseId: this.$route.params.id,
                GetCount: 8
            }
            this.$http({
                url: apiport.Product_GetMoreList,
                method: 'post',
                data: qs.stringify({ reqJson: JSON.stringify(model1) })
            }).then((res) => {
                this.ListOtherProducts = res.data.Data
            })
        }
    },
    created: function(){
        this.gotRelatedProducts()
    },
      watch: {
        '$route' (to, from) {
            this._data.ListOtherProducts = []
            this.gotRelatedProducts()
        }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/less/variable";
.headimg{
  position: relative;
  width: 100%;
  margin: 0 auto;
  color: #333;
  font-size: 16px;
  text-align: center;
  line-height: .8rem;
  height: .8rem;
  &::before{
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #dedddd;
    top: .4rem;
  }
  span{
    position: relative;
    line-height: .8rem;
    padding: 0 .4rem;
    background-color: #efefef;
  }
}
.dbitem{
  margin: 0;
  padding: 0 .1rem;
  font-size: 0;
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .optimization-list-category-price{
      padding: 0 .2rem;
      font-size: 13px;
      color: #ff9c00;
    }
  }
  li:nth-child(2n){
    padding-left: .1rem;
  }
}
.sole{
  margin-bottom:.4rem;
  height:.4rem;
  line-height:.4rem;
  border-bottom:1px solid #dedddd;
  text-align:center;
  span{
  display:inline-block;
  line-height:.8rem;
  padding:0 .4rem 1.2rem;
  background-color:#efefef;
  font-size:12px;
  color:#9fa0a0;
  }
}
</style>
