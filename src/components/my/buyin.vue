<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <div class="navbar">
      <ul class="navbar-ul">
        <li :class="{active:OrderState==0}" @click='changestate(0)'><span>全部</span></li>
        <li :class="{active:OrderState==1}" @click='changestate(1)'><span>待付款</span></li>
        <li :class="{active:OrderState==2}" @click='changestate(2)'><span>代发货</span></li>
        <li :class="{active:OrderState==3}" @click='changestate(3)'><span>待收货</span></li>
        <li :class="{active:OrderState==5}" @click='changestate(5)'><span>待评价</span></li>
        <li :class="{active:OrderState==4}" @click='changestate(4)'><span>退款/退货</span></li>
      </ul>
    </div>
    <section class="order-cont">
      <ul v-infinite-scroll="infinite" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <li v-for="(item, index) in orderlist" :key="index">
          <div class="topxl">
            <div class="padf">
              {{item.CreateTime}}
              <span class="state" v-if="item.OrderStatus===9">交易关闭</span>
              <span class="state" v-else-if="item.OrderStatus===2">交易成功</span>
              <span class="state" v-else-if="item.OrderStatus===1 && item.PayStatus===1">等待买家付款</span>
              <span class="state" v-else-if="item.OrderStatus===1 && item.ExpressStatus===1">等待卖家发货</span>
              <span class="state" v-else-if="item.OrderStatus===1 && item.ExpressStatus===2">等待买家收货</span>
              <span class="state" v-else-if="item.OrderStatus===1 && item.ExpressStatus===3">交易成功</span>
            </div>
          </div>
          <div class="item">
            <router-link :to='"/Order/ZulinDetail/"+ item.OrderBaseId'>
              <div class="left">
                <img :src='item.OrderGoodsList[0].GoodsImgPath + "@!standard_square_s"'>
              </div>
              <div class="center">
                <p>{{item.OrderGoodsList[0].GoodsTitle}}</p>
                <p class="style">{{item.OrderGoodsList[0].GoodsPropertyName}}</p>
              </div>
              <div class="right">
                <p>¥ {{item.OrderGoodsList[0].GoodsPrice}}</p>
                <p class="thirdtext">×{{item.OrderGoodsList[0].GoodsQuantity}}</p>
              </div>
            </router-link>
          </div>
          <div class="total">合计：¥<span>{{item.OrderMoney}}</span>(含运费¥{{item.FreightMoney}})</div>
          <div class="o-tabbtn">
            <ul class="MyBuyInOrderOper">
              <li data-id="18510">删除订单</li>
            </ul>
          </div>
        </li>
      </ul>
    </section>
    <div tip="正在加载" v-if="showLoading" class="tips">{{tips}}</div>
    <go-top></go-top>
  </div>
</template>

<script>
import Vue from 'vue'
import qs from 'qs'
import apiport from '../../util/api'
import infiniteScroll from 'vue-infinite-scroll'
import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'

Vue.use(infiniteScroll)
export default {
  name: 'zulinbuyin',
  components: {
    vHeader: head,
    goTop: goTop
  },
  data () {
    return {
      headinfo: {title: '我的订单'},
      orderlist: [],
      OrderState: 0,
      cunrrentPageIndex: 0,
      pageSize: 20,
      busy: false,
      showLoading: true,
      tips: '正在加载'
    }
  },
  mounted: function () {
  },
  methods: {
    infinite () {
      this.cunrrentPageIndex += 1
      this.busy = true
      let model = {
        Token: this.$store.state.UserToken,
        OrderType: 1,
        OrderState: this.OrderState,
        pageIndex: this.cunrrentPageIndex,
        pageSize: this.pageSize
      }
      this.$http({
        url: apiport.Order_GetMyList,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('我的租赁', res.data)
          if (res.data.Data.length > 0) {
            this.orderlist = this.orderlist.concat(res.data.Data)
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
    changestate (state) {
      if (state === this.OrderState) {
        return true
      }
      this.OrderState = state
      this.cunrrentPageIndex = 0
      this.orderlist = []
      this.tips = '正在加载'
      this.busy = false
      this.infinite()
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.navbar{
  position:fixed;
  left: 0;
  top: 1rem;
  overflow-x: auto;
  z-index: 2;
  .navbar-ul{
    display: flex;
    background-color: #fff;
    flex-wrap: nowrap;
    li{
      flex:1;
      min-width: 63px;
      font-size: 13px;
      text-align: center;
      line-height: .8rem;
      &.active{
        color:@base-ycolor3;
        span{
          display: inline-block;
          border-bottom:1px solid @base-ycolor3;
        }
      }
    }
  }
}
.order-cont{
  margin-top:2rem;
  li{
    background-color: #fff;
    margin-bottom: .2rem;
    border-top: 1px solid #ededed;
    border-bottom: 1px solid #ededed;
    .topxl{
      line-height: .8rem;
      padding:0 .2rem;
      .state{
        float:right;
        color:@base-ycolor3;
      }
    }
    .item{
      a{
        display:flex;
        padding: 0 .2rem;
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
          p:first-child{
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            height: .6rem;
            line-height: .3rem;
          }
          .style{
            line-height: .3rem;
            min-height: .6rem;
          }
        }
        .right{
          min-width: 1.4rem;
          margin-right: .2rem;
          text-align: right;
          position: relative;
          p:last-child{
            color:#9fa0a0;
          }
        }
      }
    }
    .total{
      font-size: 14px;
      line-height: 30px;
      text-align: right;
      padding-right: .2rem;
      padding-bottom: 4px;
      border-bottom: 1px solid #ededed;
      span{
        font-size: 18px;
      }
    }
    .o-tabbtn{
      width: 100%;
      height: .8rem;
      ul{
        margin-right: .2rem;
        li{
          float: right;
          font-size: 14px;
          border: 1px solid #9fa0a0;
          box-sizing: border-box;
          border-radius: 4px;
          margin: .15rem 0 .15rem .14rem;
          padding: 0 6px;
          height: .5rem;
          line-height: .5rem;
        }
      }
    }
  }
}
.tips{
  text-align:center;
  line-height:50px;
  margin-bottom:50px;
}
</style>
