<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <div class="navbar">
      <ul class="navbar-ul">
        <li :class="{active:OrderState==0}" @click='changestate(0)'><span>全部</span></li>
        <li :class="{active:OrderState==1}" @click='changestate(1)'><span>待付款</span></li>
        <li :class="{active:OrderState==2}" @click='changestate(2)'><span>待发货</span></li>
        <li :class="{active:OrderState==3}" @click='changestate(3)'><span>待收货</span></li>
        <li :class="{active:OrderState==5}" @click='changestate(5)'><span>待评价</span></li>
        <li :class="{active:OrderState==4}" @click='changestate(4)'><span>退租/归还</span></li>
      </ul>
    </div>
    <section class="order-cont">
      <ul v-infinite-scroll="infinite" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <li v-for="(item, index) in orderlist" :key="index">
          <template v-if="OrderState!==4">
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
              <router-link :to='"/Order/ZulinDetail/"+ item.OrderBaseId' v-for="(item1, index1) in item.OrderGoodsList" :key="index1+'_li'">
                <div class="left">
                  <img :src='item1.GoodsImgPath + "@!standard_square_s"'>
                </div>
                <div class="center">
                  <p>{{item1.GoodsTitle}}</p>
                  <p class="style">{{item1.GoodsPropertyName}}</p>
                </div>
                <div class="right">
                  <p>¥ {{item1.GoodsPrice}}</p>
                  <p class="thirdtext">×{{item1.GoodsQuantity}}</p>
                  <p v-if="item1.Status===2" class="refund">退货中</p>
                  <p v-else-if="item1.Status===3" class="refund">等待买家退货</p>
                  <p v-else-if="item1.Status===4" class="refund">{{item.PayType === 5 ? "归还中" : "退租中"}}</p>
                </div>
              </router-link>
            </div>
            <div class="total">合计：¥<span>{{item.OrderMoney}}</span>(含运费¥{{item.FreightMoney}})</div>
            <div class="o-tabbtn">
              <ul class="MyBuyInOrderOper">
                <li v-if="item.PayStatus === 2" @click="showrentcontract(item.RentType)">租赁协议</li>
                <li v-if="item.OrderStatus === 1 && item.PayStatus === 1" @click="gopay(item.OrderBaseId)">我要付款</li>
                <li v-if="item.OrderStatus === 1 && item.PayStatus === 1" @click="cancleOrdel(item.OrderBaseId)">取消订单</li>
                <li v-if="item.OrderStatus === 1 && item.PayStatus !==1 && item.ExpressStatus === 1" @click="remindDelivery(item.OrderBaseId)">提醒发货</li>
                <li v-if="(item.OrderStatus === 1 || item.OrderStatus === 2) && (item.ExpressStatus === 2 || item.ExpressStatus === 3)"><router-link :to='"/Order/Express/" + item.OrderBaseId'>查看物流</router-link></li>
                <li v-if="item.OrderStatus === 1 && item.ExpressStatus === 2" @click="confirmExpress(item.OrderBaseId, item.PayType, item.OrderMoney, item.OrderGoodsList)">确认收货</li>
                <li v-if="item.OrderStatus === 1 && item.ExpressStatus === 3 || item.OrderStatus === 2 || item.OrderStatus === 9" @click="delOrderFun(item.OrderBaseId)">删除订单</li>
                <li v-if="item.ExpressStatus === 3 && item.CommentStatus === 0" class="comment"><router-link :to="'/Order/Comment/'+ item.OrderBaseId">立即评价</router-link></li>
              </ul>
            </div>
          </template>
          <template v-else>
            <div class="topxl">
              <div class="padf">
                <template v-if="item.PayType===5">申请归还时间：</template>
                <template v-else>申请退租时间：</template>
                {{item.ApplyTime}}
                <span class="state" v-if="item.Status===2">退货中</span>
                <span class="state" v-else-if="item.Status===3">等待买家退货</span>
                <span class="state" v-else-if="item.Status===4 && item.PayType===5">归还中</span>
                <span class="state" v-else-if="item.Status===4">退租中</span>
                <span class="state" v-else-if="item.Status===5 && item.PayType===5">归还成功</span>
                <span class="state" v-else-if="item.Status===5">退租成功</span>
                <span class="state" v-else-if="item.Status===6 && item.PayType===5">归还关闭</span>
                <span class="state" v-else-if="item.Status===6">退租关闭</span>
              </div>
            </div>
            <div class="item">
              <router-link :to='"/Order/RefundHistory"+ item.OrderGoodsId'>
                <div class="left">
                  <img :src='item.GoodsImgPath + "@!standard_square_s"'>
                </div>
                <div class="center">
                  <p>{{item.GoodsTitle}}</p>
                  <p class="style">{{item.GoodsPropertyName}}</p>
                </div>
              </router-link>
            </div>
            <div class="total">退款金额：¥<span>{{item.RefundMoney}}</span></div>
            <div class="o-tabbtn" v-if="item.Status === 3 || item.Status ===4 ">
              <ul class="MyBuyInOrderOper">
                <li v-if="item.Status === 3"><router-link :to='"/Order/ReturnGoods/" + item.OrderGoodsId'>退货</router-link></li>
                <li v-if="item.Status === 4"><router-link :to='"/Order/ApplyRefund/" + item.OrderGoodsId'>修改申请</router-link></li>
                <li v-if="item.Status === 4" @click="CancelRefund(item.OrderGoodsId)">撤销申请</li>
              </ul>
            </div>
          </template>
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
import orderDetail from '@/util/Order_Detail'
import globalDocumentHelper from '@/util/Global_DocumentHelper'

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
      currentPageIndex: 0,
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
      this.currentPageIndex += 1
      this.busy = true
      let getlisturl = apiport.Order_GetMyList
      if (this.OrderState === 4) {
        getlisturl = apiport.Order_GetMyRefundList
      }
      let model = {
        Token: this.$store.state.UserToken,
        OrderType: 2,
        OrderState: this.OrderState,
        pageIndex: this.currentPageIndex,
        pageSize: this.pageSize
      }
      this.$http({
        url: getlisturl,
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
    changestate (state, refresh) {
      if (state === this.OrderState && !refresh) {
        return true
      }
      this.OrderState = state
      this.currentPageIndex = 0
      this.orderlist = []
      this.tips = '正在加载'
      this.busy = false
      this.infinite()
    },
    CancelRefund (id) {
      let model = {
        Token: this.$store.state.UserToken,
        OrderGoodsId: id
      }
      this.$http({
        url: apiport.Order_CancelRefund,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('撤销申请', res.data)
          this.currentPageIndex = 0
          this.orderlist = []
          this.tips = '正在加载'
          this.busy = false
          this.infinite()
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    delOrderFun (id) {
      orderDetail.DeleteOrder(id, this.delcallback)
    },
    delcallback (id) {
      console.log('回调')
      let num
      this.orderlist.forEach(function (item, index) {
        if (item.OrderBaseId === id) {
          num = index
        }
      })
      this.orderlist.splice(num, 1)
    },
    remindDelivery (id) {
      orderDetail.RemindDelivery(id)
    },
    // 展示租赁协议
    showrentcontract (type) {
      if (type === 0) {
        globalDocumentHelper.SetDocument('seat-detail-longcontract', this.rentcontractcallback)
      } else {
        globalDocumentHelper.SetDocument('seat-detail-contract', this.rentcontractcallback)
      }
    },
    rentcontractcallback (text) {
      alert(text.Data.Content)
    },
    // 确认收货
    confirmExpress (id, type, money, goodsList) {
      let IsCanConfirmExpress = true
      for (let i = 0; i < goodsList.length; i++) {
        if (goodsList[i].Status === 2 || goodsList[i].Status === 3 || goodsList[i].Status === 4) {
          IsCanConfirmExpress = false
          break
        }
      }
      if (!IsCanConfirmExpress) {
        alert('当前订单中有退租中商品<br/>退租结束才能确认收货')
      } else {
        let r = confirm(type === 5 ? '确认收货' : '确认收货后' + money + '元将打给卖家')
        if (r) {
          let model = {
            Token: this.$store.state.UserToken,
            OrderBaseId: id
          }
          this.$http({
            url: apiport.Order_ConfirmExpress,
            method: 'post',
            data: qs.stringify({ reqJson: JSON.stringify(model) })
          })
            .then(res => {
              if (res.data.ResultNo === '00000000') {
                alert('操作成功')
                this.changestate(0, 1)
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    },
    // 我要付款
    gopay (orderid) {
      let model = {
        Token: this.$store.state.UserToken,
        SubOrderList: orderid,
        DiscountCouponList: ''
      }
      this.$http({
        url: apiport.Order_AddOrderParent,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          if (res.data.ResultNo === '00000000') {
            orderDetail.PageToGoodsPay(res.data.Data)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 取消订单
    cancleOrdel (orderid) {
      let r = confirm('是否确定关闭交易')
      if (r) {
        let model = {
          Token: this.$store.state.UserToken,
          OrderBaseId: orderid
        }
        this.$http({
          url: apiport.Order_CancelBase,
          method: 'post',
          data: qs.stringify({ reqJson: JSON.stringify(model) })
        })
          .then(res => {
            if (res.data.ResultNo === '00000000') {
              alert('操作成功')
              this.changestate(0, 1)
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
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
  width: 100%;
  overflow-x: auto;
  z-index: 2;
  .navbar-ul{
    display: flex;
    flex-wrap: nowrap;
    li{
      flex:1;
      min-width: 63px;
      font-size: 13px;
      text-align: center;
      line-height: .8rem;
      background-color: #fff;
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
        padding:.2rem 0;
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
          .thirdtext{
            color:#9fa0a0;
          }
          .refund{
            position: absolute;
            bottom: 0;
            right: 0;
            color: #ffa1ad;
            font-size: 14px;
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
        .comment{
          background-color: @base-ycolor3;
          border-color: @base-ycolor3;
          a{
            color:#fff;
          }
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
