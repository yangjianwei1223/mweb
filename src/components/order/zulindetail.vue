<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="o-detail">
      <div class="receipttime">还剩 <span>00</span> 天 <span>01</span>小时关闭交易</div>
      <div class="borderbottom">
        <div class="pad">
          <p class="state">等待买家付款</p>
          <p>订单编号：18101216012901</p>
          <p>下单时间：2018-10-12 16:01:29</p>
          <p>支付方式：未支付</p>
        </div>
      </div>
      <div class="o-add">
        <div class="pad1">
          <div class="line">
            <span class="name">收件人：杨健伟</span>
            <span class="tel">15271947992</span>
          </div>
          <div class="para">收货地址：天津市天津市和平区嘎嘎嘎</div>
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
      </div>
    </section>
    <!-- 订单评价 -->
    <section class="order-comment">
    </section>
    <section class="paydetail">
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
    </section>
    <section class="secsl">
      <div>备注：<span></span></div>
    </section>
    <!-- 底部菜单 -->
    <div class="order-cont">
      <div class="o-tabbtn">
        <ul id="BuyDetailOrderOper">
          <li>
            <a onclick="Global_OrderHelper.OrderToParentPay(20009)" class="ui-link">我要付款</a>
          </li>
          <li data-id="20009" class="BuyDetailCancleOrdel">取消订单</li></ul>
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
      orderstatus: 1,
      paystatus: 1,
      expressstatus: 1
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
        this.orderstatus = data.orderstatus
        this.paystatus = data.PayStatus
        this.expressstatus = data.ExpressStatus
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
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
