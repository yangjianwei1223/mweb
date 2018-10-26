<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="o-detail">
      <div class="borderbottom">
        <div class="pad">
          <p class="state">
            {{orderstatustext}}
            <span v-if="orderstatus == 1 && paystatus == 1">{{"(还剩 " + RestDaysTime + "天" + RestHoursTime + "小时关闭交易)"}}</span>
            <span v-else-if="orderstatus == 1 && paystatus != 1 && expressstatus == 2 && !IsRefund">{{"(还剩 " + RestDaysTime + "天" + RestHoursTime + "小时自动确认)"}}</span>
            <span v-if="IsRefund">(有退货商品)</span>
          </p>
          <p>订单编号：{{OrderCode}}</p>
          <p>下单时间：{{CreateTime}}</p>
          <p>支付方式：{{PaymentMethod}}</p>
        </div>
      </div>
      <div class="o-add borderbottom">
        <div class="pad1">
          <div class="line">
            <span class="name">收件人：{{Contact.name}}</span>
            <span class="tel">{{Contact.phone}}</span>
          </div>
          <div class="para">收货地址：{{Contact.address}}</div>
        </div>
        <div class="pad1" id="SelfLiftAddressDom" style="display:none;">
          <div class="para" id="SelfLiftAddress"></div>
        </div>
      </div>
      <div class="logistics" v-if="expressstatus !== 1">
        <div>
          <router-link :to='"/Order/Express/" + buydata.OrderBaseId'>
            <p>【物流信息】</p>
            <p>{{logicdata.ExpressList[0].Traces[0].AcceptStation}}</p>
            <p>{{logicdata.ExpressList[0].Traces[0].AcceptTime}}</p>
            <span class="arrow iconfont">&#xe61e;</span>
          </router-link>
        </div>
      </div>
    </section>
    <!-- 商品信息 -->
    <section class="sectc">
      <div v-for="(item, index) in buydata.OrderGoodsList" :key="index" class="item clearfix">
        <div>
          <router-link :to='item.IsSeatProduct ? "/Seat/Detail/"+item.ProductBaseId : "/Optimization/Detail/"+item.ProductBaseId' class="goodsa">
            <div class="left">
              <img :src='item.GoodsImgPath + "@!standard_square_s"'>
            </div>
            <div class="center">
              <p class="title">{{item.GoodsTitle}}</p>
              <p class="style thirdtext">{{item.GoodsPropertyName}}</p>
            </div>
            <div class="right">
              <p>¥ {{item.GoodsPrice}}</p>
              <p class="thirdtext">×{{item.GoodsQuantity}}</p>
            </div>
          </router-link>
        </div>
        <ul class="menulist clearfix">
          <li v-if="(orderstatus === 1 && (item.Status === 1 && paystatus !== 1 || item.Status === 6) || (orderstatus ===2 && (item.Status === 1 || item.Status === 6)))"><router-link :to='{path: "/Order/ApplyRefund/" + item.OrderGoodsId}'>申请退款</router-link></li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 2"><router-link :to='{path: "/Order/RefundHistory/" + item.OrderGoodsId}'>退货中</router-link></li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 3"><router-link :to='{path: "/Order/ReturnGoods/" + item.OrderGoodsId}'>退货</router-link></li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 3"><router-link :to='{path: "/Order/RefundHistory/" + item.OrderGoodsId}'>退货详情</router-link></li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 4"><router-link :to='{path: "/Order/ApplyRefund/" + item.OrderGoodsId}'>修改申请</router-link></li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 4 && item.RejectedType !== 2" @click="CancelRefund(item.OrderGoodsId)">撤销申请</li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 4 && item.RejectedType === 1"><router-link :to='{path: "/Order/RefundHistory/" + item.OrderGoodsId}'>申请被拒绝</router-link></li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 4 && item.RejectedType !== 1 && item.RejectedType !== 2"><router-link :to='{path: "/Order/RefundHistory/" + item.OrderGoodsId}'>退款中</router-link></li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && (item.Status === 5 || item.Status === 8)"><router-link :to='{path: "/Order/RefundHistory/" + item.OrderGoodsId}'>退款成功</router-link></li>
        </ul>
      </div>
    </section>
    <!-- 订单评价 -->
    <section class="order-comment" v-if="buydata.CommentStatus === 1">
      <h3 @click="triggercomment">我的评价<span class="iconfont" :class="{colored: showcomment}"></span></h3>
      <section class="mmcomment" v-show="showcomment">
        <commentitem :commentlist='commentdata.Data'></commentitem>
      </section>
    </section>
    <section class="paydetail">
      <div class="line"><div class="left">商品总价</div><span>¥ {{buydata.ProductTotalPrice}}</span></div>
      <div class="line" v-if="buydata.CouponPrice > 0"><div class="left">优惠券</div><span>-&yen; {{buydata.CouponPrice}}</span></div>
      <div class="line"><div class="left">运费</div><span>¥ {{buydata.FreightMoney}}</span></div>
    </section>
    <section class="paydetail">
      <div class="line"><div class="left">订单总价</div><span>&yen; {{buydata.OrderMoney}}</span></div>
      <div class="line"><div class="left">贝壳抵扣</div><span>- &yen; {{buydata.PointTotalPrice}}</span></div>
      <div class="line"><div class="left">实付款</div><span class="textcolorr">¥ {{buydata.CashTotalPrice}}</span></div>
    </section>
    <section class="paydetail" style="margin-bottom:1rem;">
      <div class="center"><router-link to="/My/About"><span class="iconfont">&#xe65f; </span>联系官方客服</router-link></div>
    </section>
    <section class="secsl">
      <div>备注：<span></span></div>
    </section>
    <!-- 底部菜单 -->
    <div class="order-cont">
      <div class="o-tabbtn">
        <ul id="BuyDetailOrderOper">
          <li v-if="orderstatus === 1 && paystatus === 1" @click="gopay(buydata.OrderBaseId)">我要付款</li>
          <li v-if="orderstatus === 1 && paystatus === 1" @click="cancleOrdel(buydata.OrderBaseId)">取消订单</li>
          <li v-if="orderstatus === 1 && paystatus !==1 && expressstatus === 1" @click="remindDelivery(buydata.OrderBaseId)">提醒发货</li>
          <li v-if="orderstatus === 1 && (expressstatus === 2 || expressstatus === 3) || orderstatus === 2"><router-link :to='"/Order/Express/" + buydata.OrderBaseId'>查看物流</router-link></li>
          <li v-if="orderstatus === 1 && expressstatus === 2" @click="confirmExpress(buydata.OrderBaseId, 0, buydata.OrderMoney, buydata.OrderGoodsList)">确认收货</li>
          <li v-if="orderstatus === 1 && expressstatus === 3 || orderstatus === 2 || orderstatus === 9" @click="deleteOrder(buydata.OrderBaseId)">删除订单</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
import commentitem from '@/components/common/commentitem'
import orderDetail from '@/util/Order_Detail'

export default {
  name: 'buydetail',
  components: {
    vHeader: head,
    commentitem
  },
  data () {
    return {
      headinfo: {title: '订单信息'},
      buydata: [],
      orderstatus: 1,
      paystatus: 1,
      expressstatus: 1,
      RestDaysTime: '00',
      RestHoursTime: '00',
      OrderCode: 0,
      CreateTime: '',
      PaymentMethod: '',
      SelfLiftAddress: '',
      orderstatustext: '等待买家付款',
      IsRefund: 0,
      Contact: {name: '', phone: '', address: ''},
      logicdata: {ExpressList: [{Traces: [{AcceptStation: '', AcceptTime: ''}]}]}, // 物流信息
      showcomment: false,
      commentdata: [] // 评价信息
    }
  },
  mounted () {
    let model = {
      OrderBaseId: this.$route.params.id,
      OrderType: 2,
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Order_GetBaseDetailByID,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('订单信息', res.data)
        let data = res.data
        this.buydata = data
        this.orderstatus = data.OrderStatus
        this.paystatus = data.PayStatus
        this.expressstatus = data.ExpressStatus
        this.RestDaysTime = data.RestDaysTime
        this.RestHoursTime = data.RestHoursTime
        this.OrderCode = data.OrderCode
        this.CreateTime = data.CreateTime
        this.PaymentMethod = data.PaymentMethod
        this.SelfLiftAddress = data.SelfLiftAddress
        this.IsRefund = data.IsRefund
        this.Contact.name = data.ContactName
        this.Contact.phone = data.ContactPhone
        this.Contact.address = data.FullAddress
        // 订单状态文字
        if (this.orderstatus === 1) {
          if (this.paystatus === 1) {
            this.orderstatustext = '等待买家付款'
          } else if (this.expressstatus === 1) {
            this.orderstatustext = '等待卖家发货'
          } else if (this.expressstatus === 2) {
            this.orderstatustext = '等待买家收货'
          } else {
            this.orderstatustext = '交易成功'
          }
        } else if (this.orderstatus === 2) {
          this.orderstatustext = '交易成功'
        } else if (this.orderstatus === 9) {
          this.orderstatustext = '交易关闭'
        }
        // 是否获取物流
        if (this.expressstatus !== 1) {
          let _that = this
          orderDetail.getExpressData(this.$route.params.id, this.$store.state.UserToken).then(function (res) {
            _that.logicdata = res
          })
        }
        // 是否获取评价
        if (res.data.CommentStatus === 1) {
          this.getCommentById(this.$route.params.id)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    deleteOrder (id) {
      orderDetail.DeleteOrder(id, this.delecallback)
    },
    delecallback (id) {
      this.$router.push('/My/BuyIn')
    },
    getCommentById (id) {
      let model = {
        Token: this.$store.state.UserToken,
        InfomationType: 1,
        InfomationRelationId: id
      }
      this.$http({
        url: apiport.CommentBase_GetBaseById,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          this.commentdata = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    triggercomment () {
      this.showcomment = !this.showcomment
    },
    gopay (orderid) {
      orderDetail.gopay(orderid, this.$store.state.UserToken)
    },
    // 取消订单
    cancleOrdel (orderid) {
      orderDetail.cancleOrdel(orderid, this.$store.state.UserToken).then(function (res) {
        console.log(res)
      })
    },
    // 确认收货
    confirmExpress (id, type, money, goodsList) {
      orderDetail.confirmExpress(id, type, money, goodsList, this.$store.state.UserToken)
    },
    rentcontractcallback (text) {
      alert(text.Data.Content)
    },
    remindDelivery (id) {
      orderDetail.RemindDelivery(id)
    },
    // 撤销退款申请
    CancelRefund (id) {
      let _that = this
      orderDetail.CancelRefund(id, this.$store.state.UserToken).then(function () {
        _that.CancelRefundcallback()
      })
    },
    CancelRefundcallback () {
      console.log('shuaxin')
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.o-detail {
  font-size: 14px;
  background-color: #fff;
  margin-bottom: .2rem;
  box-shadow: 0 1px 1px #ebebec, 0 -1px 1px #ebebec;
  padding-top: 1rem;
  .borderbottom {
    border-bottom: 1px solid #ededed;
  }
  .pad {
    padding: .4rem .2rem;
    position: relative;
    .state {
      font-size: 16px;
      color: #ff9c00;
      &:before {
        content: "\e60e";
        font-family: iconfont;
        margin-right: .1rem;
        font-weight: 600;
      }
      /deep/span{
        font-size: 12px;
        color: #9fa0a0;
      }
    }
    p{
      margin-bottom: .1rem;
    }
  }
  .o-add {
    position: relative;
    font-size: 14px;
    color: #9fa0a0;
    .pad1{
      padding: .2rem;
      .line{
        margin-bottom: .15rem;
      }
      .name{
        width: 2.8rem;
        display: inline-block;
        .onelinetext();
        word-break: break-all;
        word-wrap: break-word;
      }
      .tel{
        float: right;
      }
    }
  }
  .logistics {
    position: relative;
    padding: .2rem;
    color: #33a6ff;
    p{
      margin-right: .4rem;
      margin-bottom: .1rem;
    }
    .arrow {
      position: absolute;
      top: .6rem;
      right: .2rem;
      color: #9fa0a0;
    }
  }
}
.sectc {
  box-shadow: 0 -1px 1px #ebebec, 0 1px 1px #ebebec;
  background-color: #fff;
  opacity: 1;
  .goodsa{
    display: flex;
    padding: .2rem 0;
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
        .twolinetext();
        height: .8rem;
        line-height: .4rem;
      }
      .style{
        line-height: .3rem;
        min-height: .6rem;
        color:#9fa0a0;
      }
    }
    .right{
      min-width: 1.4rem;
      margin-right: .2rem;
      text-align: right;
      position: relative;
    }
  }
  .thirdtext{
    color:#9fa0a0;
  }
  .menulist {
    background-color: #fff;
    margin-bottom: .2rem;
    padding-bottom: .2rem;
    li{
      float: right;
      margin-right: .2rem;
      width: 60px;
      border: 1px solid #3e3a39;
      text-align: center;
      padding: 4px 0;
      border-radius: 4px;
      font-size: 12px;
    }
  }
}
.order-comment{
  margin-bottom: .2rem;
  background-color: #fff;
  h3{
    height: .8rem;
    line-height: .8rem;
    padding: 0 .2rem;
    border-bottom: 1px solid #f2f2f2;
    font-size: 14px;
    color: #333;
    span{
      float: right;
      width: .5rem;
      text-align: right;
      color: #cbcbcb;
      &.colored{
        color: @base-ycolor3;
        &::before{
          content: '\e60c'
        }
      }
      &:before{
        content: '\e609'
      }
    }
  }
}
.paydetail {
  background-color: #fff;
  padding: .2rem;
  border-bottom: 1px solid #dedddd;
  font-size: 14px;
  line-height: 24px;
  .line {
    text-align: right;
    .left{
      float: left;
    }
    .textcolorr{
      color: #ff9c00;
    }
  }
  .center{
    text-align: center;
  }
}
.secsl {
  margin: .2rem 0;
  background-color: #fff;
  line-height: .8rem;
  text-align: left;
  padding: 0 .2rem;
  &>div{
    overflow: hidden;
    word-break: break-all;
    line-height: 2;
  }
}
.order-cont{
  position: fixed;
  left: 0;
  right: 0;
  bottom: -1px;
  width: 100%;
  z-index: 1000;
  background-color: #fff;
  .o-tabbtn {
    width: 100%;
    height: .8rem;
  }
  ul {
    float: right;
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
</style>
