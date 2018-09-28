<template>
  <div>
    <header class="header">
      <div><a class="iconfont back" @click="back">&#xe651;</a></div>
      <div>消息</div>
      <div></div>
    </header>
    <div class="msglist" v-infinite-scroll="getMessageList" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <section v-for="(item, index) in MsgPreviewList" :key="index" :data-groupid="item.GroupPreview.GroupID" class="meslist">
        <a class="padf clearfix">
          <div class="left" :class='item.UnReadTotal >99 ? "plurality" : "singular"' :data-msg='item.UnReadTotal>0 ? item.UnReadTotal : ""'>
            <img :src="item.GroupPreview.GroupIcon">
          </div>
          <div class="right">
            <div class="name">{{item.GroupPreview.GroupTitle}}</div>
            <div class="cont">{{item.Group.LastMessage.Content}}</div>
          </div>
          <div class="time">{{item.Group.LastMessage.SendTime}}</div>
        </a>
      </section>
      <section v-for="(item1) in MsgPushList" :key="item1._id" class="sysmessage">
        <p class="time">{{item1.SendTime}}</p>
        <a class="blocka" href="javascript:;" @click="pushskipfun(item1.MessageDetail.Link)">
          <p class="content">{{item1.Content.Title}}</p>
          <div class="blockpic" v-if="item1.MessageDetail.ImageID">
            <img :src='"https://cdn." + item1.MessageDetail.ImagePath + ".img.95laibei.com/" + item1.MessageDetail.ImageName + "@!standard_src_l"'>
          </div>
          <p class="dcon">{{item1.Content.Description}}</p>
          <div class="moredetail" v-if="item1.MessageDetail.Link">更多详情<span>&#xe60b;</span></div>
        </a>
      </section>
    </div>
    <div tip="正在加载" v-if="showLoading" class="tips">{{tips}}</div>
    <go-top></go-top>
  </div>
</template>

<script>
import Vue from 'vue'
import apiport from '../../util/api'
import infiniteScroll from 'vue-infinite-scroll'
// import qs from 'qs'
// import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'
import { hubConnection } from 'signalr-no-jquery'

Vue.use(infiniteScroll)
export default {
  name: 'im',
  components: {
    goTop: goTop
  },
  data () {
    return {
      currentPageIndex: 0,
      pageSize: 20,
      busy: true,
      showLoading: true,
      tips: '正在加载',
      pushGroupID: '',
      MsgPreviewList: [],
      MsgPushList: [],
      ChatGroup: {
        Twain: 1,
        System: 2,
        Praise: 3,
        Comment: 4,
        SystemPush: 5
      },
      ChatMessage: {
        Text: 1,
        Brow: 2,
        Image: 3,
        Product: 4,
        Order: 5,
        Article: 6,
        SystemMsg: 7,
        Comment: 8,
        Praise: 9,
        SystemPushMsg: 10,
        ActivityLocalLife: 11
      },
      openwindow: false
    }
  },
  mounted () {
    let _that = this
    let options = {
      qs: {MbrToken: this.$store.state.UserToken}
    }
    const connection = hubConnection(apiport.IMServiceUrl, options)
    const hubProxy = connection.createHubProxy('Chatmessagehub')
    window.hubProxy = hubProxy
    // 接收消息
    hubProxy.on('ReceiveMessage', function (clientContext, message) {
      console.log(message)
      // 判断是否系统推送消息
      if (message.ObjectType === _that.ChatMessage.SystemPushMsg) {
        message.SendTime = _that.getTimeMark(message.SendTime)
        _that.MsgPushList.unshift(message)
        _that.MsgPushList.pop()
      } else {
        message.SendTime = _that.getTimeMark(message.SendTime)
        message.Content = _that.getMsgContent(message)
        let isExistence = false
        _that.MsgPreviewList.forEach(ele => {
          if (ele.Group.GroupID === message.GroupID) {
            ele.Group.LastMessage.SendTime = message.SendTime
            ele.Group.LastMessage.Content = message.Content
            ele.UnReadTotal += 1
            isExistence = true
          }
        })
        if (!isExistence) {
          // 不存在的聊天组需要重新去请求一次
          _that.getGroupPreviewFromServer(message.SenderClientID)
        }
      }
    })
    // connect
    connection.start({ jsonp: false })
      .done(function () {
        console.log('Now connected, connection ID=' + connection.id)
        _that.getUnReadTotal()
      })
      .done(function () {
        _that.getGroupList(1)
      })
      .fail(function () { console.log('Could not connect') })
  },
  beforeDestroy () {
    window.hubProxy.connection.stop()
  },
  methods: {
    back () {
      this.$router.back()
    },
    getUnReadTotal () {
      let _that = this
      window.hubProxy.invoke('CountUnReadMessage').done(function (data) {
        console.log('未读条数', data)
        _that.setTotalUnRead(data)
      }).fail()
    },
    getGroupList (pageIndex) {
      let _that = this
      return window.hubProxy.invoke('GetMessagePreviewList', { PageIndex: pageIndex, PageSize: 12 }, null, '').done(function (data) {
        console.log('获取第' + pageIndex + '页预览数据成功')
        _that.busy = false
        // 过滤掉评论、赞和小助手消息并且给系统提醒添加默认头像以及转化时间
        let msglist = []
        data.Data.forEach(item => {
          if (item.GroupPreview.ObjectType !== _that.ChatGroup.Praise && item.GroupPreview.ObjectType !== _that.ChatGroup.Comment && item.GroupPreview.ObjectType !== _that.ChatGroup.SystemPush) {
            if (item.GroupPreview.ObjectType === _that.ChatGroup.System) {
              item.GroupPreview.GroupIcon = 'https://cdn.sys.img.95laibei.com/Content/Images/mes-sys.png'
            }
            item.Group.LastMessage.SendTime = _that.getTimeMark(item.Group.LastMessage.SendTime)
            item.Group.LastMessage.Content = _that.getMsgContent(item.Group.LastMessage)
            msglist.push(item)
          } else if (item.GroupPreview.ObjectType === _that.ChatGroup.SystemPush) {
            _that.pushGroupID = item.Group.GroupID
          }
        })
        _that.MsgPreviewList = _that.MsgPreviewList.concat(msglist)
      }).fail()
    },
    setTotalUnRead (total) {
      window.sessionStorage.setItem('unReadTotal', total)
    },
    // 获取系统推送消息
    getMessageList () {
      let _that = this
      _that.currentPageIndex += 1
      _that.busy = true
      window.hubProxy.invoke('GetMessageList', { PageIndex: _that.currentPageIndex, PageSize: _that.pageSize }, _that.pushGroupID, '', null, null, '').done(function (data) {
        console.log('获取系统推送消息', data)
        if (data.Data && data.Data.length > 0) {
          data.Data.forEach(item => {
            item.SendTime = _that.getTimeMark(item.SendTime)
          })
          _that.MsgPushList = _that.MsgPushList.concat(data.Data)
          _that.busy = false
        } else {
          _that.tips = '已经到底了...'
        }
      }).fail()
    },
    getTimeMark (date) {
      if (typeof date === 'string') {
        date = new Date(date)
      }
      let now = new Date()
      let timeMark = ''
      let timeDiff = now - date
      let oneMinutes = 60 * 1000
      let oneHour = 60 * oneMinutes
      let oneDay = 24 * oneHour
      let oneMonth = 29 * oneDay
      let oneYear = 365 * oneDay
      if (timeDiff <= oneMinutes) {
        timeMark = '刚刚'
      } else if (timeDiff <= oneHour) {
        timeMark = Math.floor(timeDiff / oneMinutes) + '分钟前'
      } else if (timeDiff <= oneDay) {
        timeMark = Math.floor(timeDiff / oneHour) + '小时前'
      } else if (timeDiff <= oneMonth) {
        timeMark = Math.floor(timeDiff / oneDay) + '天前'
      } else if (timeDiff <= oneYear) {
        timeMark = Math.floor(timeDiff / (29 * oneDay)) + '月前'
      } else {
        timeMark = Math.floor(timeDiff / (365 * oneDay)) + '年前'
      }
      return timeMark
    },
    getMsgContent (msg) {
      let content = ''
      switch (msg.ObjectType) {
        case this.ChatMessage.Text:
          content = msg.MsgContent
          break
        case this.ChatMessage.Brow:
          content = '[表情]'
          break
        case this.ChatMessage.Image:
          content = '[图片]'
          break
        case this.ChatMessage.Product:
          content = '[商品链接]'
          break
        case this.ChatMessage.SystemMsg:
          content = msg.SystemDetail.MessageContent
          break
        default: console.log('错误的消息类型')
      }
      return content
    },
    pushskipfun (url) {
      if (url) {
        let reg = /^http[s]?:\/\/([^\\/?#&]+)(\/[^?#&]*)/
        url = url.slice(-4) === '.com' ? url + '/' : url
        let arr = url.match(reg)
        if (arr) {
          url = arr[2]
        }
        this.$router.push({path: url})
      }
    },
    getGroupPreviewFromServer (clientid) {
      let _that = this
      let model = {
        ObjectType: 1,
        ClientID: clientid
      }
      window.hubProxy.invoke('GetGroupPreview', model).done(function (data) {
        data.Group.LastMessage.SendTime = _that.getTimeMark(data.Group.LastMessage.SendTime)
        data.Group.LastMessage.Content = _that.getMsgContent(data.Group.LastMessage)
        _that.MsgPreviewList.unshift(data)
      }).fail()
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 22;
  background: @base-ycolor;
  display: -webkit-box;
  height: 1rem;
  line-height: 0.8rem;
  text-align: center;
  & > div {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    display: -webkit-box;
    display: -moz-box;
    font-size: 18px;
    color: #000;
  }
  & > div:first-child {
    text-align: left;
    margin-left: 0.2rem;
    -moz-box-pack: start;
    -webkit-box-pack: start;
    min-width: 20%;
  }
  & > div:last-child {
    text-align: right;
    margin-right: 0.2rem;
    -webkit-box-pack: end;
    min-width: 20%;
    font-size: 16px;
  }
  .back{
    font-size: 22px;
  }
}
.msglist{
  margin-top: 1rem;
  .meslist{
    position: relative;
    padding: .2rem 0 0 .2rem;
    background-color: #fff;
    border-bottom: 1px solid #ededed;
    .padf{
      display: block;
      color:#3e3a39;
      padding-bottom: .2rem;
      .left{
        position: relative;
        float: left;
        width: 1rem;
        height: 1rem;
        img{
          width: 1rem;
          border-radius: 50%;
        }
        &.singular:after{
          content: attr(data-msg);
          background-color: #ff4965;
          font-size: 14px;
          color: #fff;
          vertical-align: middle;
          text-align: center;
          border-radius: 10px;
          width: 20px;
          line-height: 20px;
          position: absolute;
          top: -2px;
          right: -4px;
          transform: scale(0.9);
        }
        &.plurality:after{
          content: attr(data-msg);
          background-color: #ff4965;
          color: #fff;
          vertical-align: middle;
          text-align: center;
          border-radius: 20px;
          width: .6rem;
          line-height: .45rem;
          position: absolute;
          top: -.03rem;
          right: -.11rem;
          transform: scale(0.9);
        }
      }
      .right{
        float: left;
        margin-left: .2rem;
        .name{
          color: #3e3a39;
          line-height: .5rem;
          width: 4.4rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
        }
        .cont{
          width: 5.6rem;
          line-height: .5rem;
          font-size: 14px;
          color: #9fa0a0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .time{
        position: absolute;
        top: .2rem;
        right: .2rem;
        color: #9fa0a0;
        font-size: 14px;
        line-height: .6rem;
      }
    }
  }
}
.sysmessage{
  padding: .4rem .2rem 0;
  text-align: center;
  .time{
    font-size: 12px;
    color: #9fa0a0;
    display: inline-block;
    background-color: #dcdddd;
    padding: 4px 18px;
    border-radius: 6px;
    margin-bottom: .2rem;
  }
  .blocka{
    display: block;
    overflow: hidden;
    border-radius: 4px;
    background-color: #fff;
    .content{
      background-color: #fff;
      color: #3e3a39;
      padding: 6px .2rem;
      text-align: left;
      line-height: 24px;
    }
    .blockpic img{
      width: 6.7rem;
    }
    .dcon{
      text-align: left;
      padding: .2rem;
      font-size: 12px;
      color: #9fa0a0;
    }
    .moredetail{
      text-align: left;
      padding: .1rem 0;
      margin: 0 .2rem;
      font-size: 12px;
      color: #595757;
      background-color: #fff;
      border-top: 1px solid #dcdddd;
      span{
        font-family: iconfont;
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
