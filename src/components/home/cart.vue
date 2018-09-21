<template>
  <div class="cart">
    <v-header :headinfo="headinfo" @rightbtn1click="editgoods"></v-header>
    <section class="order-cont">
      <ul class="order-list">
        <li class="item" v-for="(item, index) in ShoppingCartListIn" :key="index">
          <div class="line">
            <div class="mleft iconfont" @click="choosegoods($event, index)" :data-goodsid='item.GoodsId' :data-productid='item.ProductBaseId'>&#xe66e;</div>
            <div class="left">
              <router-link :to='"/Optimization/Detail/"+item.ProductBaseId'>
                <img :src='item.GoodsImgPath + "@!standard_square_m"'>
              </router-link>
            </div>
            <div class="center" v-show="editstatus === 0">
              <router-link  :to='"/Optimization/Detail/" + item.ProductBaseId'>
                <p class="title">{{item.GoodsTitle}}</p>
                <p class="style">{{item.PropertyValue}}</p>
                <p>
                  <span class="price">¥{{item.GoodsPrice}}</span>
                  <span class="buylimit-cart" v-if="item.LimitedCount>0">限购{{item.LimitedCount}}件</span>
                  <span class="quantity">×{{item.GoodsQuantity}}</span>
                </p>
              </router-link>
            </div>
            <div class="center edit" v-show="editstatus === 1">
              <div class="edit-quantity">
                <p class="minus">
                  <a href="javascript:;" class="sign-decrease" @click='signdecrease("gt" + item.GoodsId)'>-</a>
                </p>
                <p class="edit-input">
                  <input type="tel" :value="item.GoodsQuantity" :data-max="item.StockQuentity" :ref='"gt" + item.GoodsId' @input='quantityinput("gt" + item.GoodsId)'>
                </p>
                <p class="plus">
                  <a href="javascript:;" class="sign-plus" @click='signplus("gt" + item.GoodsId)'>+</a>
                </p>
              </div>
              <div class="edit-sku">
                <p @click="opensku(item.ProductBaseId, item.GoodsId)">{{item.PropertyValue}}</p>
                <div class="cart-del iconfont" @click="Deletecartgoods(item.GoodsId)">&#xe68a;</div>
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
          <div>
            <router-link :to='"/Optimization/Detail/" + item.GoodsId' class="line cart-redirect-invalid">
              <div class="mleft">
                <span>失效</span>
              </div>
              <div class="left">
                <img :src='item.GoodsImgPath + "@!standard_square_m"'>
              </div>
              <div class="center">
                <p class="title">{{item.GoodsTitle}}</p>
                <p class="style">{{item.PropertyValue}}</p>
                <p><span class="price">¥{{item.GoodsPrice}}</span><span class="quantity">×{{item.GoodsQuantity}}</span></p>
              </div>
            </router-link>
          </div>
        </li>
      </ul>
      <div class="sxbtn">
        <button @click="update(1)">清空失效商品</button>
      </div>
    </section>
    <div class="cutpay">
      <section class="pay">
        <div id="js_as" class="mlf" @click="chooseallgoods($event)"><span class="iconfont">&#xe66e;</span>全选</div>
        <div v-show="editstatus === 0" class="lf">
            合计：<span>¥{{SumOrderMoney}}</span>
            <i>(不含运费)</i>
        </div>
        <div v-show="editstatus === 0" class="rt" @click="MergePayment">结算({{SumOrderNum}})</div>
        <div class="addfav" v-show="editstatus === 1" @click="batchcollect">移入收藏夹</div>
        <div class="todelete" v-show="editstatus === 1" @click="batchdeletegoods">删除商品</div>
      </section>
    </div>
    <section class="popupmask" v-show="isopensku" @click="maskclosesku">
      <div class="goodstype">
        <div class="back iconfont" @click="closesku">&#xe665;</div>
        <div class="title clearfix">
          <div class="left"><img :src='skugoodsimg + "@!standard_square_m"'></div>
          <div class="right">
            <div class="top">{{skugoodstitle}}</div>
            <div class="bottom price"><span id="ProductGoodsPrice">¥ {{goodsPrice}}</span><i id="GoodsStockQuentity">&nbsp;&nbsp;库存：{{totalStockQuentity}}件</i></div>
          </div>
          <div style="clear:both"></div>
        </div>
        <div id="SalePropertyList" class="SalePropertyList">
          <div class="type" v-for="(item, index) in SalePropertyList" :key="index">
            <h1>{{item.DisplayName}}</h1>
            <ul>
              <li v-for="(item1, index1) in item.ItemList" :key="index1" v-if="item1.Status" @click="checkprops(item,item1,index1)" :class="{checked:item.ItemList.length===1 || item1.state===1,styledisabled:item1.state === 2}" :data-propertyid="item1.PropertyId" :data-propertyitemid="item1.PropertyItemId">{{item1.PropertyValue}}</li>
            </ul>
          </div>
        </div>
        <div class="buybtnwrap">
          <a href="javascript:;" @click="gotoorder">确定</a>
        </div>
      </div>
    </section>
    <go-top></go-top>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'
import storage from '../../util/storage'
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
      ShoppingCartListOut: [],
      SumOrderMoney: 0.00,
      SumOrderNum: 0,
      isopensku: false,
      skugoodsimg: '',
      skugoodstitle: '',
      goodsPrice: 0,
      totalStockQuentity: 0,
      SalePropertyList: [],
      currentskugoodsid: 0
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
    },
    choosegoods (ele, index) {
      if (ele.target.getAttribute('class') === 'mleft iconfont') {
        ele.target.setAttribute('class', 'mleft iconfont textcolorr')
        ele.target.innerHTML = '&#xe605;'
        this.SumOrderNum += this.ShoppingCartListIn[index].GoodsQuantity
        this.SumOrderMoney = (parseFloat(this.SumOrderMoney) + this.ShoppingCartListIn[index].GoodsPrice * this.ShoppingCartListIn[index].GoodsQuantity).toFixed(2)
      } else {
        ele.target.setAttribute('class', 'mleft iconfont')
        ele.target.innerHTML = '&#xe66e;'
        this.SumOrderNum -= this.ShoppingCartListIn[index].GoodsQuantity
        this.SumOrderMoney = (parseFloat(this.SumOrderMoney) - this.ShoppingCartListIn[index].GoodsPrice * this.ShoppingCartListIn[index].GoodsQuantity).toFixed(2)
      }
    },
    chooseallgoods (ele) {
      let checkallarrow = ele.currentTarget.children[0]
      let _that = this
      if (checkallarrow.getAttribute('class') === 'iconfont') {
        checkallarrow.setAttribute('class', 'iconfont textcolorr')
        checkallarrow.innerHTML = '&#xe605;'
        document.querySelectorAll('.order-list .mleft.iconfont').forEach(function (ele, index) {
          ele.setAttribute('class', 'mleft iconfont textcolorr')
          ele.innerHTML = '&#xe605;'
        })
        _that.SumOrderNum = 0
        _that.SumOrderMoney = 0
        _that.ShoppingCartListIn.forEach(function (ele1, index1) {
          _that.SumOrderNum += ele1.GoodsQuantity
          _that.SumOrderMoney += ele1.GoodsPrice * ele1.GoodsQuantity
        })
        _that.SumOrderMoney = _that.SumOrderMoney.toFixed(2)
      } else {
        checkallarrow.setAttribute('class', 'iconfont')
        checkallarrow.innerHTML = '&#xe66e;'
        document.querySelectorAll('.order-list .mleft.iconfont').forEach(function (ele, index) {
          ele.setAttribute('class', 'mleft iconfont')
          ele.innerHTML = '&#xe66e;'
        })
        _that.SumOrderNum = 0
        _that.SumOrderMoney = 0
      }
    },
    MergePayment () {
      if (this.SumOrderNum === 0) {
        return true
      } else {
        let goodslist = ''
        document.querySelectorAll('.order-list .mleft.textcolorr').forEach(function (ele, index) {
          goodslist += ele.dataset.goodsid + ','
        })
        storage.setSession(goodslist, 'ShoppingCartGoodsIds')
        this.$router.push('/Order/Confirm')
      }
    },
    signdecrease (ele) {
      let amountele = this.$refs[ele][0]
      let currentval = parseInt(amountele.value)
      if (currentval > 1) {
        amountele.value--
      }
    },
    signplus (ele) {
      let amountele = this.$refs[ele][0]
      let maxamount = parseInt(amountele.dataset.max)
      let currentval = parseInt(amountele.value)
      if (currentval < maxamount) {
        amountele.value++
      }
    },
    quantityinput (ele) {
      let amountele = this.$refs[ele][0]
      let maxamount = parseInt(amountele.dataset.max)
      let currentval = parseInt(amountele.value)
      if (currentval > maxamount) {
        amountele.value = maxamount
      } else if (currentval < 1) {
        amountele.value = 1
      }
    },
    Deletecartgoods (goodsids) {
      let model = {
        Token: this.$store.state.UserToken,
        Type: 1,
        GoodBaseList: goodsids
      }
      this.$http({
        url: apiport.ShoppingCart_Update,
        method: 'post',
        data: qs.stringify({reqJson: JSON.stringify(model)})
      })
        .then(res => {
          if (res.data.ResultNo === '00000000') {
            let goodsidArr = goodsids.toString().split(';')
            let _that = this
            for (let i = 0; i < goodsidArr.length; i++) {
              for (let j = _that.ShoppingCartListIn.length - 1; j >= 0; j--) {
                if (parseInt(goodsidArr[i]) === _that.ShoppingCartListIn[j].GoodsId) {
                  _that.ShoppingCartListIn.splice(j, 1)
                }
              }
            }
            let checkedgoods = document.querySelectorAll('.mleft.iconfont.textcolorr')
            checkedgoods.forEach(function (item) {
              item.setAttribute('class', 'mleft iconfont')
              item.innerHTML = '&#xe66e'
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    batchdeletegoods () {
      let checkedgoods = document.querySelectorAll('.mleft.iconfont.textcolorr')
      let goodsArr = ''
      checkedgoods.forEach(function (item) {
        goodsArr += item.dataset.goodsid + ';'
      })
      this.Deletecartgoods(goodsArr)
    },
    batchcollect () {
      let checkedgoods = document.querySelectorAll('.mleft.iconfont.textcolorr')
      let goodsArr = ''
      let productArr = ''
      checkedgoods.forEach(function (item) {
        goodsArr += item.dataset.goodsid + ';'
        productArr += item.dataset.productid + ','
      })
      let model = {
        Token: this.$store.state.UserToken,
        productIds: productArr
      }
      this.$http({
        url: apiport.Product_BatchPraise,
        method: 'post',
        data: qs.stringify({reqJson: JSON.stringify(model)})
      })
        .then(res => {
          if (res.data.ResultNo === '00000000') {
            this.Deletecartgoods(goodsArr)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    maskclosesku (e) {
      if (e.target.tagName === 'SECTION') {
        this.isopensku = false
      }
    },
    closesku () {
      this.isopensku = false
    },
    checkprops (pitem, item, index) {
      console.log(pitem)
      if (item.state === 2) {
        return true
      } else if (item.state === 1) {
        item.state = 0
      } else {
        let checkCode = pitem.Code
        for (let i = 0; i < this.SalePropertyList.length; i++) {
          // 同一属性值单选
          if (this.SalePropertyList[i].Code === checkCode) {
            for (let j = 0; j < this.SalePropertyList[i].ItemList.length; j++) {
              this.SalePropertyList[i].ItemList[j].state = 0
            }
            item.state = 1
          }
          // 同一属性值单选 end
        }
      }
      // 库存为0 的sku不让点
      this.$nextTick(function () {
        let _that = this
        _that.SalePropertyList.forEach(function (item, index) {
          item.ItemList.forEach(function (item1, index1) {
            let totalItemStockQuentity = 0
            _that.GoodsBaseList.forEach(function (item2, index2) {
              let IsCurrenType = true
              item2.GoodsTypeItemList.forEach(function (item3, index3) {
                if (item1.PropertyId === item3.PropertyId) {
                  if (item1.PropertyItemId !== item3.PropertyItemId) {
                    IsCurrenType = false
                    return true
                  }
                } else {
                  let checkEle = document.querySelectorAll('#SalePropertyList li.checked')
                  checkEle.forEach(function (ele, index4) {
                    let chkPropertyId = parseInt(ele.dataset.propertyid)
                    let chkPropertyItemId = parseInt(ele.dataset.propertyitemid)
                    if (item3.PropertyId === chkPropertyId && item3.PropertyItemId !== chkPropertyItemId) {
                      IsCurrenType = false
                      return true
                    }
                  })
                }
              })
              IsCurrenType && (totalItemStockQuentity += item2.StockQuentity)
            })
            if (totalItemStockQuentity === 0) {
              item1.state = 2
            } else {
              item1.state === 1 || (item1.state = 0)
            }
          })
        })
        // 所有属性值选择完成，切换商品图片和标题等相关数据
        this.propertvalueInit()
      })
    },
    propertvalueInit () {
      // 所有属性值选择完成，切换商品图片和标题等相关数据
      let _that = this
      if (document.querySelectorAll('#SalePropertyList li.checked').length === this.SalePropertyList.length) {
        _that.GoodsBaseList.forEach(function (item, index) {
          let IsCurrenType = true
          item.GoodsTypeItemList.forEach(function (item1, index1) {
            document.querySelectorAll('#SalePropertyList li.checked').forEach(function (ele, index2) {
              let chkPropertyId = parseInt(ele.dataset.propertyid)
              let chkPropertyItemId = parseInt(ele.dataset.propertyitemid)
              if (item1.PropertyId === chkPropertyId && item1.PropertyItemId !== chkPropertyItemId) {
                IsCurrenType = false
                return true
              }
            })
          })
          if (IsCurrenType) {
            console.log(item.ImgPath)
            _that.skugoodsimg = item.ImgPath
            _that.skugoodstitle = item.Title
            _that.totalStockQuentity = item.StockQuentity
            _that.skubaseid = item.GoodsBaseId
            console.log('dijigesku', index)
          }
        })
        console.log('已选长度')
      }
    },
    gotoorder () {
      if (document.querySelectorAll('#SalePropertyList li.checked').length === this.SalePropertyList.length) {
        this.closesku()
        if (this.SaleType === 1) {
          if (document.getElementById('cartorbuybtn').innerHTML === '我想要') {
            this.$router.push('/Order/confirm/' + this.skubaseid)
          }
        } else {
          this.$router.push('/Order/ZulinConfirm/' + this.skubaseid)
        }
      } else {
        alert('请选择合适的规格')
      }
    },
    opensku (id, skuid) {
      this.isopensku = true
      if (this.currentskugoodsid === id) {
        return true
      }
      this.skugoodstitle = ''
      this.goodsPrice = 0
      this.totalStockQuentity = 0
      this.SalePropertyList = []
      this.currentskugoodsid = id
      let model = {
        ProductBaseId: id
      }
      this.$http({
        url: apiport.Goods_GetBaseListByProductId,
        method: 'post',
        data: qs.stringify({reqJson: JSON.stringify(model)})
      })
        .then(res => {
          console.log('购物车商品sku', res.data)
          let checksku = res.data.GoodsBaseList.filter(function (item) {
            return item.GoodsBaseId === skuid
          })
          for (let i = 0; i < res.data.SalePropertyList.length; i++) {
            for (let j = 0; j < res.data.SalePropertyList[i].ItemList.length; j++) {
              for (let k = 0; k < checksku[0].GoodsTypeItemList.length; k++) {
                if (checksku[0].GoodsTypeItemList[k].PropertyId === res.data.SalePropertyList[i].ItemList[j].PropertyId && checksku[0].GoodsTypeItemList[k].PropertyItemId === res.data.SalePropertyList[i].ItemList[j].PropertyItemId) {
                  res.data.SalePropertyList[i].ItemList[j].state = 1
                } else {
                  res.data.SalePropertyList[i].ItemList[j].state = 0
                }
              }
            }
          }
          this.skugoodsimg = checksku[0].ImgPath
          this.skugoodstitle = checksku[0].Title
          this.goodsPrice = checksku[0].Price
          this.totalStockQuentity = checksku[0].StockQuentity
          this.SalePropertyList = res.data.SalePropertyList
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../assets/less/variable";
.cart{
  padding-bottom: 1rem;
}
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
          &.textcolorr{
            color: @base-ycolor3;
          }
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
          .buylimit-cart{
            margin-left: .2rem;
            font-size: 9px;
            color: #fff;
            background: #f1bc19;
            border-radius: 15px;
            padding: 0px 6px;
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
      .textcolorr{
        color: @base-ycolor3;
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
// poppup sku style
.popupmask{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(122,122,122,0.3);
  z-index: 1001;
}
.goodstype {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding-top: .2rem;
  box-sizing: border-box;
  .back{
    position: absolute;
    right: .1rem;
    top: .1rem;
    font-size: 24px;
    color: #ccc;
    font-weight: 700;
    z-index: 22;
  }
  .title{
    padding-bottom: .2rem;
    border-bottom: 1px solid #ededed;
    .type{
      padding-bottom: 0;
    }
    .left{
      float: left;
      width: 1.5rem;
      margin-left: .2rem;
      font-size: 0;
    }
    .right{
      margin-left: 2rem;
      height: 1.5rem;
      position: relative;
      .top{
        font-size: 16px;
        line-height: 1.4;
        height: 44px;
        width: 5.1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        color: #333;
      }
      .bottom{
        position: absolute;
        bottom: 0;
        vertical-align: bottom;
        line-height: 1;
        font-weight: 600;
        font-size: 18px;
        color: #ff9c00;
        i{
          font-style: normal;
          font-weight: 500;
          font-size: 10px;
          color: #999;
        }
      }
    }
  }
}
.goodstype{
  .type{
    margin-left: .2rem;
    padding-bottom: .2rem;
    h1{
      line-height: .8rem;
      font-size: 13px;
      color: #666;
    }
    li{
      display: inline-block;
      background-color: #fff;
      color: #666;
      font-size: 12px;
      padding: 6px 10px;
      text-align: center;
      border: 1px solid #CCC;
      border-radius: 4px;
      margin-right: .2rem;
      margin-bottom: 6px;
      &.checked{
        background-color: #f1bc19;
        border: 1px solid #f1bc19;
        color: #fff;
      }
      &.styledisabled{
        opacity: .4;
      }
    }
  }
  .SalePropertyList{
    max-height: 200px;
    overflow: auto;
  }
  .buybtnwrap{
    border-top: 1px solid #E5E5E5;
    padding: 30px 0 15px;
    text-align: center;
    a{
      display: inline-block;
      width: 90%;
      border-radius: 4px;
      line-height: 44px;
      text-align: center;
      background-color: #f1bc19;
      color: #fff;
    }
  }
}
</style>
