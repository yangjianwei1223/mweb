<template>
  <div class="addressmanage">
    <v-header :headinfo="headinfo" @rightbtn1click="addaddress"></v-header>
    <div v-infinite-scroll="getAddressList" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="_v-container">
      <section class="addlist" v-for="(item, index) in addlist" :key="index">
        <div class="addinfo">
          <div class="line">
            <div class="name">收货人: <span>{{item.RealName}}</span></div>
            <div class="tel">{{item.Mobile}}</div>
          </div>
          <a onclick="My_AddressManage.ChooseAddress('',2440)" class="item" :data-addid="item.ConsigneeId">
            <div class="para">{{item.FullAddress}}</div>
          </a>
        </div>
        <div class="handle clearfix">
          <div class="left" @click="SetDefault(item)">
            <label class="setdefault" :class="{checked:item.IsDefault, unchecked:!item.IsDefault}"></label> 默认地址
          </div>
          <div class="right">
            <router-link :to='"/My/AddAddress/" + item.ConsigneeId' class="edit" :data-addid="item.ConsigneeId">
              <span class="iconfont">&#xe636;</span> 编辑
            </router-link>
            <a class="del" href="javascript:;" @click="RemoveConsignee(item, index)">
              <span class="iconfont">&#xe632;</span> 删除
            </a>
          </div>
        </div>
      </section>
    </div>
    <div v-if="showLoading" class="tips">{{tips}}</div>
    <go-top></go-top>
  </div>
</template>

<script>
import Vue from 'vue'
import qs from 'qs'
import infiniteScroll from 'vue-infinite-scroll'
import apiport from '../../util/api'

import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'

Vue.use(infiniteScroll)
export default {
  name: 'addressmanage',
  components: {
    'vHeader': head,
    goTop
  },
  data () {
    return {
      headinfo: {title: '收货地址管理', rightbtntext1: '新增'},
      page: 1,
      busy: false,
      showLoading: true,
      tips: '正在加载',
      addlist: []
    }
  },
  mounted: function () {
  },
  methods: {
    getAddressList: function () {
      let model = {
        Token: this.$store.state.UserToken,
        pageIndex: this.page,
        pageSize: 20
      }
      this.$http({
        url: apiport.Account_GetConsigneeByMbrBaseId,
        method: 'post',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('地址列表', res.data)
          if (res.data.Data.length > 0) {
            this.addlist = this.addlist.concat(res.data.Data)
            this.busy = false
            if (res.data.Data.length < 20) {
              this.tips = '已经到底了...'
              this.busy = true
            }
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
    // 设置默认地址
    SetDefault: function (item) {
      if (item.IsDefault) return
      let model = {
        Token: this.$store.state.UserToken,
        ConsigneeId: item.ConsigneeId
      }
      this.$http({
        url: apiport.Account_SetConsigneeIsDefault,
        method: 'post',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('设置为默认地址', res.data)
          item.IsDefault = true
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    // 删除地址
    RemoveConsignee: function (item, index) {
      let model = {
        Token: this.$store.state.UserToken,
        ConsigneeId: item.ConsigneeId
      }
      this.$http({
        url: apiport.Account_RemoveConsignee,
        method: 'post',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          this.addlist.splice(index, 1)
          console.log('删除地址', res.data)
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    addaddress () {
      this.$router.push({ path: '/My/AddAddress' })
    }
  }
}
</script>

<style lang="less" scoped>
.addressmanage{
  padding-top: 1rem;
}
.addlist{
  margin-bottom: .2rem;
  padding-left: .2rem;
  background:#fff;
  .addinfo {
    border-bottom: 1px solid #ededed;
  }
  .line{
    display: -webkit-box;
    display: flex;
    padding-top: .3rem;
    padding-bottom: .1rem;
    .name{
      min-width: 1.6rem;
    }
    .tel{
      flex: 1;
      text-align: right;
      margin-right: .2rem;
    }
  }
  .item{
    display: -webkit-box;
    display: flex;
    align-items: center;
    .para{
      padding:0 .2rem .2rem 0;
    }
  }
  .handle{
    line-height: .8rem;
    .left{
      float: left;
      font-size: 14px;
    }
    .setdefault{
      display: inline-block;
      cursor: pointer;
      vertical-align: middle;
      margin: 0;
      &.unchecked{
        width: 13px;
        height: 13px;
        background: url(https://cdn.sys.img.95laibei.com/Content/Images/addrunchecked.png)no-repeat;
        background-size: 13px;
        margin-bottom: 4px;
      }
      &.checked{
        width: 13px;
        height: 13px;
        background: url(https://cdn.sys.img.95laibei.com/Content/Images/addrselected_1.png) no-repeat;
        background-size: 13px;
        margin-bottom: 4px;
      }
    }
    .right{
      float:right;
      a{
        margin-right: .2rem;
        font-size: 14px;
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
