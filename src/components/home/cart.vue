<template>
  <div class="cart">
    <v-header :headinfo="headinfo" @rightbtn1click="editgoods"></v-header>
    <section class="order-cont">
    <ul class="order-list">
      <li>
        <div class="item">
          <input type="hidden" class="ProductBaseId" value="6310">
          <input type="hidden" class="GoodsId" value="8051" valuenew="8051">
          <div class="line">
            <div class="mleft iconfont CartGoodsItem textcolorr" data-goodsid="8051" data-productid="6310">&#xe66e;</div>
            <div class="left">
              <a data-action-url="/Optimization/Detail/6310" data-role="none" class="cart-redirect" href="">
                <img src="https://cdn.product.img.95laibei.com/171212161038670576.jpg@!standard_square_m">
              </a>
            </div>
            <div class="center" style="display: none;">
              <a data-action-url="/Optimization/Detail/6310" data-role="none" class="cart-redirect" href="">
                <p>11111111111</p>
                <p class="style thirdtext">规格：大规格；款式：红色款式；</p>
                <p><span class="textcolorr price">¥12</span><span class="quantity" style="float:right">×1</span></p>
              </a>
            </div>
            <div class="center edit" style="display: block;">
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
                <p>规格：大规格；款式：红色款式；</p>
                <div class="cart-del iconfont">&#xe68a;</div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="invalid">
      <div class="topxl">已失效商品</div>
      <div class="item borderbottom">
        <input type="hidden" class="ProductBaseId" value="6170">
        <input type="hidden" class="cleargoods" value="7839">
        <div>
          <a data-action-url="/Optimization/Detail/6170" data-role="none" class="cart-redirect-invalid" href="">
            <div class="mleft sx">
              <span>失效</span>
            </div>
            <div class="left">
              <img src="https://cdn.product.img.95laibei.com/171121112043156913.jpg@!standard_square_m">
            </div>
            <div class="center">
              <p>大红嫁衣凤冠霞帔</p>
              <p class="style thirdtext">测试：aaa；规格：103；</p>
              <p><span class="textcolorr">¥0.01</span><span style="float:right">×4</span></p>
            </div>
          </a>
        </div>
      </div>
      <div class="sxbtn">
        <a id="clear" class="ui-link">清空失效商品</a>
      </div>
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
      editstatus: 0
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../assets/less/variable";
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
