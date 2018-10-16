<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="o-detail">
<<<<<<< HEAD
      <div v-if="orderstatus == 1 && paystatus == 1" class="receipttime">还剩 <span>{{RestDaysTime}}</span> 天 <span>{{RestHoursTime}}</span>小时关闭交易</div>
      <div v-else-if="orderstatus == 1 && expressstatus == 2" class="receipttime">还剩 <span>{{RestDaysTime}}</span> 天 <span>{{RestHoursTime}}</span>小时自动确认</div>
      <div class="borderbottom">
        <div class="pad">
          <p class="state">{{orderstatustext}}</p>
          <p>订单编号：{{OrderCode}}</p>
          <p>下单时间：{{CreateTime}}</p>
          <p>支付方式：{{PaymentMethod}}</p>
=======
      <div class="receipttime">还剩 <span>00</span> 天 <span>01</span>小时关闭交易</div>
      <div class="borderbottom">
        <div class="pad">
          <p class="state">等待买家付款</p>
          <p>订单编号：18101216012901</p>
          <p>下单时间：2018-10-12 16:01:29</p>
          <p>支付方式：未支付</p>
>>>>>>> 9ced28722433260d05ae238a29f13617858bfd6c
        </div>
      </div>
      <div class="o-add">
        <div class="pad1">
          <div class="line">
<<<<<<< HEAD
            <span class="name">收件人：{{Contact.name}}</span>
            <span class="tel">{{Contact.phone}}</span>
          </div>
          <div class="para">收货地址：{{Contact.address}}</div>
=======
            <span class="name">收件人：杨健伟</span>
            <span class="tel">15271947992</span>
          </div>
          <div class="para">收货地址：天津市天津市和平区嘎嘎嘎</div>
>>>>>>> 9ced28722433260d05ae238a29f13617858bfd6c
        </div>
        <div class="pad1" id="SelfLiftAddressDom" style="display:none;">
          <div class="para" id="SelfLiftAddress"></div>
        </div>
      </div>
      <div class="logistics" id="BuyDetailWuliu" style="display:none;">
      </div>
    </section>
    <!-- 商品信息 -->
    <section class="sectc">
<<<<<<< HEAD
      <div v-for="(item, index) in OrderGoodsList" :key="index" class="item clearfix">
        <div>
          <router-link :to='PayType !== 5 ? "/Seat/Detail/"+item.ProductBaseId : "/AlipayZMXY/RentSeatDetail/"+item.ProductBaseId'>
            <div class="left">
              <img :src='item.GoodsImgPath + "@!standard_square_s"'>
            </div>
            <div class="center">
              <p class="title">{{item.GoodsTitle}}</p>
              <p class="style thirdtext">{{item.GoodsPropertyName}}</p>
              <p v-if="RentDetailId > 0" class="thirdtext">租用期限：{{slt.RentName}}-{{RentAmount}}元</p>
            </div>
            <div class="right">
              <p>¥ {{item.GoodsPrice}}</p>
              <p class="thirdtext">×{{item.GoodsQuantity}}</p>
            </div>
          </router-link>
        </div>
        <ul class="menulist clearfix">
          <li v-if="(orderstatus === 1 && (item.Status === 1 && paystatus !== 1 || item.Status === 6) || (orderstatus ===2 && (item.Status === 1 || item.Status === 6))) && PayType === 5">申请归还</li>
          <li v-if="(orderstatus === 1 && (item.Status === 1 && paystatus !== 1 || item.Status === 6) || (orderstatus ===2 && (item.Status === 1 || item.Status === 6))) && PayType !== 5">申请退租</li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 2">退货中</li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 3">退货</li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 3">退租详情</li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 4">修改申请</li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 4 && item.RejectedType !== 2">撤销申请</li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 4 && item.RejectedType === 1">申请被拒绝</li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 4 && item.RejectedType === 2">退租被拒绝</li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 4 && item.RejectedType !== 1 && item.RejectedType !== 2 && PayType === 5">归还中</li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && item.Status === 4 && item.RejectedType !== 1 && item.RejectedType !== 2 && PayType !== 5">退租中</li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && (item.Status === 5 || item.Status === 8) && PayType ===5">归还成功</li>
          <li v-if="(orderstatus === 1 || orderstatus === 2) && (item.Status === 5 || item.Status === 8) && PayType !==5">退租成功</li>
        </ul>
=======
      <div class="item clearfix">
        <div>
          <a data-action-url="https://t-mweb.95laibei.com/Seat/Detail/8368">
            <div class="left">
              <img src="https://cdn.product.img.95laibei.com/180612134217477344.jpg@!standard_square_s">
            </div>
            <div class="center">
              <p class="title">芝麻信用测试商品，有运费哦</p>
              <p class="style thirdtext">领用方式:邮寄;</p>
            </div>
            <div class="right">
              <p>¥ 0.03</p>
              <p class="thirdtext">×1</p>
            </div>
          </a>
        </div>
        <ul class="menulist clearfix" id="BuyDetailGoodsOper_13004"></ul>
>>>>>>> 9ced28722433260d05ae238a29f13617858bfd6c
      </div>
    </section>
    <!-- 订单评价 -->
    <section class="order-comment">
    </section>
    <section class="paydetail">
<<<<<<< HEAD
      <div class="line"><div class="left">商品总价</div><span>¥ {{zulindata.ProductTotalPrice}}</span></div>
      <div class="line" v-if="zulindata.CouponPrice > 0"><div class="left">优惠券</div><span>-&yen; {{zulindata.CouponPrice}}</span></div>
      <div class="line"><div class="left">运费</div><span>¥ {{zulindata.FreightMoney}}</span></div>
    </section>
    <section class="paydetail">
      <div class="line"><div class="left">订单总价</div><span>&yen; {{zulindata.OrderMoney}}</span></div>
      <div class="line" v-if="PayType !== 5"><div class="left">贝壳抵扣</div><span>- &yen; {{zulindata.PointTotalPrice}}</span></div>
      <!-- 芝麻信用 -->
      <div class="line" v-if="PayType === 5"><div class="left">押金</div><span>¥ 0.00</span></div>
      <div class="line" v-if="PayType === 5"><div class="left">租金</div><span>¥ {{zulindata.rent_amount}}</span></div>
      <div class="line" v-if="PayType === 5"><div class="left">起租日期</div><span>{{zulindata.borrow_time}}</span></div>
      <div class="line" v-if="PayType === 5"><div class="left">到期日期</div><span>{{zulindata.expiry_time}}</span></div>
      <div class="line"><div class="left">实付款</div><span class="textcolorr">¥ {{zulindata.CashTotalPrice}}</span></div>
    </section>
    <section class="paydetail" style="margin-bottom:1rem;">
      <div class="center"><router-link to="/My/About"><span class="iconfont">&#xe65f; </span>联系官方客服</router-link></div>
=======
      <div class="line"><div class="left">商品总价</div><span>¥ 0.03</span></div>
      <div class="line"><div class="left">优惠券</div><span>¥ 0.00</span></div>
      <div class="line"><div class="left">运费</div><span>¥ 0.01</span></div>
    </section>
    <section class="paydetail">
      <div class="line"><div class="left">订单总价</div><span>¥ 0.04</span></div>
      <div class="line"><div class="left">贝壳抵扣</div><span>- ¥ 0</span></div>
      <div class="line"><div class="left">实付款</div><span class="textcolorr">¥ 0</span></div>
    </section>
    <section class="paydetail" style="margin-bottom:1rem;">
      <div class="center"><a data-action-url="/My/About?isback=true"><span class="iconfont">&#xe65f; </span>联系官方客服</a></div>
>>>>>>> 9ced28722433260d05ae238a29f13617858bfd6c
    </section>
    <section class="secsl">
      <div>备注：<span></span></div>
    </section>
    <!-- 底部菜单 -->
    <div class="order-cont">
      <div class="o-tabbtn">
        <ul id="BuyDetailOrderOper">
<<<<<<< HEAD
          <li v-if="paystatus === 2">租赁协议</li>
          <li v-if="orderstatus === 1 && paystatus === 1">我要付款</li>
          <li v-if="orderstatus === 1 && paystatus === 1">取消订单</li>
          <li v-if="orderstatus === 1 && expressstatus === 1">提醒发货</li>
          <li v-if="orderstatus === 1 && (expressstatus === 2 || expressstatus === 3) || orderstatus === 2">查看物流</li>
          <li v-if="orderstatus === 1 && expressstatus === 2">确认收货</li>
          <li v-if="orderstatus === 1 && expressstatus === 3 || orderstatus === 2 || orderstatus === 9" @click="deleteOrder(zulindata.OrderBaseId)">删除订单</li>
        </ul>
=======
          <li>
            <a onclick="Global_OrderHelper.OrderToParentPay(20009)" class="ui-link">我要付款</a>
          </li>
          <li data-id="20009" class="BuyDetailCancleOrdel">取消订单</li></ul>
>>>>>>> 9ced28722433260d05ae238a29f13617858bfd6c
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'

export default {
  name: 'zulindetail',
  components: {
    vHeader: head
  },
  data () {
    return {
      headinfo: {title: '订单信息'},
<<<<<<< HEAD
      zulindata: [],
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
      PayType: 5,
      IsExchange: 0,
      IsRefund: 0,
      Contact: {name: '', phone: '', address: ''},
      OrderGoodsList: [],
      RentDetailId: 0,
      RentAmount: 0,
      RentName: ''
=======
      orderstatus: 1,
      paystatus: 1,
      expressstatus: 1
>>>>>>> 9ced28722433260d05ae238a29f13617858bfd6c
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
<<<<<<< HEAD
        this.zulindata = data
        this.orderstatus = data.OrderStatus
        this.paystatus = data.PayStatus
        this.expressstatus = data.ExpressStatus
        this.RestDaysTime = data.RestDaysTime
        this.RestHoursTime = data.RestHoursTime
        this.OrderCode = data.OrderCode
        this.CreateTime = data.CreateTime
        this.PaymentMethod = data.PaymentMethod
        this.SelfLiftAddress = data.SelfLiftAddress
        this.PayType = data.PayType
        this.IsExchange = data.IsExchange
        this.IsRefund = data.IsRefund
        this.Contact.name = data.ContactName
        this.Contact.phone = data.ContactPhone
        this.Contact.address = data.FullAddress
        this.OrderGoodsList = data.OrderGoodsList
        this.RentDetailId = data.RentDetailId
        this.RentAmount = data.RentAmount
        this.RentName = data.RentName
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
          this.orderstatustext = this.PayType === 5 ? '归还成功' : '交易关闭'
        }
        // 押金条
        if (this.IsExchange === 1) {
          this.orderstatustext += '押金条未兑换'
        } else if (this.IsExchange === 2) {
          this.orderstatustext += '押金条未兑换'
        } else if (this.IsExchange === 3) {
          this.orderstatustext += '押金条已失效'
        }
        // 退货商品
        if (this.IsRefund) {
          this.orderstatustext += '有退货商品'
        }
=======
        this.orderstatus = data.orderstatus
        this.paystatus = data.PayStatus
        this.expressstatus = data.ExpressStatus
>>>>>>> 9ced28722433260d05ae238a29f13617858bfd6c
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
<<<<<<< HEAD
  },
  methods: {
    deleteOrder (id) {
      alert('删除订单')
    }
=======
>>>>>>> 9ced28722433260d05ae238a29f13617858bfd6c
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
  .receipttime{
    background-color: #efefef;
    padding-left: .2rem;
    line-height: .8rem;
    span{
      color: #ff4965;
    }
  }
  .borderbottom {
    border-bottom: 1px solid #ededed;
  }
  .pad {
    padding: .4rem .2rem;
    position: relative;
    .state {
      font-size: 16px;
<<<<<<< HEAD
      color: #ff9c00;
=======
>>>>>>> 9ced28722433260d05ae238a29f13617858bfd6c
      &:before {
        content: "\e60e";
        font-family: iconfont;
        margin-right: .1rem;
        font-weight: 600;
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
}
.sectc {
  box-shadow: 0 -1px 1px #ebebec, 0 1px 1px #ebebec;
  background-color: #fff;
  opacity: 1;
  a{
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
