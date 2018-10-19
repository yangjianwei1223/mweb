<template>
  <div class="seat">
    <v-header :headinfo="headinfo"  @rightbtn2click="skipchat" @rightbtn1click="skipsearch"></v-header>
    <div class="container">
      <div class="mall">
        <seatfouricon ref="topmenu"></seatfouricon>
        <section id="zulinseatsales" class="zulin-seatsales-banner" :class="{fixed: menufixed}">
          <ul class="zulin-seatsales-filterOne">
            <li class="zunlin-filterOne-item" :class="{active:sort==1}" @click="sortfun(1)"><span>综合</span></li>
            <li class="zunlin-filterOne-item zunlin-filterOne-price" :class='{active:sort==3||sort==4, "arrow-up":sort==3, "arrow-down": sort == 4}' @click="sortfun(3)"><span>价格</span></li>
            <li class="zunlin-filterOne-item" :class="{active:sort==2}" @click="sortfun(2)"><span>销量</span></li>
          </ul>
          <ul class="zulin-seatsales-filterTwo">
            <li class="zunlin-filterTwo-item arrownone" :class="{active: BrandId.length==0 && Age.length==0 && Restraints.length==0}" @click="filterfun(0)"><span>全部</span></li>
            <li class="zunlin-filterTwo-item arow-down" :class="{active: filternum==1 || BrandId.length>0}" @click="filterfun(1)"><span>品牌<i></i></span></li>
            <li class="zunlin-filterTwo-item arow-down" :class="{active: filternum==2 || Age.length>0}" @click="filterfun(2)"><span>年龄<i></i></span></li>
            <li class="zunlin-filterTwo-item arow-down" :class="{active: filternum==3 || Restraints.length>0}" @click="filterfun(3)"><span>接口<i></i></span></li>
          </ul>
          <div class="zulin-seatsales-filterPop" v-show="filter">
            <ul id="SeatPropertyList" class="zulin-filterPop-list clearfix">
              <li class="zulin-filterPop-item" :class="{checked: propertystorage.indexOf(item.PropertyId)>-1}" v-show="filternum==1" v-for="(item, index) in seatBrandList" :key="index + '_1'" @click="checkproperty(item.PropertyId)"><a class="link" href="javascript:;" :data-id="item.PropertyId"><span class="item">{{item.PropertyName}}</span><i class="icon"></i></a></li>
              <li class="zulin-filterPop-item" :class="{checked: propertystorage.indexOf(item.PropertyId)>-1}" v-show="filternum==2" v-for="(item, index) in ageList" :key="index + '_2'" @click="checkproperty(item.PropertyId)"><a class="link" href="javascript:;" :data-id="item.PropertyId"><span class="item">{{item.PropertyName}}</span><i class="icon"></i></a></li>
              <li class="zulin-filterPop-item" :class="{checked: propertystorage.indexOf(item.PropertyId)>-1}" v-show="filternum==3" v-for="(item, index) in restraintsList" :key="index + '_3'" @click="checkproperty(item.PropertyId)"><a class="link" href="javascript:;" :data-id="item.PropertyId"><span class="item">{{item.PropertyName}}</span><i class="icon"></i></a></li>
            </ul>
            <div class="zulin-seatsales-btn">
                <a class="zulin-pop-btn zulin-btn-reset" @click="resetproperty">重置</a>
                <a class="zulin-pop-btn zulin-btn-confirm" @click="selectedproperty">确定</a>
            </div>
          </div>
        </section>
        <div v-infinite-scroll="infinite1" infinite-scroll-disabled="busy1" infinite-scroll-distance="10" class="_v-container">
          <ul class="singleitem">
            <li v-for="(item,index) in seatlist" :key="index" class="item">
              <router-link :to='"/Seat/Detail/"+item.ProductBaseId' class="clearfix">
                <img class="lazyDetail" v-lazy='item.ImgPath+"@!standard_square_m"'>
                <p class="ptitle onelinetext">{{item.Title}}</p>
                <p class="pcontent twolinetext">{{item.Content}}</p>
                <p class="price"><span class="num"><span>¥</span> {{item.Price}}</span><span class="soldout-num">已售出{{item.Sales}}台</span></p>
              </router-link>
            </li>
          </ul>
          <div class="tips">{{tips1}}</div>
        </div>
        <div class="cover" v-show="filter" @click.stop="coverclick"></div>
      </div>
    </div>
    <go-top></go-top>
  </div>
</template>

<script>
import Vue from 'vue'
import qs from 'qs'
import infiniteScroll from 'vue-infinite-scroll'

import apiport from '../../util/api'
import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'
import seatfouricon from '@/components/common/seatfouricon'

Vue.use(infiniteScroll)
export default {
  name: 'seat',
  data () {
    return {
      headinfo: {'title': '座椅商城', rightbtntext2: '&#xe67a;', rightbtntext1: '&#xe608;'},
      busy1: false,
      page1: 0,
      sort: 1,
      BrandId: [],
      Age: [],
      Restraints: [],
      tips1: '正在加载',
      seatlist: [],
      filter: false,
      filternum: 0,
      seatBrandList: [],
      ageList: [],
      restraintsList: [],
      menufixed: false,
      propertystorage: []
    }
  },
  components: {
    'vHeader': head,
    goTop,
    seatfouricon
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    back: function () {
      this.$router.back()
    },
    handleScroll () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // var sumHeight = document.querySelector('.seat-sum').outerHeight
      var sumHeight = this.$refs.topmenu.$el.offsetHeight
      if (scrollTop > sumHeight) {
        this.menufixed = true
      } else {
        this.menufixed = false
      }
    },
    sortfun (i) {
      if (i === 1 || i === 2) {
        this.sort = i
      } else if (i === 3 && this.sort === 3) {
        this.sort = 4
      } else {
        this.sort = 3
      }
      this.resetinfinite1()
    },
    getPropertyList () {
      let model = {
      }
      this.$http({
        url: apiport.Product_GetZulinProperty,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log(res)
          let da = res.data
          this.seatBrandList = da.SeatBrandList
          this.ageList = da.AgeList
          this.restraintsList = da.RestraintsList
        })
        .catch(error => {
          console.log(error)
        })
    },
    filterfun (j) {
      if (j === 0) {
        this.filter = false
        this.filternum = 0
        this.BrandId = []
        this.Age = []
        this.Restraints = []
        this.resetinfinite1()
      } else {
        this.filter = true
        this.filternum = j
        if (!this.seatBrandList.length) {
          this.getPropertyList()
        }
        if (j === 1) {
          this.propertystorage = [].concat(this.BrandId)
        } else if (j === 2) {
          this.propertystorage = [].concat(this.Age)
        } else {
          this.propertystorage = [].concat(this.Restraints)
        }
      }
    },
    infinite1 () {
      this.page1 += 1
      this.busy1 = true
      let model = {
        Sort: this.sort,
        Freight: 0,
        BrandId: this.BrandId,
        Age: this.Age,
        Restraints: this.Restraints,
        pageIndex: this.page1,
        pageSize: 20
      }
      this.$http({
        url: apiport.Product_GetSeatList,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log(res)
          if (res.data.Data.length > 0) {
            this.seatlist = this.seatlist.concat(res.data.Data)
            this.busy1 = false
          } else {
            this.tips1 = '已经到底了...'
            this.busy1 = true
          }
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    skipchat () {
      this.$router.push('/wechat/im')
    },
    skipsearch () {
      this.$router.push('/Search/OptimizationProduct')
    },
    checkproperty (id) {
      let index = this.propertystorage.indexOf(id)
      if (index !== -1) {
        this.propertystorage.splice(index, 1)
      } else {
        this.propertystorage.push(id)
      }
    },
    // 属性重置按钮
    resetproperty () {
      if (this.filternum === 1) {
        this.BrandId = []
      } else if (this.filternum === 2) {
        this.Age = []
      } else {
        this.Restraints = []
      }
      this.filter = false
      this.filternum = 0
      this.resetinfinite1()
    },
    // 属性确定按钮
    selectedproperty () {
      if (this.filternum === 1) {
        this.BrandId = [].concat(this.propertystorage)
      } else if (this.filternum === 2) {
        this.Age = [].concat(this.propertystorage)
      } else {
        this.Restraints = [].concat(this.propertystorage)
      }
      this.filter = false
      this.filternum = 0
      this.resetinfinite1()
    },
    resetinfinite1 () {
      this.seatlist = []
      this.page1 = 0
      this.tips1 = '正在加载'
      this.busy1 = false
      this.infinite1()
    },
    coverclick () {
      this.filter = false
      this.filternum = 0
      this.propertystorage = []
    }
  }
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
  .tabs{
    font-size: 12px;
    a{
      display:inline-block;
      line-height: .6rem;
      padding:0 .2rem;
      border:1px solid #333;
      &.active{
        background-color: #000;
        color:#fff;
      }
      &:first-child{
        border-radius: 4px 0 0 4px;
      }
      &:last-child{
        border-radius:0 4px 4px 0;
      }
    }
  }
}
// 购买筛选
.zulin-seatsales-banner{
  position: relative;
  z-index: 21;
  &.fixed{
    position:fixed;
    top: 1rem;
    left: 0;
    width: 100%;
  }
  .zulin-seatsales-filterOne,.zulin-seatsales-filterTwo{
    position: relative;
    height: .78rem;
    line-height:.78rem;
    font-size: 0;
    width: 100%;
    background-color: #fff;
    border-bottom:1px solid #fafafa;
  }
  .zulin-seatsales-filterOne{
    .zunlin-filterOne-item {
      display: inline-block;
      width: 33%;
      font-size: 15px;
      border-right: 0;
      box-sizing: border-box;
      text-align: center;
      color: #9fa0a0;
      padding: 0 6px;
      margin: 7px 0;
      height: 28px;
      line-height: 28px;
      vertical-align: middle;
      &.active{
        color:@base-ycolor3;
      }
    }
    .zunlin-filterOne-price:after{
      content: "";
      display: inline-block;
      background: url(https://cdn.sys.img.95laibei.com/Content/Images/zulin-sales_2.png) no-repeat center;
      background-position: 0 -30px;
      background-size: 100px 100px;
      width: 8px;
      height: 10px;
      margin-left: 4px;
    }
    .zunlin-filterOne-price.arrow-up:after{
      background-position: 0 -15px;
    }
    .zunlin-filterOne-price.arrow-down:after{
      background-position: 0 0;
    }
  }
  .zulin-seatsales-filterTwo{
    .zunlin-filterTwo-item{
      display: inline-block;
      width: 25%;
      font-size: 12px;
      border-right: 0;
      box-sizing: border-box;
      text-align: center;
      color: #9fa0a0;
      padding: 0 6px;
      margin: 7px 0;
      height: 28px;
      line-height: 28px;
      vertical-align: middle;
      &.arow-down i{
        display: inline-block;
        background: url(https://cdn.sys.img.95laibei.com/Content/Images/zulin-sales_2.png) no-repeat center;
        background-position: 0 -20px;
        background-size: 100px 100px;
        width: 8px;
        height: 5px;
        vertical-align: middle;
        margin-left: 2px;
      }
      &.active{
        span{
          color: @base-ycolor3;
        }
        &.arow-down i{
          background-position: 0 -15px;
        }
      }
    }
    span{
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: center;
      height: 100%;
      color: #9fa0a0;
      background-color: #fafafa;
      line-height: 28px;
      border: 1px solid #fafafa;
    }
  }
  .zulin-seatsales-filterPop{
    background: #fff;
    position: relative;
    .zulin-filterPop-list{
      padding: .3rem .2rem;
      width: 100%;
      box-sizing: border-box;
      height: 200px;
      overflow: scroll;
      .zulin-filterPop-item{
        float: left;
        width: 50%;
        height: 43px;
        line-height: 43px;
        box-sizing: border-box;
        .link{
          display: block;
          margin: 0 5px;
          padding-left: 5px;
          position: relative;
          .item{
            display: block;
            max-width: 160px;
            padding-right: 20px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
        &.checked .link{
          color: @base-ycolor3;
          border-bottom: 1px solid @base-ycolor3;
          .icon{
            display: block;
            background: url(http://cdn.sys.img.95laibei.com/Content/Images/zulin-sales_2.png) no-repeat;
            background-size: 100px 100px;
            background-position: -10px 0;
            width: 13px;
            height: 10px;
            position: absolute;
            margin: 0;
            right: 5px;
            top: 16px;
          }
        }
      }
    }
    .zulin-seatsales-btn{
      width: 100%;
      height: 48px;
      line-height: 48px;
      box-sizing: border-box;
      font-size: 0;
      &::before{
        content: "";
        position: absolute;
        left: 0;
        height: 1px;
        width: 100%;
        background-color: #fafafa;
      }
      .zulin-pop-btn{
        display: inline-block;
        width: 50%;
        font-size: 16px;
        text-align: center;
        box-sizing: border-box;
        &.zulin-btn-confirm{
          color: #fff;
          background: #ff9c00;
        }
      }
    }
  }
}
// 座椅商城
.singleitem{
  position: relative;
  background-color: #fff;
  .item{
    margin-left: .3rem;
    padding: .3rem .3rem .3rem 0;
    border-bottom: 1px solid #fbfbfb;
    img{
      float: left;
      width: 1.8rem;
      height: 1.8rem;
      border-radius: .2rem;
    }
    .ptitle{
      margin-left: 2rem;
      width: 4.9rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-size: .28rem;
      line-height: .4rem;
      color: #3e3a39;
    }
    .pcontent{
      margin-left: 2rem;
      width: 4.9rem;
      height: .8rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: .24rem;
      color: #9fa0a0;
      line-height: .4rem;
    }
    .price{
      margin-top: .2rem;
      margin-left: 2rem;
      overflow: hidden;
      .num{
        display: inline-block;
        font-size: .32rem;
        color: #ff9c00;
      }
      .soldout-num{
        float: right;
        margin-left: .1rem;
        font-size: .26rem;
        color: #9fa0a0;
      }
    }
  }
}
.cover{
  position:fixed;
  top:2.6rem;
  left: 0;
  width:100%;
  bottom: 0;
  background:rgba(0,0,0,.3);
  z-index: 20;
}
.tips{
    text-align:center;
    line-height:50px;
    margin-bottom:50px;
}
</style>
