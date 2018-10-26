<template>
  <div>
    <v-header :headinfo="headinfo"  @rightbtn1click="skipchat"></v-header>
    <div style="height: 1px;"></div>
    <ordergoods :goodsinfo = 'refundhistorydata' class="mtop"></ordergoods>
    <div class="tklist">
      <section class="tkinfo" v-for="(item, index) in refundhistorydata.RefundList" :key="index">
        <!-- 卖家未处理 -->
        <template v-if="index === 0 && item.Status === 0">
          <div class="apply">
            <div class="title">
              <div class="pad">
                <span>来呗平台</span>
              </div>
            </div>
            <div class="con">
              <p>等待卖家处理</p>
            </div>
          </div>
        </template>
        <!-- 卖家已同意不退货 -->
        <template v-else-if="item.Status === 1 && item.Type === 1">
          <div class="apply">
            <div class="title">
              <div class="pad">
                <span>卖家</span>
                <span class="time">{{item.ReplyTime}}</span>
              </div>
            </div>
            <div class="con">
              <p>【卖家已同意申请】</p>
              <p v-if="item.RefundType === 1">{{'卖家同意了本次' + (refundhistorydata.PayType===5 ? '归还' : '退' + fontTxt + '申请')}}</p>
              <p v-else>{{'超时系统自动处理为同意' + refundhistorydata.PayType===5 ? '归还' : '退' + fontTxt + '申请'}}</p>
              <p v-if="refundhistorydata.PayType===5">{{'收取租金' + item.RefundMoney + '元'}}</p>
              <p v-else>{{'退款给买家' + item.RefundMoney + '元'}}</p>
            </div>
          </div>
        </template>
        <!-- 卖家已同意等待退货 -->
        <template v-else-if="item.Status === 1">
          <!-- 退货程序 -->
          <div class="apply" v-for="(item3, index3) in item.OrderGoodsRefundRecordList" :key="index3">
            <template v-if="item3.Status === 1">
              <div class="title">
                <div class="pad">
                  <span>来呗平台</span>
                </div>
              </div>
              <div class="con">
                <p>等待卖家处理</p>
              </div>
            </template>
            <template v-else-if="item3.Status === 2">
              <div class="title">
                <div class="pad">
                  <span>卖家</span>
                  <span class="time">{{item.ReplyTime}}</span>
                </div>
              </div>
              <div class="con">
                <p>【卖家确认收货{{refundhistorydata.PayType===5 ? '】' : '，退款给买家】'}}</p>
                <p>卖家确认收货，{{refundhistorydata.PayType===5 ? '收取租金' + item.RefundMoney : item.RefundMoney+'元退还给买家。'}}</p>
              </div>
            </template>
            <template v-else-if="item3.Status === 3">
              <div class="title">
                <div class="pad">
                  <span>卖家</span>
                  <span class="time">{{item3.GoodsReplyTime}}</span>
                </div>
              </div>
              <div class="con">
                <p>【卖家拒收退货】</p>
                <p>拒收原因：{{item3.GoodsReplyCauseType}}；</p>
                <p>拒收说明：{{item3.GoodsReplyCauseType}}</p>
                <p class="pz" v-if="item3.ReplyImgList && item3.ReplyImgList.length>0">
                  <span>凭证：</span>
                  <span class="pzi" v-for="(item4, index4) in item.ReplyImgList" :key="index4">
                    <img :src="item4.Path + '@!standard_square_s'">
                  </span>
                </p>
              </div>
            </template>
            <template v-if="item3.Status !== 0">
              <div class="apply">
                <div class="title">
                  <div class="pad">
                    <span>我</span>
                  </div>
                </div>
                <div class="con">
                  <p>【买家已退货】</p>
                  <p>物流公司：{{item3.LogisticsCompanyId}},物流单号：{{item3.LogisticsNo}}</p>
                </div>
              </div>
            </template>
          </div>
          <div class="apply">
            <div class="title">
              <div class="pad">
                <span>卖家</span>
                <span class="time">{{item.ReplyTime}}</span>
              </div>
            </div>
            <div class="con">
              <p>【卖家已同意申请,等待买家退货】</p>
              <p v-if="item.RefundType === 1">
                <template v-if="item.OrderGoodsRefundRecordList[0] && item.OrderGoodsRefundRecordList[0].Status === 0">
                  <template v-if="item.Type === item.RefundType">
                    {{'卖家同意了本次退' + fontTxt + '申请，买家如果在'}}
                    <span class="restTime-timer" ref="restTime" :data-date='refundhistorydata.BackTime'></span>
                    内未退货给卖家，系统将关闭本次申请；
                  </template>
                </template>
                <template v-else>
                  {{'卖家同意了本次退' + fontTxt + '申请'}}
                </template>
              </p>
              <p v-else>{{'超时系统自动处理为关闭本次退'+ fontTxt + '申请'}}</p>
              <p>退货地址：{{item.OrderGoodsRefundRecordList[0].GoodsRefundAddress}}({{item.OrderGoodsRefundRecordList[0].GoodsRefundContactName}}){{item.OrderGoodsRefundRecordList[0].GoodsRefundContactMobile}}</p>
            </div>
          </div>
        </template>
        <!-- 卖家拒绝了申请 -->
        <template v-else-if="item.Status === 2">
          <div class="apply">
            <div class="title">
              <div class="pad">
                <span>卖家</span>
                <span class="time">{{item.ReplyTime}}</span>
              </div>
            </div>
            <div class="con">
              <p>{{'【卖家拒绝了退' + fontTxt +'申请】'}}</p>
              <p>{{'拒绝原因：' + item.ReplyCauseType + '；'}}</p>
              <p>{{'拒绝说明：' + item.ReplyCauseTxt}}</p>
              <p class="pz" v-if="item.ReplyImgList && item.ReplyImgList.length>0">
                <span>凭证：</span>
                <span class="pzi" v-for="(item1, index1) in item.ReplyImgList" :key="index1">
                  <img :src="item1.Path + '@!standard_square_s'">
                </span>
              </p>
            </div>
          </div>
        </template>
        <!-- 买家撤销了申请 -->
        <template v-else-if="item.Status === 3">
          <div class="apply">
            <div class="title">
              <div class="pad">
                <span>我</span>
                <span class="time">{{item.ReplyTime}}</span>
              </div>
            </div>
            <div class="con">
              <p v-if="item.Type === 1">{{'【买家撤销了' + (refundhistorydata.PayType===5 ? '归还' : '退'+ fontTxt) +'申请】'}}</p>
              <p v-else-if="item.Type === 2">【买家撤销了退款退货申请】</p>
              <p v-else-if="item.Type === 3">【买家撤销了退租申请】</p>
            </div>
          </div>
        </template>
        <!-- 以上为回复，以下为申请 -->
        <template v-if="item.RefundCauseType !== ''">
          <div class="apply">
            <div class="title">
              <div class="pad">
                <span>我</span>
                <span class="time">{{item.CreateTime}}</span>
              </div>
            </div>
            <div class="con">
              <p v-if="index === refundhistorydata.RefundList.length-1">{{'【买家发起了' + (refundhistorydata.PayType===5 ? '归还申请' : '退' + fontTxt + '申请】')}}</p>
              <p v-else>{{'【买家修改了' + (refundhistorydata.PayType===5 ? '归还申请' : '退' + fontTxt + '申请】')}}</p>
              <p v-if="refundhistorydata.PayType===5 && item.Type === 1">{{'退' + fontTxt + '类型：仅退款'}}</p>
              <p v-else-if="refundhistorydata.PayType===5 && item.Type === 2">{{'退' + fontTxt + '类型：退款退货'}}</p>
              <p v-else-if="refundhistorydata.PayType===5 && item.Type === 3">{{'退' + fontTxt + '类型：退租退款'}}</p>
              <p>{{(refundhistorydata.PayType===5 ? '归还' : '退' + fontTxt) + '原因：'+ item.RefundCauseType +'；'}}</p>
              <p>{{(refundhistorydata.PayType===5 ? '归还' : '退' + fontTxt) + '说明：'+ item.RefundCauseTxt +'；'}}</p>
              <p>{{(refundhistorydata.PayType===5 ? '租金' : '退款') + '金额：'+ item.RefundMoney +'元；'}}</p>
              <p class="pz" v-if="item.RefundImgList && item.RefundImgList.length>0">
                <span>凭证：</span>
                <span class="pzi" v-for="(item2, index2) in item.RefundImgList" :key="index2">
                  <img :src="item2.Path + '@!standard_square_s'">
                </span>
              </p>
            </div>
          </div>
        </template>
      </section>
    </div>
    <div class="tkfoot">
      <ul>
        <li v-if="refundhistorydata.RefundList[0].Status === 0 || (refundhistorydata.RefundList[0].Status === 1 && refundhistorydata.RefundList[0].Type === 2 && refundhistorydata.RefundList[0].OrderGoodsRefundRecordList[0].Status === 3) || refundhistorydata.RefundList[0].Status === 2">
          <router-link :to='"/Order/ApplyRefund/" + refundhistorydata.OrderGoodsId'>修改申请</router-link>
        </li>
        <li v-if="refundhistorydata.RefundList[0].Status === 0" @click="CancelRefund(refundhistorydata.OrderGoodsId, refundhistorydata.RefundList[0].Type)">撤销申请</li>
        <li v-if="refundhistorydata.RefundList[0].Status === 1 && refundhistorydata.RefundList[0].Type === 2 && refundhistorydata.RefundList[0].OrderGoodsRefundRecordList[0].Status === 0">
          <router-link :to='"/Order/ReturnGoods/" + refundhistorydata.OrderGoodsId'>退货</router-link>
        </li>
        <li v-if="refundhistorydata.RefundList[0].Status === 3">
          <router-link :to='"/Order/ApplyRefund/" + refundhistorydata.OrderGoodsId'>我要{{refundhistorydata.PayType === 5 ? '归还' : '退' + fontTxt}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
import ordergoods from '@/components/order/ordergoodsmodule'
import orderDetail from '@/util/Order_Detail'

export default {
  name: 'ApplyRefund',
  components: {
    vHeader: head,
    ordergoods
  },
  data () {
    return {
      headinfo: {title: '退款详情', rightbtntext1: '&#xe67a;'},
      refundhistorydata: {
        RefundList: [{Status: 0}]
      },
      fontTxt: '款'
    }
  },
  mounted () {
    let model = {
      OrderGoodsId: this.$route.params.id,
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Order_GetRefundListByOrderGoodsId,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('退款详情', res.data)
        let data = res.data
        if (data.ResultNo === '00000000') {
          if (data.OrderType === 2) {
            this.fontTxt = '租'
            if (data.PayType === 5) {
              this.headinfo.title = '归还详情'
            } else {
              this.headinfo.title = '退租详情'
            }
          }
        } else {
          this.$router.push({path: '/My/BuyIn'})
        }
        this.refundhistorydata = data
        this.$nextTick(function () {
          this.restTimeFun()
        })
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    skipchat () {
      this.$router.push({path: '/wechat/im'})
    },
    restTimeFun () {
      if (!this.$refs.restTime) {
        return true
      }
      let el = this.$refs.restTime[0]
      let date = el.dataset.date
      let arr = date.split('-')
      let day = parseInt(arr[0])
      let hour = parseInt(arr[1])
      let minute = parseInt(arr[2]) || 0
      let second = parseInt(arr[3]) || 0
      let totalSeconds = day * 24 * 60 * 60 + hour * 60 * 60 + minute * 60 + second
      if (totalSeconds > 0) {
        var interval1 = setInterval(function () {
          if (totalSeconds < 0) {
            clearInterval(interval1)
            return true
          }
          day = Math.floor(totalSeconds / (60 * 60 * 24))
          hour = Math.floor(totalSeconds / (60 * 60)) - (day * 24)
          minute = Math.floor(totalSeconds / 60) - (day * 24 * 60) - (hour * 60)
          second = Math.floor(totalSeconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
          var dateStr =
          '<span class="textcolorr">' + (day <= 9 ? '0' + day.toString() : day.toString()) + '</span> 天 ' +
          '<span class="textcolorr">' + (hour <= 9 ? '0' + hour.toString() : hour.toString()) + '</span> 时 ' +
          '<span class="textcolorr">' + (minute <= 9 ? '0' + minute.toString() : minute.toString()) + '</span> 分 ' +
          '<span class="textcolorr">' + (second <= 9 ? '0' + second.toString() : second.toString()) + '</span> 秒 '
          el.innerHTML = dateStr
          totalSeconds--
        }, 1000)
      } else {
        el.parentNode.innerHTML = '超时系统自动处理退' + this.fontTxt + '申请；'
      }
    },
    CancelRefund (id, type) {
      let _that = this
      orderDetail.CancelRefund(id, this.$store.state.UserToken, type).then(function () {
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
.mtop{
  margin-top: 1rem;
  background-color: #fff;
}
.tkinfo {
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  &:last-child {
    margin-bottom: 1.4rem;
  }
  .apply{
    margin-top:.2rem;
  }
  .title{
    border-bottom: 1px solid #ededed;
    background-color: #fff;
    .pad{
      line-height: .8rem;
      padding: 0 .2rem;
    }
    .time{
      float: right;
      color: #9fa0a0;
    }
  }
  .con{
    padding: .1rem .2rem;
    line-height: .5rem;
    color: #9fa0a0;
    background-color: #fff;
    .pz{
      display: -webkit-box;
      display: flex;
    }
    .pzi{
      display: -webkit-box;
      flex: 1;
      max-width: 33%;
      text-align: right;
      img{
        width: 90%;
      }
    }
    /deep/.textcolorr{
      color:#ff9c00;
    }
  }
}
.tkfoot{
  position: fixed;
  left: 0;
  right: 0;
  bottom: -1px;
  width: 100%;
  z-index: 1000;
  ul{
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    padding: 0 .1rem;
    li{
      display: -webkit-box;
      flex: 1;
      -webkit-box-align: center;
      -webkit-box-pack: center;
      line-height: .8rem;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid #ededed;
      margin: .2rem .1rem;
      color: #3e3a39;
      background-color: #dcdddd;
    }
  }
}
</style>
