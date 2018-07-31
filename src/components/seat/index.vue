<template>
  <div class="seat">
    <header class="header">
      <div><a class="iconfont back" @click="back">&#xe651;</a></div>
      <div class="tabs">
        <a href="javascript:;" :class="{active:tab==0}" @click="tabfun(0)">座椅租赁
        </a><a href="javascript:;" :class="{active:tab==1}" @click="tabfun(1)">座椅商城</a>
      </div>
      <div>
      </div>
    </header>
    <div class="container">
      <div class="zulin" v-show="tab==0">
        <div class="seat-sum">
          <router-link to="/Zulin/RentKnowledge" class="piclink">
           <img src="https://cdn.sys.img.95laibei.com/Content/Images/zuindex-101.png" class="pic" alt="租赁须知">
          </router-link>
          <router-link to="/Zulin/ServiceAssurance" class="piclink">
           <img src="https://cdn.sys.img.95laibei.com/Content/Images/zuindex-102.png" class="pic" alt="服务保障">
          </router-link>
          <router-link to="/Activitys/SeatInstallVideo" class="piclink">
           <img src="https://cdn.sys.img.95laibei.com/Content/Images/zuindex-103.png" class="pic" alt="安装视频">
          </router-link>
          <router-link to="/Zulin/FreeInstall" class="piclink">
           <img src="https://cdn.sys.img.95laibei.com/Content/Images/zuindex-104.png" class="pic" alt="全国门店">
          </router-link>
        </div>
        <div v-infinite-scroll="infinite" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="_v-container">
          <ul class="dbitem clearfix">
            <li v-for="(item,index) in zulinlist" :key="index">
              <router-link :to='"/Seat/Detail/"+item.ProductBaseId' class="clearfix">
                <img class="lazyDetail" v-lazy='item.ImgPath+"@!standard_square_m"'>
                <p class="ptitle onelinetext">{{item.Title}}</p>
                <p class="rent">押金  <span>¥{{item.Price}}</span></p><p class="sum">已领用<span>{{item.Sales}}</span>台</p>
              </router-link>
            </li>
          </ul>
          <div tip="正在加载" v-if="showLoading" class="tips">{{tips}}</div>
        </div>
      </div>
      <div class="mall" v-show="tab==1">
        <section id="zulinseatsales" class="zulin-seatsales-banner">
          <ul class="zulin-seatsales-filterOne">
            <li class="zunlin-filterOne-item" :class="{active:sort==1}" @click="sortfun(1)"><span>综合</span></li>
            <li class="zunlin-filterOne-item zunlin-filterOne-price" :class='{active:sort==3||sort==4, "arrow-up":sort==3, "arrow-down": sort == 4}' @click="sortfun(3)"><span>价格</span></li>
            <li class="zunlin-filterOne-item" :class="{active:sort==2}" @click="sortfun(2)"><span>销量</span></li>
          </ul>
          <ul class="zulin-seatsales-filterTwo">
            <li class="zunlin-filterTwo-item arrownone" @click="filterfun(0)"><span>全部</span></li>
            <li class="zunlin-filterTwo-item arow-down" @click="filterfun(1)"><span>品牌<i></i></span></li>
            <li class="zunlin-filterTwo-item arow-down" @click="filterfun(2)"><span>年龄<i></i></span></li>
            <li class="zunlin-filterTwo-item arow-down" @click="filterfun(3)"><span>接口<i></i></span></li>
          </ul>
          <div class="zulin-seatsales-filterPop" v-show="filter">
            <ul id="SeatPropertyList" class="zulin-filterPop-list clearfix">
              <li class="zulin-filterPop-item" v-show="filternum==1" v-for="(item, index) in seatBrandList" :key="index"><a class="link" href="javascript:;" :data-id="item.PropertyId"><span class="item">{{item.PropertyName}}</span></a></li>
              <li class="zulin-filterPop-item" v-show="filternum==2" v-for="(item, index) in ageList" :key="index"><a class="link" href="javascript:;" :data-id="item.PropertyId"><span class="item">{{item.PropertyName}}</span></a></li>
              <li class="zulin-filterPop-item" v-show="filternum==3" v-for="(item, index) in restraintsList" :key="index"><a class="link" href="javascript:;" :data-id="item.PropertyId"><span class="item">{{item.PropertyName}}</span></a></li>
            </ul>
            <div class="zulin-seatsales-btn">
                <a class="zulin-pop-btn zulin-btn-reset">重置</a>
                <a class="zulin-pop-btn zulin-btn-confirm">确定</a>
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
          <div v-if="showLoading" class="tips">{{tips1}}</div>
        </div>
        <div class="cover" v-show="filter" @click.stop="filter=false"></div>
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
import goTop from '@/components/common/scrolltop'

Vue.use(infiniteScroll)

export default {
  name: 'seat',
  data () {
    return {
      tab: 0,
      busy: false,
      busy1: true,
      showLoading: true,
      showLoading1: true,
      page: 0,
      page1: 0,
      sort: 1,
      BrandId: [],
      Age: [],
      Restraints: [],
      tips: '正在加载',
      tips1: '正在加载',
      zulinlist: [],
      seatlist: [],
      filter: false,
      filternum: 0,
      seatBrandList: [],
      ageList: [],
      restraintsList: []
    }
  },
  components: {
    goTop
  },
  methods: {
    back: function () {
      this.$router.back()
    },
    tabfun: function (index) {
      document.body.scrollTop = document.documentElement.scrollTop = 0
      this.tab = index
      if (index === 0) {
        this.busy = false
        this.busy1 = true
      } else {
        this.busy = true
        this.busy1 = false
      }
    },
    sortfun (i) {
      this.seatlist = []
      this.page1 = 0
      this.busy1 = false
      if (i === 1 || i === 2) {
        this.sort = i
      } else if (i === 3 && this.sort === 3) {
        this.sort = 4
      } else {
        this.sort = 3
      }
      this.infinite1()
    },
    getPropertyList () {
      let model = {
      }
      this.$http({
        url: apiport.Product_GetZulinProperty,
        method: 'post',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
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
          console.log(2)
          console.log(error)
        })
    },
    filterfun (j) {
      if (j === 0) {
        this.filter = false
        this.BrandId = []
        this.Age = []
        this.Restraints = []
      } else {
        this.filter = true
        this.filternum = j
        if (!this.seatBrandList.length) {
          this.getPropertyList()
        }
      }
    },
    infinite () {
      this.page += 1
      this.busy = true
      let model = {
        pageIndex: this.page,
        pageSize: 20
      }
      this.$http({
        url: apiport.Product_GetZulinList,
        method: 'post',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log(res)
          if (res.data.Data.length > 0) {
            this.zulinlist = this.zulinlist.concat(res.data.Data)
            this.busy = false
          } else {
            this.tips = '已经到底了...'
            this.busy = true
          }
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
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
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
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
.seat-sum{
    display:-webkit-flex;
    display:flex;
    overflow:hidden;
    border-left: 1px solid #fff;
    border-right: 1px solid #fff;
    margin-top: 1rem;
    .piclink{
      flex:1;
      font-size: 0;
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
.tips{
  text-align:center;
  line-height:50px;
  margin-bottom:50px;
}
// 租赁筛选
.zulin-seatsales-banner{
  position:fixed;
  top: 1rem;
  left: 0;
  width: 100%;
  z-index: 21;
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
      &.arow-down.active i{
        background-position: 0 -15px;
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
  margin-top: 2.6rem;
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
</style>
