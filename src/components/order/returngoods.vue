<template>
  <div>
    <v-header :headinfo="headinfo" @hidediv="showexpress"></v-header>
    <div style="height: 1px;"></div>
    <div v-show="!showpage">
      <section class="return">
          <div class="o-add">
              <div class="pad1">
                  <p class="state thirdtext">请发货给卖家</p>
                  <div class="para">退货时间:剩余<span class="textcolorr">{{refunddata.RefundRestTime}}</span>逾期未退货申请将自动关闭</div>
                  <div class="para">退货地址:{{refunddata.GoodsRefundAddress+'(' + refunddata.GoodsRefundContactName + '收)'}}</div>
                  <div class="para">联系电话: {{refunddata.GoodsRefundContactMobile}}</div>
              </div>
          </div>
      </section>
      <p class="thirdtext" style="padding-left:.2rem;line-height:30px;">填写退货物流信息</p>
      <section class="sginfo">
          <div class="wlgs"><div class="title">物流公司</div><div class="core"><a href="javascript:;" @click="selectexpress"><span><span :class="{thirdtext: !currentexpress.name}">{{currentexpress.name ? currentexpress.name : '请选择物流公司'}}</span></span><i class="arrow iconfont">&#xe61e;</i></a></div></div>
          <div class="kddh"><div class="title">快递单号</div><div class="core"><input type="text" maxlength="18" class="inp" placeholder="请输入快递单号" v-model="currentexpress.code" /></div></div>
          <div class="kddh"><div class="title">退款说明</div><div class="core"><input type="text" maxlength="200" class="inp" placeholder="最多200字" v-model="currentexpress.state" /></div></div>
      </section>
      <div id="upload-box" class="form-widget">
          <imgupload :uploadimg='uploadimgdata' @passimgid="receiveimgid"></imgupload>
      </div>
      <button class="loginbtn" @click="ReturnGoodsConfirm">确认发货</button>
    </div>
    <div class="expresslist" v-show="showpage">
      <ul>
        <li v-for="(item, index) in refunddata.ExpressList" :key="index" @click="sureexpress(item.Type, item.Name)">{{item.Name}}</li>
      </ul>
    </div>
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
      headinfo: {title: '退货', leftfun: 1},
      refunddata: {},
      uploadimgdata: {
        max: 3,
        imglist: [],
        type: 2
      },
      showpage: false,
      currentexpress: {
        type: '',
        name: '',
        code: '',
        state: ''
      },
      isDisabled: false
    }
  },
  mounted () {
    let model = {
      OrderGoodsId: this.$route.params.id,
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Order_GetRefundGoods,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('退货', res.data)
        if (res.data.ResultNo === '00000000') {
          let data = res.data
          this.refunddata = data
        } else {
          alert(res.data.ResultRemark)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    receiveimgid (imgid) {
      console.log(imgid)
    },
    showexpress () {
      if (this.showpage) {
        this.showpage = false
      } else {
        this.$router.back()
      }
    },
    selectexpress () {
      this.showpage = true
    },
    sureexpress (type, name) {
      this.showpage = false
      this.currentexpress.type = type
      this.currentexpress.name = name
    },
    ReturnGoodsConfirm () {
      if (!this.isDisabled) {
        this.isDisabled = true
        if (!this.currentexpress.name) {
          alert('请选择物流公司')
          this.isDisabled = false
          return true
        }
        if (!this.currentexpress.code) {
          alert('请输入快递单号')
          this.isDisabled = false
          return true
        }
        if (this.currentexpress.code.length < 10) {
          alert('快递单号需为10-18字符')
          this.isDisabled = false
          return true
        }
        let Img = ''
        this.uploadimgdata.imglist.forEach(element => {
          Img += element.imgbaseid + ','
        })
        let model = {
          OrderGoodsId: this.$route.params.id,
          LogisticsCompanyId: this.currentexpress.type,
          LogisticsNo: this.currentexpress.code,
          Remark: this.currentexpress.state,
          Img: Img,
          Token: this.$store.state.UserToken
        }
        this.$http({
          url: apiport.Order_ApplyGoodsRefund,
          method: 'post',
          data: qs.stringify({ reqJson: JSON.stringify(model) })
        })
          .then(res => {
            console.log('退货成功', res.data)
            this.$router.back()
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
.return{
  margin-top: 1rem;
  font-size: 14px;
  background-color: #fff;
  margin-bottom: .2rem;
  box-shadow: 0 1px 1px #ebebec, 0 -1px 1px #ebebec;
  .pad1{
    padding: .2rem;
  }
  .state{
    font-size: 16px;
    margin-bottom: .1rem;
    color: #9fa0a0;
    &:before {
      content: "\e60e";
      font-family: iconfont;
      margin-right: .1rem;
      font-weight: 600;
    }
  }
  .textcolorr {
    color: #ff9c00;
  }
}
.sginfo {
  border-top: 1px solid #ebebeb;
  border-bottom: 1px solid #ebebeb;
  background-color: #fff;
  line-height: .9rem;
  padding-left: .2rem;
  &>div {
    display: flex;
    .title{
      width: 2rem;
      display: -webkit-box;
    }
    .core{
      display: -webkit-box;
      flex: 1;
      -webkit-box-align: center;
    }
  }
  .wlgs {
    position: relative;
    a{
      display: block;
      width: 100%;
    }
    .arrow {
      position: absolute;
      right: .2rem;
      top: 0;
    }
  }
  .kddh{
    border-top: 1px solid #ededed;
    input{
      border: none;
      outline: none;
      display: block;
      width: 100%;
      padding-right: .2rem;
      box-sizing: border-box;
    }
  }
}
.loginbtn {
  display: inline-block;
  width: 7rem;
  background-color: #f1bc19;
  border: none;
  font-size: 18px;
  color: #fff!important;
  line-height: .8rem;
  margin: .4rem .25rem .2rem;
  text-align: center;
}
.expresslist{
  margin-top: 1.4rem;
  li{
    font-size: 16px;
    display: -webkit-box;
    position: relative;
    background-color: #fff;
    width: 100%;
    height: .86rem;
    line-height: .86rem;
    padding-left: .2rem;
    box-sizing: border-box;
    border-bottom: 1px solid #ededed;
  }
}
</style>
