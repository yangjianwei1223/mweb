<template>
  <div class="seatdetail">
    <header class="header">
      <div><a class="iconfont back" @click="back">&#xe651;</a></div>
      <div>{{title}}</div>
      <div>
        <router-link to="/Home/Cart" class="iconfont cart" data-msg="1" style="font-size: 16px">&#xe67c;</router-link>
      </div>
    </header>
    <swiper :swiperdata="swiper"></swiper>
    <div class="sdtitle">
      <span class="buylimit">包邮</span>
      <div class="title">{{goodstitle}}</div>
      <div id="ProductContent" class="tip" :class="{twolinetext: sellpointsline && isshowmoreline}">{{goodsdesc}}</div>
      <i class="iconfont showmore" v-if="sellpointsline" @click="setpointstyle" v-html="arrow"></i>
    </div>
    <div class="seatprice">
      <p class="pay">￥<span>{{Price}}</span></p>
      <p class="sales">销量：{{Sales}}</p>
    </div>
    <section class="sdpromise">
      <p class="line">
        <span class="pitem"><i class="iconfont textcolorr">&#xe606;</i> 全新正品</span>
        <span class="pitem"><i class="iconfont textcolorr">&#xe606;</i> 假一赔十</span>
        <span class="pitem"><i class="iconfont textcolorr">&#xe606;</i> 正规授权</span>
        <span class="pitem"><i class="iconfont textcolorr">&#xe606;</i> 3c认证</span>
        <i class="iconfont">&#xe61e;</i>
      </p>
    </section>
    <section class="fhnotice" v-if="AdvertisingRemark">
      <h3 class="textcolorr"><span class="iconfont">&#xe66b;  </span><span>消息通知</span></h3>
      <p class="thirdtext">{{AdvertisingRemark}}</p>
    </section>
    <comment :ProductBaseId="$route.params.id"></comment>
    <div class="tw">
      <h5 class="specialefth88">
          <span class="tips">图文详情</span>
      </h5>
      <div class="wrap">
        <div v-html="DetailContent"></div>
        <img  src="https://cdn.sys.img.95laibei.com/Content/Images/aftersales-update-180307.jpg">
      </div>
    </div>
    <div class="headimg">
      <span>更多精选商品</span>
    </div>
    <ul class="dbitem clearfix">
      <li v-for="(item,index) in ListOtherProducts" :key="index">
        <router-link :to='"/Seat/Detail/"+item.ProductBaseId' class="clearfix">
          <img class="lazyDetail" v-lazy='item.ImgPath+"@!standard_square_m"' :key="item.ProductBaseId">
          <p class="ptitle onelinetext">{{item.Title}}</p>
          <p class="rent">{{SaleType===1 ? '' : '押金'}}  <span>¥{{item.Price}}</span></p><p class="sum" v-if="SaleType!==1">已领用<span>{{item.Sales}}</span>台</p>
        </router-link>
      </li>
    </ul>
    <div class="sole">
      <span>已经到底了</span>
    </div>
    <section class="popupmask" v-show="isopensku" @click="maskclosesku">
      <div class="goodstype">
        <div class="back iconfont" @click="closesku">&#xe665;</div>
        <div class="title clearfix">
          <div class="left"><img :src='skugoodsimg + "@!standard_square_m"'></div>
          <div class="right">
            <div class="top">{{skugoodstitle}}</div>
            <div class="bottom price"><span id="ProductGoodsPrice">{{SaleType===1 ? '' : '押金'}} ¥ {{goodsPrice}}</span><i id="GoodsStockQuentity">&nbsp;&nbsp;库存：{{totalStockQuentity}}件</i></div>
          </div>
          <div style="clear:both"></div>
          <div id="RentListDiv" v-if="RentDetailList.length>0">
            <div class="type">
              <h1>租用期限</h1>
              <ul class="RentDetailList">
                <li v-for="(item, index) in RentDetailList" :key="index" :class="{checked: index===periodindex}" :data-rentid="item.Id" :data-price="item.RentAmount" @click="chooseonly(index)">{{item.RentName}}-{{item.RentAmount}}元</li>
              </ul>
            </div>
          </div>
          </div>
          <div id="SalePropertyList" class="SalePropertyList">
            <div class="type" v-for="(item, index) in SalePropertyList" :key="index">
              <h1>{{item.DisplayName}}</h1>
              <ul>
                <li v-for="(item1, index1) in item.ItemList" :key="index1" v-if="item1.Status" @click="checkprops(item,item1,index1)" :class="{checked:item.ItemList.length===1 || item1.state===1,styledisabled:item1.state === 2}" :data-propertyid="item1.PropertyId" :data-propertyitemid="item1.PropertyItemId">{{item1.PropertyValue}}</li>
              </ul>
            </div>
          </div>
          <div class="goodsnum clearfix" v-if="SaleType===1">
            <div class="left">购买数量</div>
            <div class="right">
              <a href="javascript:;" class="sign-decrease" @click="signdecrease">－</a>
              <input id="quantity" type="tel" value="1" @blur="quantityinput">
              <a href="javascript:;" class="sign-plus" @click="signplus">＋</a>
            </div>
          </div>
          <div class="buybtnwrap">
            <a href="javascript:;" v-if="SaleType!==1" @click="gotoorder">立即租赁</a>
            <a href="javascript:;" id="cartorbuybtn" v-else @click="gotoorder">我想要</a>
          </div>
      </div>
  </section>
    <v-footer :footdata="footdata" @getGoodspro="getGoodsApiData" @clickpraise="ProductPraise"></v-footer>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import swiper from '../common/swiper'
import vFooter from './footer'
import comment from '../common/comment'
export default {
  name: 'seatdetail',
  components: {
    swiper,
    vFooter,
    comment
  },
  data () {
    return {
      SaleType: 0,
      swiper: [],
      goodstitle: '',
      goodsdesc: '',
      Price: 0,
      Sales: 0,
      AdvertisingRemark: '',
      DetailContent: '',
      ListOtherProducts: [],
      RentDetailList: [],
      SalePropertyList: [],
      GoodsBaseList: [],
      totalStockQuentity: 0,
      goodsPrice: 0.00,
      skubaseid: '',
      skugoodsimg: '',
      skugoodstitle: '',
      sellpointsline: false,
      isshowmoreline: true,
      arrow: '&#xe609',
      periodindex: 0,
      IsCurrentUserPraise: false,
      Praisecount: 0
    }
  },
  computed: {
    title: function () {
      if (this.SaleType === 1) {
        return '座椅购买'
      }
      return '座椅租赁'
    },
    footdata: function () {
      return {'SaleType': this.SaleType, 'IsCurrentUserPraise': this.IsCurrentUserPraise, 'Praisecount': this.Praisecount}
    },
    isopensku: function () {
      return this.$store.state.opensku
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    getdetaildata () {
      let model1 = {
        ProductBaseId: this.$route.params.id,
        GetCount: 8,
        Token: this.$store.state.UserToken
      }
      this.$http({
        url: apiport.Product_GetZLDetailById,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model1) })
      }).then((res) => {
        console.log(2, this.$route.params.id)
        console.log('商品详情', res.data)
        let data = res.data
        this.swiper = JSON.parse(JSON.stringify(data.ImgList).replace(/Path/g, 'Img'))
        this.SaleType = data.SaleType
        this.goodstitle = data.Title
        this.goodsdesc = data.ProductContent
        this.Price = data.Price
        this.Sales = data.Sales
        this.AdvertisingRemark = data.AdvertisingRemark
        this.DetailContent = data.DetailContent
        this.ListOtherProducts = data.ListOtherProducts
        this.RentDetailList = data.RentDetailList
        this.skugoodsimg = data.ImgList[0].Path
        this.skugoodstitle = data.Title
        this.IsCurrentUserPraise = data.IsCurrentUserPraise
        this.Praisecount = Math.round(this.Sales / 9) + 2 + data.PraiseCount
        this.$nextTick(function () {
          this.judgemoreline()
        })
      }).catch((error) => {
        console.log(2)
        console.log(error)
      })
    },
    closesku () {
      this.$store.commit('OPEN_SKU', false)
    },
    maskclosesku (e) {
      if (e.target.tagName === 'SECTION') {
        this.closesku()
      }
    },
    getGoodsApiData (type) {
      if (this.SaleType === 1) {
        if (type.params === 'cart') {
          document.getElementById('cartorbuybtn').innerHTML = '加入购物车'
        } else {
          document.getElementById('cartorbuybtn').innerHTML = '我想要'
        }
      }
      if (this.GoodsBaseList.length > 0) return
      let model1 = {
        ProductBaseId: this.$route.params.id,
        Token: this.$store.state.UserToken
      }
      this.$http({
        url: apiport.Goods_GetBaseListByProductId,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model1) })
      }).then((res) => {
        console.log(2, this.$route.params.id)
        console.log('商品属性', res.data)
        this.GoodsBaseList = res.data.GoodsBaseList
        this.goodsPrice = this.GoodsBaseList[0].Price
        // 给每个销售属性价格状态0：未选 1：选中 2：不能选
        for (let i = 0; i < res.data.SalePropertyList.length; i++) {
          for (let j = 0; j < res.data.SalePropertyList[i].ItemList.length; j++) {
            res.data.SalePropertyList[i].ItemList[j].state = 0
          }
        }
        this.SalePropertyList = res.data.SalePropertyList
        console.log(123123, this.SalePropertyList)
        // 获取商品的总库存和商品最低显示价格
        for (let i = 0; i < this.GoodsBaseList.length; i++) {
          this.totalStockQuentity += this.GoodsBaseList[i].StockQuentity
          this.goodsPrice = this.goodsPrice > this.GoodsBaseList[i].Price ? this.GoodsBaseList[i].Price : this.goodsPrice
        }
        this.$nextTick(function () {
          this.propertvalueInit()
        })
      }).catch((error) => {
        console.log(error)
      })
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
    judgemoreline () {
      let ele = document.getElementById('ProductContent')
      let styles = window.getComputedStyle(ele, null)
      let lh = parseInt(styles.lineHeight, 10)
      let h = parseInt(styles.height, 10)
      let lc = Math.round(h / lh)
      lc > 2 && (this.sellpointsline = true)
      console.log(lc)
    },
    setpointstyle () {
      if (this.arrow === '&#xe60c') {
        this.arrow = '&#xe609'
        this.isshowmoreline = true
      } else {
        this.arrow = '&#xe60c'
        this.isshowmoreline = false
      }
    },
    chooseonly (index) {
      if (this.periodindex === index) {
        this.periodindex = ''
      } else {
        this.periodindex = index
      }
    },
    ProductPraise () {
      let model = {
        ProductBaseId: this.$route.params.id,
        Token: this.$store.state.UserToken
      }
      this.$http({
        url: apiport.Product_BasePraise,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      }).then((res) => {
        console.log('商品点赞', res.data)
        this.Praisecount = Math.round(this.Sales / 9) + 2 + res.data.PraiseCount
        this.IsCurrentUserPraise = res.data.IsAdd
      }).catch((error) => {
        console.log(2)
        console.log(error)
      })
    },
    gotoorder () {
      if (document.querySelectorAll('#SalePropertyList li.checked').length === this.SalePropertyList.length) {
        this.closesku()
        if (this.SaleType === 1) {
          if (document.getElementById('cartorbuybtn').innerHTML === '我想要') {
            this.$router.push('/Order/confirm/' + this.skubaseid + '?Quantity=' + document.getElementById('quantity').value)
          } else {
            // 加入购物车
            let model = {
              Token: this.$store.state.UserToken,
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
          let rentid = ''
          if (this.RentDetailList.length > 0) {
            rentid = '?rentid=' + this.RentDetailList[this.periodindex].Id
          }
          this.$router.push('/Order/ZulinConfirm/' + this.skubaseid + rentid)
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
    }
  },
  mounted: function () {
    this.getdetaildata()
  },
  watch: {
    '$route' (to, from) {
      document.body.scrollTop = document.documentElement.scrollTop = 0
      this.getdetaildata()
    }
  }
  // beforeRouteUpdate (to, from, next) {
  //   this.getdetaildata()
  // }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 22;
  background: @base-ycolor;
  display: -webkit-box;
  height: 1rem;
  line-height: 0.8rem;
  text-align: center;
  & > div {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    display: -webkit-box;
    display: -moz-box;
    font-size: 18px;
    color: #000;
  }
  & > div:first-child {
    text-align: left;
    margin-left: 0.2rem;
    -moz-box-pack: start;
    -webkit-box-pack: start;
    min-width: 20%;
  }
  & > div:last-child {
    text-align: right;
    margin-right: 0.2rem;
    -webkit-box-pack: end;
    min-width: 20%;
    font-size: 16px;
  }
  .back{
    font-size: 22px;
  }
}
.seatdetail{
  /deep/ .swiper{
    margin-top: 1rem;
    .swiper-container{
      height: 7.5rem;
      background-color: #fff;
      .swiper-slide a{
        display: flex;
        max-width: 100%;
        height: 7.5rem;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        img{
          height:auto;
          max-width: 7.5rem;
          max-height: 7.5rem;
        }
      }
    }
  }
}
.sdtitle{
  padding: .2rem;
  background-color: #fff;
  .buylimit{
    padding: 1px 5px;
    vertical-align: middle;
    font-size: 10px;
    color: #ff9c00;
    border: 1px solid #ff9c00;
    border-radius: 3px;
    line-height: 1.3;
  }
  .title{
    display: inline;
    font-size: 16px;
    color: #3e3a39;
    line-height: 22px;
  }
  .tip{
    color: #9fa0a0;
    font-size: 14px;
    line-height: 18px;
    margin-top: .2rem;
    word-wrap: break-word;
  }
  .showmore{
    display: block;
    text-align: center;
    font-size: 16px;
    line-height: 1;
  }
}
.seatprice{
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 0 .2rem .2rem;
  background-color: #fff;
  .pay{
    font-size: 13px;
    line-height: 1;
    color: @base-ycolor3;
    span{
      font-size: 18px;
      font-weight: 600;
    }
  }
  .sales{
    font-size: 10px;
    color: #929292;
  }
}
.sdpromise .line{
  color: #9fa0a0;
  font-size: 12px;
  line-height: .74rem;
  padding-left: .2rem;
  .pitem{
    display: inline-block;
    margin-right: .1rem;
    .iconfont{
      font-size: 16px;
      vertical-align: middle;
      color: @base-ycolor3;
    }
  }
  .iconfont{
    float: right;
    margin-right: .2rem;
  }
}
.fhnotice{
  margin-bottom: .2rem;
  padding: 4px .2rem .2rem;
  background-color: #fff;
  border: 1px solid #efeff0;
  h3{
    line-height: 30px;
    font-size: 14px;
    color: @base-ycolor3;
  }
  p{
    font-size: 12px;
    line-height: 20px;
    color: #9fa0a0;
  }
}
.tw{
  background-color: #fff;
  word-wrap: break-word;
  font-size: 16px;
  overflow: hidden;
  .specialefth88{
    line-height: .88rem;
    padding-left: .2rem;
    position: relative;
    border-bottom: 1px solid #E5E5E5;
    .tips{
      margin-left: .24rem;
      font-size: 15px;
    }
    &:before{
      content: "";
      position: absolute;
      top: .29rem;
      left: .2rem;
      width: 2px;
      height: .3rem;
      background-color: #E62327;
    }
  }
  /deep/ video{
    width: 100%;
  }
}
.headimg{
  position: relative;
  width: 70%;
  margin: 0 15% .2rem;
  color: #999;
  font-size: 12px;
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
  margin-top:.1rem;
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
