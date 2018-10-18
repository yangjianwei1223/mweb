<template>
  <div>
    <v-header :headinfo="headinfo" @hidediv="pagetrigger(1)"></v-header>
    <section class="miheader">
      <div>
        <div class="point">{{currentPointsBalance}}</div>
        <div class="shellname">贝壳</div>
      </div>
      <div class="topic">了解贝壳的用途 &gt;</div>
    </section>
    <section class="sectitle clearfix">
      <span>贝壳明细</span>
      <span class="iconfont" @click="triggerpoint">&#xe618;</span>
      <div class="menu" v-show="showpointcheck">
        <span class="tri"></span>
        <a href="javascript:;" @click="searcheclick(0)"><i class="iconfont">&#xe606;</i>全部</a>
        <a href="javascript:;" @click="searcheclick(1)"><i class="iconfont">&#xe634;</i>收入</a>
        <a href="javascript:;" @click="searcheclick(-1)"><i class="iconfont">&#xe635;</i>支出</a>
      </div>
    </section>
    <div v-infinite-scroll="infinite" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="_v-container">
      <section v-for="(item, index) in listdata" :key="index" class="pointsec">
        <div class="fline clearfix">
          <div style="color:#ff9c00;" class="left">{{parseFloat(item.PointsQuantity) > 0 ? '+'+item.PointsQuantity : item.PointsQuantity}}</div>
          <div class="right">{{item.OrderType}}</div>
        </div>
        <div class="sline clearfix">
          <div class="left">余额：{{item.PointsBalance}}</div>
          <div class="right">{{item.CreateTime}}</div>
        </div>
        <div class="para">{{item.Remark}}</div>
      </section>
    </div>
    <div tip="正在加载" v-if="showLoading" class="tips">{{tips}}</div>
    <go-top></go-top>
  </div>
</template>

<script>
import Vue from 'vue'
import apiport from '../../util/api'
import qs from 'qs'
import infiniteScroll from 'vue-infinite-scroll'
import BaseInfoHelper from '@/util/Global_BaseInfoHelper'

import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'
Vue.use(infiniteScroll)

export default {
  name: 'points',
  components: {
    'vHeader': head,
    goTop
  },
  data () {
    return {
      headinfo: {'title': '我的贝壳'},
      listdata: [],
      page: 0,
      busy: true,
      showLoading: true,
      tips: '正在加载',
      userid: '',
      status: 0,
      showpointcheck: false,
      currentPointsBalance: 0
    }
  },
  beforeCreate () {
    let _that = this
    BaseInfoHelper.GetLoginInfo().then(function (res) {
      console.log(res)
      _that.userid = res.BaseId
      _that.busy = false
    })
  },
  mounted () {
    // 获取余额
    // let model = {
    //   Token: BaseInfoHelper.GetToken()
    // }
    // this.$http({
    //   url: apiport.Account_GetBaseByToken,
    //   method: 'post',
    //   data: qs.stringify({ reqJson: JSON.stringify(model) })
    // })
    //   .then(res => {
    //     if (res.data.ResultNo === '00000000') {
    //       this.currentPointsBalance = res.data.PointsUsable
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
  },
  methods: {
    infinite (done) {
      this.page += 1
      this.busy = true
      let model = {
        UserId: this.userid,
        pageIndex: this.page,
        pageSize: 20,
        status: this.status
      }
      this.$http({
        url: apiport.Points_GetBaseList,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          if (res.data.Data.length > 0) {
            this.listdata = this.listdata.concat(res.data.Data)
            this.busy = false
            if (this.page === 1 && this.status === 0) {
              this.currentPointsBalance = this.listdata[0].PointsBalance
            }
          } else {
            this.tips = '已经到底了...'
            this.busy = true
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    triggerpoint () {
      this.showpointcheck = !this.showpointcheck
    },
    searcheclick (index) {
      this.showpointcheck = false
      this.status = index
      this.listdata = []
      this.busy = false
      this.page = 0
      this.tips = '正在加载'
      this.infinite()
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.miheader{
  position: relative;
  margin-top: 1rem;
  height: 2rem;
  padding-left: .2rem;
  background: url(https://cdn.sys.img.95laibei.com/Content/Images/mypoint-top-back.jpg) no-repeat center;
  background-size: contain;
  color: #fff;
  .point{
    display: inline-block;
    padding-top: .5rem;
    text-align: center;
    font-size: 30px;
    line-height: 1;
  }
  .shellname {
    display: inline-block;
    font-size: 11px;
    margin-left: .2rem;
  }
  .topic {
    font-size: 11px;
    margin-top: .2rem;
  }
}
.sectitle {
  position: relative;
  background-color: #f7f8f8;
  padding: 0 .2rem;
  line-height: .8rem;
  span{
    float: left;
    font-size: 16px;
  }
  &>.iconfont{
    float: right;
    font-size: 20px;
    padding-left: 20px;
  }
  .menu {
    z-index: 2;
    position: absolute;
    top: .7rem;
    right: .2rem;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 1px 1px 1px #ebebec, -1px -1px 1px #ebebec;
    font-size: 16px;
    .tri{
      position: absolute;
      top: -10px;
      right: 8px;
      display: block;
      width: 0;
      height: 0;
      border-top: none;
      border-right: 8px solid transparent;
      border-bottom: 13px solid #fff;
      border-left: 8px solid transparent;
    }
    a{
      display: block;
      padding: 0 16px;
      border-bottom: 1px solid #dcdddd;
      .iconfont{
        margin-right: .2rem;
        font-size: 16px;
      }
    }
  }
}
.pointsec {
  padding: .2rem 0 .2rem .2rem;
  font-size: 14px;
  background: #f7f8f8;
  &:nth-child(odd) {
    background-color: #fff;
  }
  .left{
    float: left;
  }
  .right{
    float: right;
  }
  .fline {
    .left {
      font-size: 18px;
      color: @base-ycolor3;
    }
    .right {
      margin-right: .2rem;
    }
  }
  .sline {
    border-bottom: 1px dashed #dcdddd;
    line-height: .6rem;
    .right{
      margin-right: .2rem;
      color: @base-ycolor4;
    }
  }
  .para {
    padding-top: .2rem;
    padding-right: .2rem;
    color: @base-ycolor4;
    .twolinetext()
  }
}
.tips{
  text-align:center;
  line-height:50px;
  margin-bottom:50px;
}
</style>
