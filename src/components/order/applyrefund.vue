<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <div style="height: 1px;"></div>
    <section class="sld clearfix qtmt">
      <span class="iconfont muststar">&#xe638;</span>
      <label class="lab-replace-txt">{{textObj.type}}</label>
      <div class="con">
          <span class="switchways thirdtext" @click="selectrefundtype(1)"><i class="iconfont" :class="{textcolorr: isrefundgoods === 1}" v-html="isrefundgoods === 1 ? '&#xe605;' : '&#xe66e;'"></i>仅退款</span>
          <span class="switchways thirdtext" v-if="refunddata.ExpressStatus !== 1" @click="selectrefundtype(2)"><i class="iconfont" :class="{textcolorr: isrefundgoods === 2}" v-html="isrefundgoods === 2 ? '&#xe605;' : '&#xe66e;'"></i>退款退货</span>
      </div>
    </section>
    <section class="sld clearfix">
      <span class="iconfont muststar">&#xe638;</span>
      <label class="lab-replace-txt" id="ApplyOarcauseLabel">{{textObj.cause}}</label>
      <div class="con">
        <a class="oarcause" @click="selectcause">
          <span :class="{thirdtext: !causetxt}">{{causetxt ? causetxt : '请选择'+ textObj.cause}}</span>
          <i class="iconfont">&#xe61e;</i>
        </a>
      </div>
    </section>
    <section class="sld clearfix" v-if="refunddata.OrderType === 1">
      <label class="lab-replace-txt">{{textObj.money}}</label>
      <div class="con return">
        <input type="number" oninput="Global_CommonHelper.ChechNumberOneDecimal(this, 10)" v-model="pointsPay"/>元
      </div>
    </section>
    <div class="canrefundmoney textcolorr" v-if="refunddata.OrderType === 1">{{pointsPay-refunddata.PointsBalancePay > 0 ? "现金: " + pointsPay-refunddata.PointsBalancePay + "元;" : ''}}{{refunddata.PointsBalancePay > 0 ? refunddata.PointsBalancePay > pointsPay ? "贝壳: " + pointsPay+ "个" : "贝壳: " + refunddata.PointsBalancePay + "个" : ''}}个</div>
    <section class="sld clearfix">
      <label class="lab-replace-txt" id="ApplyCauseTxtLabel">{{textObj.state}}</label>
      <div class="con mline">
        <input type="text" maxlength="200" class="inp" v-model="refunddata.RefundCauseTxt" placeholder="最多200字" />
      </div>
    </section>
    <template v-if="refunddata.ShowCardMsg">
      <section class="sld clearfix longTime">
        <label class="lab-replace-txt">银行卡开户行</label>
        <div class="con return">
          <input type="text" v-model="refunddata.BankName" maxlength="100" class="inp" placeholder="请输入银行卡开户行" />
        </div>
      </section>
      <section class="sld clearfix longTime">
        <span class="iconfont muststar">&#xe638;</span>
        <label class="lab-replace-txt">银行卡号</label>
        <div class="con return">
          <input type="tel" maxlength="20" v-model="refunddata.BankCardNo" class="inp" placeholder="请输入银行卡号" />
        </div>
      </section>
      <section class="sld clearfix longTime">
        <span class="iconfont muststar">&#xe638;</span>
        <label class="lab-replace-txt">银行卡账户名</label>
        <div class="con return">
          <input type="text"  v-model="refunddata.Name" maxlength="10" class="inp" placeholder="请输入银行卡账户名"/>
        </div>
      </section>
    </template>
    <section class="sld clearfix" v-if="!(refunddata.OrderType === 2 && refunddata.PointCashPay === 0) && refunddata.OrderType != 1">
      <label>退款退货协议</label>
      <div class="con">
        <a id="ZulinApplyAgreement" class="oarcause">
          <span class="thirdtext"></span>
          <i class="iconfont">&#xe61e;</i>
        </a>
      </div>
    </section>
    <imgupload :uploadimg='uploadimgdata' @passimgid="receiveimgid"></imgupload>
    <button class="abbot" @click="applyRefundConfirm">提交申请</button>
    <section class="refundcause" v-show="showcause">
      <div class="title"><a href="javascript:;" @click="hidecause">取消</a><a href="javascript:;" @click="confirmcause" class="frs">确定</a></div>
      <div class="item" id="ApplyRefundCauseList">
        <a href="javascript:;" v-for="(item, index) in refunddata.RefundCauseList" :key="index" :class="{active: causeindex ? causeindex === item.Type : item.Type === refunddata.RefundCauseType}" @click="activecause(item.Type, item.Name)">
          {{item.Name}}
        </a>
      </div>
    </section>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
import imgupload from '@/components/common/imgupload'

export default {
  name: 'ApplyRefund',
  components: {
    vHeader: head,
    imgupload
  },
  data () {
    return {
      headinfo: {title: '申请退租'},
      refunddata: {},
      uploadimgdata: {
        max: 3,
        imglist: [],
        type: 2
      },
      showcause: false,
      textObj: {
        type: '退租类型',
        cause: '退租原因',
        money: '退款金额',
        state: '退租说明'
      },
      isrefundgoods: 1,
      allpointsPay: 0,
      pointsPay: 0,
      holdcausetxt: null,
      causetxt: null,
      causeindex: null,
      confirming: false
    }
  },
  mounted () {
    let model = {
      OrderGoodsId: this.$route.params.id,
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Order_GetRefundByOrderGoodsId,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('申请退租', res.data)
        if (res.data.ResultNo === '00000000') {
          let data = res.data
          this.refunddata = data
          if (data.OrderType === 2 && data.PointCashPay === 0) {
            // 提篮归还
            this.headinfo.title = '申请归还'
            this.textObj.cause = '归还原因'
            this.textObj.state = '归还说明'
          } else if (data.OrderType === 2) {
            this.headinfo.title = '申请退租'
            this.textObj.cause = '退租原因'
            this.textObj.state = '退租说明'
            this.textObj.money = '退租金额'
          }
          if (data.Type) {
            this.isrefundgoods = data.Type
          } else if (data.ExpressStatus === 2) {
            this.isrefundgoods = 2
          }
          this.pointsPay = (parseFloat(data.PointsBalancePay + data.PointCashPay)).toFixed(2)
          this.allpointsPay = this.pointsPay
          if (data.RefundImgList && data.RefundImgList.length > 0) {
            data.RefundImgList.forEach(function (item) {
              item.imgbaseid = item.Id
              item.imgpath = item.Path + '@!standard_square_s'
            })
          }
          this.uploadimgdata.imglist = data.RefundImgList ? data.RefundImgList : []
          if (data.RefundCauseType) {
            let _that = this
            this.causeindex = data.RefundCauseType
            data.RefundCauseList.forEach(function (item) {
              if (item.Type === data.RefundCauseType) {
                _that.causetxt = item.Name
              }
            })
          }
          if (data.PayStatus !== 2) {
            alert('订单状态已改变，请刷新后操作')
            this.$router.back()
          }
        } else {
          this.$router.push({path: '/My/BuyIn'})
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    receiveimgid (id) {
      console.log(id)
    },
    selectcause () {
      this.showcause = true
    },
    // 取消按钮
    hidecause () {
      this.showcause = false
      this.causeindex = null
      this.holdcausetxt = null
    },
    confirmcause () {
      this.showcause = false
      this.causetxt = this.holdcausetxt
      this.refunddata.RefundCauseType = this.causeindex
      this.holdcausetxt = null
      this.causeindex = null
    },
    selectrefundtype (type) {
      this.isrefundgoods = type
    },
    activecause (type, text) {
      this.causeindex = type
      this.holdcausetxt = text
    },
    // 提交申请
    applyRefundConfirm () {
      if (!this.confirming) {
        this.confirming = true
        if (!this.refunddata.RefundCauseType) {
          alert('请选择' + this.textObj.cause)
          this.confirming = false
          return true
        }
        if (this.allpointsPay < this.pointsPay) {
          alert('退款金额不能大于付款金额')
          this.confirming = false
          return true
        }
        if (this.refunddata.ShowCardMsg) {
          if (!this.refunddata.BankCardNo || this.refunddata.BankCardNo.length === 0) {
            alert('请输入银行卡号')
            this.confirming = false
            return true
          } else if (this.refunddata.BankCardNo.length < 10 || this.refunddata.BankCardNo.length > 20) {
            alert('银行卡号位数不正确')
            this.confirming = false
            return true
          }
          if (!this.refunddata.Name || this.refunddata.Name.length === 0) {
            alert('请输入银行卡账户名')
            this.confirming = false
            return true
          } else if (this.refunddata.Name.length > 10) {
            alert('银行卡账户名不正确')
            this.confirming = false
            return true
          }
          if (this.refunddata.bankName && this.refunddata.bankName > 100) {
            alert('银行卡开户行不正确')
            this.confirming = false
            return true
          }
        }
        // 造提交的数据
        let Img = ''
        this.uploadimgdata.imglist.forEach(function (item) {
          Img += item.imgbaseid + ','
        })
        let Type = this.isrefundgoods
        let model = {
          OrderGoodsId: this.$route.params.id,
          RefundCauseType: this.refunddata.RefundCauseType,
          RefundCauseTxt: this.refunddata.RefundCauseTxt,
          Type: Type,
          Img: Img,
          Token: this.$store.state.UserToken,
          RefundMoney: this.pointsPay,
          BankCardNo: this.refunddata.BankCardNo ? this.refunddata.BankCardNo : '',
          Name: this.refunddata.Name ? this.refunddata.Name : '',
          BankName: this.refunddata.BankName ? this.refunddata.BankName : ''
        }
        this.$http({
          url: apiport.Order_ApplyRefund,
          method: 'post',
          data: qs.stringify({ reqJson: JSON.stringify(model) })
        })
          .then(res => {
            console.log('提交申请', res.data)
            if (res.data.ResultNo === '00000000') {
              console.log(res.data)
              alert('提交成功')
              this.$router.back()
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
.sld {
  position: relative;
  margin: .2rem 0;
  padding-left: .4rem;
  line-height: 1rem;
  background-color: #fff;
  &.qtmt{
    margin-top: 1rem;
  }
  .muststar {
    position: absolute;
    top: 0;
    left: 6px;
    color: #ff4965;
  }
  label {
    float: left;
    width: 2rem;
    margin: 0;
    font-size: 14px;
  }
  .con {
    float: left;
    width: 5.1rem;
    font-size: 12px;
    .switchways {
      display: inline-block;
      margin-right: .8rem;
    }
    .oarcause {
      display: block;
      .iconfont {
        position: absolute;
        top: 0;
        right: .2rem;
        color: #9fa0a0;
      }
    }
    .inp {
      width: 4.9rem;
      height: .8rem;
      line-height: .8rem;
      padding: .1rem .2rem .1rem 0;
      -webkit-appearance: none;
      border: 0;
      outline: 0;
      font-size: 12px;
      resize: none;
    }
  }
  .mline {
    height: 1rem;
  }
}
.textcolorr {
  color: @base-ycolor3;
}
.canrefundmoney{
  text-indent:2.4rem;
  font-size:12px;
}
.abbot {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #ff4965;
  border: 0;
  color: #fff;
  line-height: 1rem;
}
.refundcause {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #ededed;
  z-index: 1111;
  .title {
    background-color: #fbfbfb;
    padding: 0 .2rem;
    border-bottom: 1px solid #ededed;
    line-height: 1rem;
    .frs {
      float: right;
      color: #ff4965;
    }
  }
  .item a {
    display: block;
    text-align: center;
    line-height: 1rem;
    font-size: 12px;
    color: #9fa0a0;
    &.active {
      background-color: #efefef;
      font-size: 14px;
      color: #3e3a39;
    }
  }
}
</style>
