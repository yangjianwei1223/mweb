<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <div class="navbar">
      <ul class="navbar-ul">
        <li class="active"><span>全部</span></li>
        <li><span>待付款</span></li>
        <li><span>代发货</span></li>
        <li><span>待收货</span></li>
        <li><span>待评价</span></li>
        <li><span>退款/退货</span></li>
      </ul>
    </div>
    <section class="order-cont">
      <ul>
        <li>
          <div class="topxl">
            <div class="padf">
              2018-08-09 15:18<span class="state">交易关闭</span>
            </div>
          </div>
          <div class="item">
            <a url="https://t-mweb.95laibei.com/Order/ZulinDetail/18510">
              <div class="left">
                <img src="https://cdn.product.img.95laibei.com/171117170923432226.jpg@!standard_square_s">
              </div>
              <div class="center">
                <p>孕妇孕妇衣服</p>
                <p class="style">测试：aaa；</p>
              </div>
              <div class="right">
                <p>¥ 1</p>
                <p class="thirdtext">×1</p>
              </div>
            </a>
          </div>
          <div class="total">合计：¥<span>1</span>(含运费¥0)</div>
          <div class="o-tabbtn">
            <ul class="MyBuyInOrderOper">
              <li data-id="18510">删除订单</li>
            </ul>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'

export default {
  name: 'zulinbuyin',
  components: {
    vHeader: head
  },
  data () {
    return {
      headinfo: {title: '我的订单'},
      OrderState: 0,
      cunrrentPageIndex: 1,
      pageSize: 20
    }
  },
  mounted: function () {
    let model = {
      Token: this.$store.state.UserToken,
      OrderType: 2,
      OrderState: this.OrderStatus,
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
.navbar{
  position:fixed;
  left: 0;
  top: 1rem;
  overflow-x: auto;
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
      span{
        font-size: 18px;
      }
    }
  }
}
</style>
