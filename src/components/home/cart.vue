<template>
  <div class="cart">
    <v-header :headinfo="headinfo" @rightbtn1click="editgoods"></v-header>
    <section class="order-cont">
      <ul class="order-list">
        <li class="item" v-for="(item, index) in ShoppingCartListIn" :key="index">
          <input type="hidden" class="ProductBaseId" :value="item.ProductBaseId">
          <input type="hidden" class="GoodsId" :value="item.GoodsId" valuenew="8051">
          <div class="line">
            <div class="mleft iconfont">&#xe66e;</div>
            <div class="left">
              <router-link :to='"/Optimization/Detail/"+item.GoodsId'>
                <img :src='item.GoodsImgPath + "@!standard_square_m"'>
              </router-link>
            </div>
            <div class="center" v-show="editstatus === 0">
              <router-link  :to='"/Optimization/Detail/" + item.GoodsId'>
                <p class="title">{{item.GoodsTitle}}</p>
                <p class="style">{{item.PropertyValue}}</p>
                <p><span class="price">¥{{item.GoodsPrice}}</span><span class="quantity">×{{item.GoodsQuantity}}</span></p>
              </router-link>
            </div>
            <div class="center edit" v-show="editstatus === 1">
              <div class="edit-quantity">
                <p class="minus">
                  <a class="sign-decrease ui-link">-</a>
                </p>
                <p class="edit-input">
                  <input oninput="Global_CommonHelper.CheckOnlyNumber(this, 10)" type="tel" data-role="none" value="1" data-max="15">
                </p>
                <p class="plus">
                  <a class="sign-plus ui-link">+</a>
                </p>
              </div>
              <div class="edit-sku">
                <p>{{item.PropertyValue}}</p>
                <div class="cart-del iconfont">&#xe68a;</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </section>
    <section class="order-cont invalid">
      <div class="topxl">已失效商品</div>
      <ul class="order-list">
        <li class="item" v-for="(item, index) in ShoppingCartListOut" :key="index">
          <input type="hidden" class="ProductBaseId" value="6170">
          <input type="hidden" class="cleargoods" value="7839">
          <div>
            <a data-action-url="/Optimization/Detail/6170" data-role="none" class="line cart-redirect-invalid" href="">
              <div class="mleft">
                <span>失效</span>
              </div>
              <div class="left">
                <img src="https://cdn.product.img.95laibei.com/171121112043156913.jpg@!standard_square_m">
              </div>
              <div class="center">
                <p class="title">大红嫁衣凤冠霞帔</p>
                <p class="style">测试：aaa；规格：103；</p>
                <p><span class="price">¥0.01</span><span class="quantity">×4</span></p>
              </div>
            </a>
          </div>
        </li>
      </ul>
      <div class="sxbtn">
        <button @click="update(1)">清空失效商品</button>
      </div>
    </section>
    <div class="cutpay">
      <section class="pay">
        <div id="js_as" class="mlf"><span class="iconfont">&#xe66e;</span>全选</div>
        <div v-show="editstatus === 0" class="lf">
            合计：<span>¥12.00</span>
            <i>(不含运费)</i>
        </div>
        <div v-show="editstatus === 0" class="rt">结算(0)</div>
        <div class="addfav" v-show="editstatus === 1">移入收藏夹</div>
        <div class="todelete" v-show="editstatus === 1">删除商品</div>
      </section>
    </div>
    <go-top></go-top>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'
export default {
  name: 'Cart',
  components: {
    vHeader: head,
    goTop: goTop
  },
  data () {
    return {
      headinfo: {title: '购物车', rightbtntext1: '编辑'},
      editstatus: 0,
      ShoppingCartListIn: [],
      ShoppingCartListOut: []
    }
  },
  mounted: function () {
    let model = {
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.ShoppingCart_GetMyList,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('购物车', res.data)
        this.ShoppingCartListIn = res.data.ShoppingCartListIn
        this.ShoppingCartListOut = res.data.ShoppingCartListOut
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  },
  methods: {
    editgoods () {
      if (this.editstatus === 0) {
        this.editstatus = 1
        this.headinfo.rightbtntext1 = '完成'
      } else {
        this.editstatus = 0
        this.headinfo.rightbtntext1 = '编辑'
      }
    },
    // 购物车删除失效
    update (type, list) {
      let model = {
        Token: this.$store.state.UserToken,
        Type: type,
        GoodBaseList: list
      }
      this.$http({
        url: apiport.ShoppingCart_Update,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('购物车更新', res.data)
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../assets/less/variable";
.order-cont{
  padding-top: 1rem;
  .order-list{
    .item{
      background-color: #fff;
      margin-bottom: .2rem;
      border-bottom: 1px solid #ededed;
      .line{
        display: flex;
        padding: .2rem 0;
        .mleft{
          font-size: 20px;
          line-height: 1.6rem;
          margin-left: .2rem;
          color: #c9caca;
        }
        .left{
          width: 1.6rem;
          margin-left: .2rem;
          margin-right: .2rem;
          font-size: 0;
        }
        .center{
          flex: 1;
          font-size: 12px;
          padding-right: .2rem;
          .title{
            height: .6rem;
            line-height: .3rem;
            .twolinetext
          }
          .style{
            line-height: .3rem;
            min-height: .6rem;
            color: @base-ycolor4;
          }
          .price{
            font-size: 16px;
            line-height: .4rem;
            color: @base-ycolor3;
          }
          .quantity{
            float: right;
          }
          .edit-quantity{
            display: flex;
            align-items: center;
            text-align: center;
            height: .8rem;
            line-height: .8rem;
            border-bottom: 1px solid #fff;
            .minus,.plus{
              font-size: 20px;
              width: .8rem;
              background-color: #F7F7F7;
            }
            .edit-input{
              flex: 1;
              margin: 0 .1rem;
              border-left: 1px solid #fff;
              border-right: 1px solid #fff;
              input{
                -webkit-appearance: none;
                border: none;
                background-color: #F7F7F7;
                text-align: center;
                width: 100%;
                height: .8rem;
              }
            }
          }
          .edit-sku{
            display: flex;
            margin-top: .2rem;
            height: .8rem;
            position: relative;
            p{
              overflow: hidden;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              display: -webkit-box;
              display: flex;
              word-break: break-all;
              word-wrap: break-word;
              flex: 3.5;
              background: #F7F7F7;
              padding: 0 .5rem 0 .2rem;
              text-overflow: ellipsis;
              line-height: .4rem;
              max-height: .8rem;
              box-sizing: border-box;
              &::after{
                font-family: iconfont;
                content: "\e609";
                display: inline-block;
                color: #333;
                position: absolute;
                right: 1rem;
                width: .5rem;
                line-height: .8rem;
                top: 0;
                bottom: 0;
                text-align: center;
              }
            }
            .cart-del{
              display: inline-block;
              flex: .9;
              color: #999;
              text-align: center;
              border-radius: 4px;
              font-size: 18px;
              line-height: .8rem;
              margin-left: .1rem;
            }
          }
        }
      }
    }
  }
  &.invalid{
    padding-top: 0;
    background-color: #fff;
    .topxl{
      display: -webkit-box;
      background-color: #efefef;
      color: #9fa0a0;
      padding-bottom: .2rem;
      -webkit-box-orient: vertical;
      -webkit-box-align: center;
    }
    .order-list .item .line{
      .mleft{
        margin-left: .1rem;
        span{
          font-size: 12px;
          background-color: #c9caca;
          padding: 2px 6px;
          color: #fff;
          border-radius: 10px;
        }
      }
      .left{
        margin-left: .1rem;
      }
    }
    .sxbtn{
      text-align: center;
      padding: .5rem 0;
      button{
        background-color: #fff;
        color: #ff4965;
        border: 1px solid #ff4965;
        border-radius: 6px;
        padding: 4px 10px;
        line-height: 1;
      }
    }
  }
}
.cutpay{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  .pay{
    display: flex;
    background-color: #fff;
    line-height: 1rem;
    border-top: 1px solid #dcdddd;
    .mlf{
      padding: 0 .2rem;
      span{
        font-size: 18px;
        margin-right: 6px;
        vertical-align: middle;
      }
    }
    .lf{
      display:block;
      flex: 1;
      text-align: right;
      margin-right: .2rem;
      span{
        color:@base-ycolor3;
      }
      i{
        font-style: normal;
        font-size: 12px;
        color: #9fa0a0;
      }
    }
    .rt{
      padding: 0 .3rem;
      color: #fff;
      background-color: @base-ycolor3;
    }
    .addfav{
      margin-left: 1.7rem;
      margin-right: .2rem;
      width: 2rem;
      border: 1px solid currentColor;
      border-radius: 20px;
      height: .65rem;
      line-height: .65rem;
      margin-top: .17rem;
      text-align: center;
      color: #333;
      font-size: 15px;
      box-sizing: border-box;
    }
    .todelete{
      margin-right: .2rem;
      border-radius: 20px;
      height: .65rem;
      line-height: .65rem;
      margin-top: .17rem;
      text-align: center;
      width: 1.8rem;
      font-size: 15px;
      box-sizing: border-box;
      padding: 0;
      color: #fff;
      background-color: #ff9c00;
    }
  }
}
</style>
