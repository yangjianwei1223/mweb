<template>
  <div>
    <v-header :headinfo="headinfo" @rightbtn1click="skiporderlist"></v-header>
    <section class="secod sawtooth">
      <div class="paysuc">{{paystatus}}</div>
      <div class="paytotal">
        <div class="left">来呗平台</div>
        <div class="right"><span class="price priceimg"><span>{{pointquantity}}</span></span><span class="gstotal" v-html="paycompose"></span></div>
      </div>
      <div class="prolist">
        <p><label>商&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;品</label><span>{{goodstitle}}</span></p>
        <p><label>成交时间</label><span>{{bargaintime}}</span></p>
        <p><label>支付方式</label><span v-html="bargaintype"></span></p>
        <p><label>交易单号</label><span>{{bargaincode}}</span></p>
        <p><label>当前状态</label><span>{{currentstatus}}</span></p>
      </div>
    </section>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
export default {
  name: 'paysuccess',
  components: {
    vHeader: head
  },
  data () {
    return {
      headinfo: {title: '付款详情', rightbtntext1: '订单'},
      paystatus: '支付成功',
      goodstitle: '',
      bargaintime: '',
      pointquantity: 0,
      paycompose: '',
      bargaintype: '',
      bargaincode: '',
      currentstatus: '支付成功',
      ordertype: 2
    }
  },
  mounted () {
    let model = {
      ParentOrderId: this.$route.params.id,
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Order_GetBaseById,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('订单支付成功信息', res.data)
        let data = res.data
        this.paystatus = data.PayStatus === 1 ? '状态延迟' : '支付成功'
        this.goodstitle = data.GoodsTitle
        this.bargaintime = data.LastUpdateTime
        this.pointquantity = data.PointsQuantity
        this.bargaincode = data.OrderCode
        this.ordertype = data.OrderType
        // 支付方式
        if (data.PointsBalancePay > 0) {
          this.bargaintype = '贝壳'
          this.paycompose = '(<i class="shellgrey"></i>' + data.PointsBalancePay
          if (data.PointCashPay > 0) {
            this.bargaintype += '+现金'
            this.paycompose += '+&yen; ' + data.PointCashPay + ')'
          }
        } else if (data.PointCashPay > 0) {
          this.bargaintype = '现金'
          this.paycompose = '(&yen; ' + data.PointCashPay + ')'
        } else {
          this.bargaintype = '芝麻信用<img src="https://cdn.sys.img.95laibei.com/Content/Images/alipay.png">'
        }
        // 状态延迟
        if (data.PayStatus === 1) {
          this.currentstatus = '状态延迟（状态可能延迟，请稍后到订单详细页面查询，如有疑问请咨询客服）'
          this.pointquantity = '--'
          this.paycompose = ''
          this.bargaintype = ''
        }
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  },
  methods: {
    skiporderlist () {
      if (this.ordertype === 2) {
        this.$router.push({path: '/My/ZulinBuyIn'})
      } else {
        this.$router.push({path: '/My/BuyIn'})
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.secod{
  background-color: #fff;
  padding: 1.2rem 0 20px .2rem;
  position: relative;
  .paysuc{
    font-size: 18px;
    color: #ff9c00;
    line-height: 1rem;
    border-bottom: 1px solid #dcdddd;
    &::before{
      content: "\e606";
      font-family: iconfont;
      margin-right: .2rem;
      font-size: 20px;
      vertical-align: middle;
    }
  }
  .paytotal{
    padding: .1rem 0;
    line-height: .6rem;
    border-bottom: 1px solid #ededed;
    .left{
      font-size: 16px;
      font-weight: bold;
      line-height: 1rem;
    }
    .right{
      text-align: right;
      margin-right: .2rem;
      .price{
        font-size: 30px;
        color: #ff9c00;
        span:before{
          content: "";
          display: inline-block;
          width: 20px;
          height: 20px;
          vertical-align: text-bottom;
          background: url(https://cdn.sys.img.95laibei.com/Content/Images/shell_1.png) no-repeat center;
          background-size: 16px 16px;
          margin-bottom: 4px;
        }
      }
      .gstotal {
        font-size: 14px;
        color: #9fa0a0;
      }
    }
  }
  .prolist{
    padding-top: .2rem;
    color: #9fa0a0;
    p{
      min-height: 24px;
      label{
        width: 80px;
        float: left;
        margin: 0;
        font-size: 14px;
      }
      span{
        display: block;
        margin-left: 100px;
        margin-right: .2rem;
        font-size: 14px;
      }
    }
  }
}
.sawtooth {
    background-image: -webkit-gradient(linear,50% 0,0 100%,from(transparent), color-stop(.5,transparent),color-stop(.5,#efefef),to(#efefef)),
    -webkit-gradient(linear,50% 0,100% 100%,from(transparent), color-stop(.5,transparent),color-stop(.5,#efefef),to(#efefef));
    background-image: -moz-linear-gradient(50% 0 -45deg,transparent,transparent 50%,#efefef 50%,#efefef),
    -moz-linear-gradient(50% 0 -135deg,transparent,transparent 50%,#efefef 50%,#efefef);
    background-size: 20px 10px;
    background-repeat: repeat-x;
    background-position: 0 100%;
}
</style>
