<template>
  <div class="goodstype" >
        <div class="back iconfont" @click="initialclosesku">&#xe665;</div>
        <div class="title clearfix">
        <div class="left"><img :src= 'skugoodsimg || initialskuinfo.skugoodsimg' /></div>
        <div class="right">
          <div class="top">{{skugoodstitle || initialskuinfo.skugoodstitle}}</div>
          <div class="bottom price"><span id="ProductGoodsPrice"> ¥ {{goodsPrice || getLowestPrice}}</span><i id="GoodsStockQuentity">&nbsp;&nbsp;库存：{{ totalStockQuentity || updateTotalQuenti }}件</i></div>
        </div>
        <div style="clear:both"></div>
        <!-- 租赁的 -->
        <!-- <div id="RentListDiv" v-if="skuinfoinit.GoodsBaseList.length>0"> -->
        <!-- <div id="RentListDiv" >
          <div class="type">
            <h1>SalePropertyList</h1>
            <ul class="RentDetailList">
              <li v-for="(item, index) in skuinfoinit.skuinfo.GoodsBaseList" :key="index" :class="{checked: index===periodindex}" :data-rentid="item.Id" :data-price="item.RentAmount" @click="chooseonly(index)">{{item.RentName}}-{{item.RentAmount}}元</li>
            </ul>
          </div>
        </div> -->
        </div>
        <div id="SalePropertyList" class="SalePropertyList">
          <div class="type" v-for="(item, index) in initialskuinfo.skuinfo.SalePropertyList" :key="index">
            <h1>{{item.DisplayName}}</h1>
            <ul>
              <li v-for="(item1, index1) in item.ItemList" :key="index1" v-if="item1.Status" @click="checkprops(item,item1,index1,initialskuinfo.skuinfo.SalePropertyList,initialskuinfo.skuinfo.GoodsBaseList)" :class="{checked:item.ItemList.length===1 || item1.state===1,styledisabled:item1.state === 2}" :data-propertyid="item1.PropertyId" :data-propertyitemid="item1.PropertyItemId">{{item1.PropertyValue}}</li>
            </ul>
          </div>
        </div>
        <div class="goodsnum clearfix" v-if="initialskuinfo.skuinfo.Status===1">
          <div class="left">购买数量</div>
          <div class="right">
            <a href="javascript:;" class="sign-decrease" @click="signdecrease">－</a>
            <input id="quantity" type="tel" value="1" @blur="quantityinput">
            <a href="javascript:;" class="sign-plus" @click="signplus">＋</a>
          </div>
        </div>
        <div class="buybtnwrap">
          <a href="javascript:;" id="cartorbuybtn" @click="gotoorder(initialskuinfo.skuinfo)" :getSkuBaseId="getSkuBaseId">{{initialskuinfo.btnname}}</a>
        </div>
        </div>
</template>
<script>
/* eslint-disable */
import qs from 'qs'
import apiport from '../../util/api'
export default {
  name: 'skuchoose',
  props: ['initialskuinfo'],
  data () {
    return {
      skugoodsimg:this.initialskuinfo.skugoodsimg,
      skugoodstitle:this.initialskuinfo.skugoodstitle,
      totalStockQuentity: 0,
      goodsPrice: this.initialskuinfo.skugoodsprice,
      skubaseid:0
    }
  },
  methods: {
    initialclosesku () {
      
      let toRemoveChecked = document.querySelectorAll("#SalePropertyList .checked")
      if(toRemoveChecked.length>0){
        toRemoveChecked.forEach(function(item,index){
          item.dataset.state= 0
          console.log(item)
        })
      }
      
      console.log("当前选择个数" + document.querySelectorAll("#SalePropertyList .checked").length)
      this.$emit('closebtn')
    },
    maskclosesku (e) {
      if (e.target.tagName === 'SECTION') {
        this.closesku()
      }
    },
    checkprops (pitem, item, index, salelistall,gooslistall) {
      if (item.state === 2) {
        return true
      } else if (item.state === 1) {
        item.state = 0
      } else {
        let checkCode = pitem.Code
        let sk = salelistall
        for (let i = 0; i < sk.length; i++) {
          // 同一属性值单选
          if (sk[i].Code === checkCode) {
            for (let j = 0; j < sk[i].ItemList.length; j++) {
              sk[i].ItemList[j].state = 0
            }
            item.state = 1
          }
          // 同一属性值单选 end
        }
      }
      // 库存为0 的sku不让点
      this.$nextTick(function () {
        let _that = this
        salelistall.forEach(function (item, index) {
          item.ItemList.forEach(function (item1, index1) {
            let totalItemStockQuentity = 0
            gooslistall.forEach(function (item2, index2) {
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
              _that. $forceUpdate()//迫使 Vue 实例重新渲染
            }
          })
        })
        
        // 所有属性值选择完成，切换商品图片和标题等相关数据
        this.$nextTick(function () {
          this.propertvalueInit(salelistall,gooslistall)
        })
      })
    },
    propertvalueInit (salelist,goodlist) {
      //  debugger
      if(!salelist || !goodlist) return
      // 所有属性值选择完成，切换商品图片和标题等相关数据
      let sksale =salelist
      let skgood= goodlist
      let _that = this
      if (document.querySelectorAll('#SalePropertyList li.checked').length === sksale.length) {
        skgood.forEach(function (item, index) {
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
            _that.skugoodsimg = item.ImgPath +"@!standard_square_m"
            _that.skugoodstitle = item.Title
            _that.goodsPrice = item.Price
            _that.totalStockQuentity = item.StockQuentity
            _that.skubaseid = item.GoodsBaseId
            console.log('dijigesku', index)
          }
        })
        console.log('已选长度')
      }
    },
    gotoorder (skinfo) {
      let sk = skinfo.SalePropertyList
      if (document.querySelectorAll('#SalePropertyList li.checked').length === sk.length) {
        this.initialclosesku()
        console.log("当前baseid是 " + this.skubaseid)
        console.log("Status " +skinfo.Status)
        if (skinfo.Status === 1) {
          if (document.getElementById('cartorbuybtn').innerHTML === '我想要') {
            alert("购买"+this.skubaseid)
            //  this.$router.push('/Order/confirm/' + this.skubaseid)
          } else {
            // 加入购物车
            let currentToken = this.$store.state.UserToken
            if(!currentToken){
              alert("当前用户还未登陆，请先登录")//应该是跳转到登陆页面 /Account/Index
              console.log(this.$router)
              this.$router.push("/Account/Index")
              return
              }  
            let model = {
              Token: currentToken,
              ProductBaseId: this.$route.params.id,
              GoodsBaseId: this.skubaseid,
              GoodsQuantity: parseInt(document.getElementById('quantity').value)
            }
            this.$http({
              url: apiport.ShoppingCart_Add,
              method: 'post',
              data: qs.stringify({ reqJson: JSON.stringify(model) })
            }).then((res) => {
              console.log('加入购物车', res.data)
              alert('加购物车成功')
            }).catch((error) => {
              console.log(2)
              console.log(error)
            })
          }
        } else {
          this.$router.push('/Order/ZulinConfirm/' + this.skubaseid)
        }
      } else {
        alert('请选择合适的规格')
      }
    },
    signplus () {
      let currentquantity = parseInt(document.getElementById('quantity').value)
      if (currentquantity < this.totalStockQuentity) {
        document.getElementById('quantity').value = currentquantity + 1
      }
    },
    signdecrease () {
      let currentquantity = parseInt(document.getElementById('quantity').value)
      if (currentquantity > 1) {
        document.getElementById('quantity').value = currentquantity - 1
      }
    },
    quantityinput () {
      let currentquantity = parseInt(document.getElementById('quantity').value)
      currentquantity = currentquantity === undefined ? 0 : currentquantity
      if (currentquantity > this.totalStockQuentity) {
        document.getElementById('quantity').value = this.totalStockQuentity
      } else if (currentquantity < 0) {
        document.getElementById('quantity').value = 1
      }
    },
    chooseonly (index) {
      if (this.periodindex === index) {
        this.periodindex = ''
      } else {
        this.periodindex = index
      }
    }
  },
  computed: {
    getSkuBaseId:function(){//  当前商品只有一个sku，默认选中且可以直接购买时！！！！！！
       let sk = this.initialskuinfo.skuinfo
      if(sk){
        //if(ItemList.length)
        return this.skubaseid = sk.GoodsBaseList[0].GoodsBaseId 
      }
    },
    updateTotalQuenti: function(){
      let sk = this.initialskuinfo.skuinfo
      if(sk){
        for (let i = 0; i < sk.GoodsBaseList.length; i++) {
          this.totalStockQuentity += sk.GoodsBaseList[i].StockQuentity
        }
      }
      return this.totalStockQuentity
    },
    getLowestPrice: function(){
      let sk = this.initialskuinfo.skuinfo
      if(sk){
        for (let i = 0; i < sk.GoodsBaseList.length; i++) {
          this.goodsPrice = this.initialskuinfo.skugoodsprice > sk.GoodsBaseList[i].Price ? sk.GoodsBaseList[i].Price : this.initialskuinfo.skugoodsprice
        }
        let salelist =this.initialskuinfo.skuinfo.SalePropertyList
         let goodlist =this.initialskuinfo.skuinfo.GoodsBaseList
      return this.goodsPrice
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/less/variable";
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
  .goodsnum{
    width: 100%;
    padding-left: .2rem;
    box-sizing: border-box;
    border-top: 1px solid #ededed;
    .left{
      width: 30%;
      float: left;
      line-height: 1rem;
      font-size: 13px;
      color: #666;
    }
    .right{
      float: right;
      input,a{
        display: inline-block;
        width: .6rem;
        height: .6rem;
        line-height: .6rem;
        background-color: #E5E5E5;
        text-align: center;
        vertical-align: -webkit-baseline-middle;
        border-radius: 4px;
        margin: .2rem 0;
        font-size: 15px;
        color: #ccc;
      }
      .sign-decrease,.sign-plus{
        font-size: 24px;
        font-weight: 200;
      }
      .sign-plus{
        margin-right: .2rem;
        color: #999;
      }
      input{
        background-color: #fff;
        color: #666;
        border: none;
        outline: none;
        width: .6rem;
      }
    }
  }
}
</style>
