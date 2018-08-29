<template>
  <div>
    <v-header :headinfo="headinfo" @rightbtn1click="skipqrcode"></v-header>
    <div class="sharewrap">
      <div class="countwrap">
        <div>
          <p>注册人数</p>
          <p>{{UserCount}}</p>
        </div>
        <div>
          <p>订单金额</p>
          <p>{{MoneyCount}}</p>
        </div>
        <div>
          <p>提篮申领</p>
          <p>{{HelpApplyCount}}</p>
        </div>
      </div>
      <section class="sharedetail">
        <span class="icon"></span>
        <span class="desc">邀请明细</span>
      </section>
      <div class="listwrap">
        <div :class="{active: type === 0}" @click="changetype(0)"><span>注册</span></div>
        <div :class="{active: type === 1}" @click="changetype(1)"><span>订单</span></div>
        <div :class="{active: type === 2}" @click="changetype(2)"><span>提篮申领</span></div>
      </div>
      <ul v-infinite-scroll="getmysharedata" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="ullist">
        <li v-for="(item, index) in sharelist" :key="index">
          <span class="name">{{item.NickName}}</span>
          <span>{{item.Content}}</span>
          <div>{{item.CreateTime}}</div>
        </li>
      </ul>
      <div tip="正在加载" v-if="showLoading" class="tips">{{tips}}</div>
      <go-top></go-top>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import qs from 'qs'
import apiport from '../../util/api'
import infiniteScroll from 'vue-infinite-scroll'
import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'
Vue.use(infiniteScroll)

export default {
  name: 'share',
  components: {
    vHeader: head,
    goTop: goTop
  },
  data () {
    return {
      headinfo: {title: '我的分享', rightbtntext1: '<img src="https://cdn.sys.img.95laibei.com/Content/Images/ShareQRCode-0517v2.png">'},
      currentPageIndex: 0,
      pageSize: 20,
      busy: false,
      showLoading: true,
      tips: '正在加载',
      type: 0,
      sharelist: [],
      UserCount: 0,
      MoneyCount: 0,
      HelpApplyCount: 0
    }
  },
  mounted: function () {
    this.getmysharecount()
  },
  methods: {
    getmysharecount () {
      let model = {
        Token: this.$store.state.UserToken
      }
      this.$http({
        url: apiport.Account_GetInvitationCode,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('邀请数量', res.data)
          this.UserCount = res.data.UserCount
          this.MoneyCount = res.data.MoneyCount
          this.HelpApplyCount = res.data.HelpApplyCount
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    getmysharedata () {
      this.currentPageIndex += 1
      this.busy = true
      let model = {
        Token: this.$store.state.UserToken,
        type: this.type,
        pageIndex: this.currentPageIndex,
        pageSize: this.pageSize
      }
      this.$http({
        url: apiport.Account_GetInvitationCodeDetail,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('邀请记录', res.data)
          if (res.data.Data.length > 0) {
            this.sharelist = this.sharelist.concat(res.data.Data)
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
    skipqrcode () {
      this.$router.push('/My/ShareQRCode')
    },
    changetype (type) {
      if (this.type === type) {
        return true
      } else {
        this.type = type
        this.sharelist = []
        this.currentPageIndex = 0
        this.busy = false
        this.getmysharedata()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.sharewrap{
  padding-top: 1rem;
  background-color: #fff;
  .countwrap{
    display: flex;
    text-align: center;
    padding: .2rem 0;
    border-bottom: 1px solid #ededed;
    div{
      flex: 1;
    }
  }
  .sharedetail{
    display: flex;
    align-items: center;
    height: 1rem;
    line-height: 1rem;
    padding-left: .28rem;
    border-bottom: 1px solid #ededed;
    .icon{
      background: url(https://cdn.sys.img.95laibei.com/Content/Images/my95_3.png) no-repeat;
      background-size: 300px 30px;
      background-position: -239px 0;
      width: 30px;
      height: 30px;
    }
    .desc{
      margin-left: .2rem;
      font-size: 16px;
    }
  }
  .listwrap{
    display: flex;
    border-bottom: 1px solid #ededed;
    div{
      flex: 1;
      text-align: center;
      span{
        display: inline-block;
        padding:.2rem 0;
      }
    }
    div.active span{
      color: @base-ycolor3;
      border-bottom: 2px solid @base-ycolor3;
    }
  }
  .ullist{
    li{
      line-height: .8rem;
      padding: 0 .2rem;
      border-bottom: 1px solid #ededed;
      .name{
        color: @base-ycolor3;
      }
      div{
        float: right;
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
