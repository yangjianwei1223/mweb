<template>
    <div class="sbdetail" id="divContent">
        <!-- <header class="header">
            <div><a class="iconfont back" @click="back">&#xe651;</a></div>
            <div>商品详情</div>
            <div>
              <router-link to="/Home/Cart" class="iconfont cart" data-msg="1" >&#xe663;</router-link>
              <a id="im-messagelinkMore" class="iconfont more1 message" data-msg="1" @click="TopNaviToggle">&#xe693;</a>
            </div>
        </header> -->
        <v-header :headinfo="headinfo" @rightbtn1click="rightbtn1click" @rightbtn2click="rightbtn2click"></v-header>
        <div class="sharehome" v-show="TopNaviShow">
            <span class="tri"></span>
            <a id="im-messagelink" ><i class="iconfont message" data-msg="1">&#xe62a;</i>消息</a>
            <router-link to="/" class="PromptBackToHome"><i class="home iconfont">&#xe653;</i>首页</router-link>
        </div>
        <swiper :swiperdata="swiper"></swiper>
        <div class="sdtitle">
            <!-- <span class="buylimit">包邮</span> -->
            <div class="title">{{goodstitle}}</div>
            <div id="ProductContent" class="tip" :class="{twolinetext: sellpointsline && isshowmoreline}">{{goodsdesc}}</div>
            <i class="iconfont showmore" v-if="sellpointsline" @click="setpointstyle" v-html="arrow"></i>
        </div>
        <div class="seatprice">
          <p class="pay">￥<span>{{Price}}</span><span class="marketprice">¥ {{MarketPrice}}</span></p>
          <p class="sales">销量：{{Sales}}</p>
        </div>
        <section class="sdpromise">
            <p class="line">
                <span class="pitem"><i class="iconfont textcolorr">&#xe656;</i> 正品安全保证</span>
                <span class="pitem"><i class="iconfont textcolorr">&#xe65a;</i> 免运费</span>
                <span class="pitem"><i class="iconfont textcolorr">&#xe658;</i> 无忧退货</span>
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
                <img src="https://cdn.sys.img.95laibei.com/Content/Images/aftersales-update-180307.jpg">
            </div>
        </div>
        <more-recommend></more-recommend>
    <v-footer :footdata="footdata" @getGoodspro="getGoodsApiData" @clickpraise="ProductPraise"></v-footer>
    <section class="popupmask" @click="maskclosesku" v-if="isopensku">
      <sku-choose :initialskuinfo="initialskuinfo" @closebtn="closesku"></sku-choose>
    </section>
    <go-top></go-top>
    </div>
</template>

<script>
/* eslint-disable */
import qs from 'qs'
import apiport from '../../util/api'
import vHeader from '../common/header'
import swiper from '../common/swiper'
import vFooter from './footer'
import comment from '../seat/comment'
import goTop from '@/components/common/scrolltop'
import skuChoose from '@/components/common/skuchoose'
import moreRecommend from './morecomend'
export default {
  name: 'optimizationdetail',
  components: {
    swiper,
    vHeader,
    vFooter,
    comment,
    goTop,
    skuChoose,
    moreRecommend
  },
  data () {
    return {
      headinfo: {title: '商品详情', rightbtntext1: '&#xe663;',rightbtntext2: '&#xe693;'},
      ProductId: 0,
      //  SaleType: 0,座椅详情的参数
      Status: 0, //  优选详情的参数
      swiper: [],
      goodstitle: '',
      goodsdesc: '',
      Price: 0,
      MarketPrice: 0,
      Sales: 0,
      AdvertisingRemark: '',
      DetailContent: '',
      //  ListOtherProducts: [],
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
      Praisecount: 0,
      TopNaviShow: false,
      isopensku: false,
      skuinfo: '',
      skubtn: ''
      // initialskuinfo:{
      //  'skuinfo' :this.skuinfo,
      //  'skugoodsimg' : this.skugoodsimg,
      //  'skugoodstitle':this.skugoodstitle,
      //  'skugoodsprice' :this.Price
      // }
    }
  },
  computed: {
    // title: function () {
    //   if (this.SaleType === 1) {
    //     return '座椅购买'
    //   }
    //   return '座椅租赁'
    // },
    footdata: function () {
      return {'Status': this.Status, 'IsCurrentUserPraise': this.IsCurrentUserPraise, 'Praisecount': this.Praisecount}
    },
    // isopensku: function () {
    //   return this.isopensku
    // },
    initialskuinfo: function () {
      return {
       'skuinfo' :this.skuinfo,
       'skugoodsimg' : this.skugoodsimg+"@!standard_square_m",
       'skugoodstitle':this.skugoodstitle,
       'skugoodsprice' :this.Price,
       'btnname':this.skubtn
      }
    }
  },
  methods: {
    // TopNaviToggle () {
    //   this.TopNaviShow = !this.TopNaviShow
    // },
    rightbtn1click (){
      this.$router.push("/Home/Cart")
    },
    rightbtn2click (){
      this.TopNaviShow = !this.TopNaviShow
    },
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
        url: apiport.Product_GetProductDetail,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model1) })
      }).then((res) => {
        console.log(2, this.$route.params.id)
        console.log('优选商品详情', res.data)
        let data = res.data
        this.swiper = JSON.parse(JSON.stringify(data.ImgList).replace(/Path/g, 'Img'))
        //  this.SaleType = data.SaleType 座椅详情的参数
        this.Status = data.Status //  优选详情的参数
        this.goodstitle = data.Title
        this.goodsdesc = data.ProductContent
        this.Price = data.Price
        this.MarketPrice = data.MarketPrice
        this.Sales = data.Sales
        this.AdvertisingRemark = data.AdvertisingRemark
        this.DetailContent = data.DetailContent
        this.ListOtherProducts = data.ListOtherProducts
        this.skugoodsimg = data.ImgList[0].Path
        this.skugoodstitle = data.Title
        this.IsCurrentUserPraise = data.IsCurrentUserPraise
        this.Praisecount = Math.round(this.Sales / 9) + 2 + data.PraiseCount
        this.$nextTick(function () {
          this.judgemoreline()
          //  this.gotRelatedProducts()
        })
      }).catch((error) => {
        console.log(2)
        console.log(error)
      })
    },
    closesku () {
      this.$store.commit('OPEN_SKU', false)
      this.isopensku = false
      let restoreSku= this.skuinfo
      restoreSku.SalePropertyList.forEach(function(item,index){
        item.ItemList.forEach(function(item1,index1){
          if(item1.state === 1){
            item1.state=0
          }
        })
      })
    },
    opensku () {
      this.$store.commit('OPEN_SKU', true)
      this.isopensku = true
    },
    maskclosesku (e) {
      if (e.target.tagName === 'SECTION') {
        this.closesku()
      }
    },
    getGoodsApiData (type) {
      if (this.Status === 1) {
        this.opensku()
        this.getskudetail()
        if (type.params === 'cart') {
          this.skubtn ='加入购物车'
          //`document.getElementById('cartorbuybtn').innerHTML = '加入购物车'
        } else {
          this.skubtn ='我想要'
          //  document.getElementById('cartorbuybtn').innerHTML = '我想要'
        }
      }
    },
    getskudetail () {
      if (this.skuinfo) return
      let model1 = {
        ProductBaseId: this.$route.params.id,
        Token: this.$store.state.UserToken
      }
      this.$http({
        url: apiport.Goods_GetBaseListByProductId,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model1) })
      }).then((res) => {

        // this.skugoodsimg = res.data
        // console.log(2, this.$route.params.id)
        // console.log('商品属性', res.data)
        // //  this.GoodsBaseList = res.data.GoodsBaseList
        // this.goodsPrice = this.GoodsBaseList[0].Price
        // 给每个销售属性价格状态0：未选 1：选中 2：不能选
        for (let i = 0; i < res.data.SalePropertyList.length; i++) {
          for (let j = 0; j < res.data.SalePropertyList[i].ItemList.length; j++) {
            res.data.SalePropertyList[i].ItemList[j].state = 0
          }
        }
        this.skuinfo = res.data
        // this.SalePropertyList = res.data.SalePropertyList
        // console.log(123123, this.SalePropertyList)
        // // 获取商品的总库存和商品最低显示价格
        // for (let i = 0; i < this.GoodsBaseList.length; i++) {
        //   this.totalStockQuentity += this.GoodsBaseList[i].StockQuentity
        //   this.goodsPrice = this.goodsPrice > this.GoodsBaseList[i].Price ? this.GoodsBaseList[i].Price : this.goodsPrice
        // }
        // this.$nextTick(function () {
        //   //  this.propertvalueInit()
        // })
      }).catch((error) => {
        console.log(error)
      })
    },
    // checkprops (pitem, item, index) {
    //   console.log(pitem)
    //   if (item.state === 2) {
    //     return true
    //   } else if (item.state === 1) {
    //     item.state = 0
    //   } else {
    //     let checkCode = pitem.Code
    //     for (let i = 0; i < this.SalePropertyList.length; i++) {
    //       // 同一属性值单选
    //       if (this.SalePropertyList[i].Code === checkCode) {
    //         for (let j = 0; j < this.SalePropertyList[i].ItemList.length; j++) {
    //           this.SalePropertyList[i].ItemList[j].state = 0
    //         }
    //         item.state = 1
    //       }
    //       // 同一属性值单选 end
    //     }
    //   }
    //   // 库存为0 的sku不让点
    //   this.$nextTick(function () {
    //     let _that = this
    //     _that.SalePropertyList.forEach(function (item, index) {
    //       item.ItemList.forEach(function (item1, index1) {
    //         let totalItemStockQuentity = 0
    //         _that.GoodsBaseList.forEach(function (item2, index2) {
    //           let IsCurrenType = true
    //           item2.GoodsTypeItemList.forEach(function (item3, index3) {
    //             if (item1.PropertyId === item3.PropertyId) {
    //               if (item1.PropertyItemId !== item3.PropertyItemId) {
    //                 IsCurrenType = false
    //                 return true
    //               }
    //             } else {
    //               let checkEle = document.querySelectorAll('#SalePropertyList li.checked')
    //               checkEle.forEach(function (ele, index4) {
    //                 let chkPropertyId = parseInt(ele.dataset.propertyid)
    //                 let chkPropertyItemId = parseInt(ele.dataset.propertyitemid)
    //                 if (item3.PropertyId === chkPropertyId && item3.PropertyItemId !== chkPropertyItemId) {
    //                   IsCurrenType = false
    //                   return true
    //                 }
    //               })
    //             }
    //           })
    //           IsCurrenType && (totalItemStockQuentity += item2.StockQuentity)
    //         })
    //         if (totalItemStockQuentity === 0) {
    //           item1.state = 2
    //         } else {
    //           item1.state === 1 || (item1.state = 0)
    //         }
    //       })
    //     })
    //     // 所有属性值选择完成，切换商品图片和标题等相关数据
    //     this.propertvalueInit()
    //   })
    // },
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
    // chooseonly (index) {
    //   if (this.periodindex === index) {
    //     this.periodindex = ''
    //   } else {
    //     this.periodindex = index
    //   }
    // },
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
    // gotRelatedProducts () {
    //   let model1 = {
    //     ProductBaseId: this.$route.params.id,
    //     GetCount: 8
    //   }
    //   this.$http({
    //     url: apiport.Product_GetMoreList,
    //     method: 'post',
    //     data: qs.stringify({ reqJson: JSON.stringify(model1) })
    //   }).then((res) => {
    //   //  console.log(2, this.$route.params.id)
    //     console.log('相关商品列表--1011', res.data)
    //     this.ListOtherProducts = res.data.Data
    //   })
    // }
  },
  mounted: function () {
    this.getdetaildata()
  },
  watch: {
    '$route' (to, from) {
      document.body.scrollTop = document.documentElement.scrollTop = 0
      this._data.TopNaviShow = false
      this._data.swiper = []
      this._data.skuinfo = ""
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
.sharehome{
  display: block;
  position: fixed;
  top: 1rem;
  right: .1rem;
  line-height: .8rem;
  z-index: 23;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 1px 1px 1px #ebebec, -1px -1px 1px #ebebec;
  padding: 0;
  .tri {
    position: absolute;
    top: -10px;
    right: 8px;
    display: block;
    width: 0;
    height: 0;
    border-top: none;
    border-right: 8px solid transparent;
    border-bottom: 13px solid #fff;
    border-left: 8px solid transparent;
  }
  a {
    display: block;
    padding: 0 16px;
    font-size: 16px;
    border-bottom: 1px solid #dcdddd;
    .iconfont {
      margin-right: .2rem;
      font-size: 16px;
    }
    .home.iconfont {
      font-size: 18px;
    }
    .message{
      position: relative;
    }
    .message:after{
      right: -.2rem;
      top: -.2rem;
    }
  }
}
.sbdetail{
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
      font-size: 20px;
      font-weight: 600;
    }
    .marketprice{
      margin-left: .1rem;
      font-weight: normal;
      font-size: 13px;
      text-decoration: line-through;
      color: @base-color2;
    }
  }
  .sales{
    font-size: 15px;
    color: @base-color3;
  }
}
.sdpromise .line{
  color: @base-color2;
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
  >.iconfont{
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
  .wrap{
    /deep/ img{
      display: block;
    }
  }
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
.popupmask{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(122,122,122,0.3);
  z-index: 1001;
}
</style>
