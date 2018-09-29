<template>
  <div>
    <header class="header">
      <div><a class="iconfont back" @click="back">&#xe651;</a></div>
      <div>{{headtitle}}</div>
      <div></div>
    </header>
    <div class="msglist" v-infinite-scroll="getMessageList" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <!-- 聊天列表 -->
      <template v-if="!openwindow">
        <section v-for="(item, index) in MsgPreviewList" :key="index" :data-groupid="item.GroupPreview.GroupID" class="meslist" @click="openchat(index)">
          <div class="padf clearfix">
            <div class="left" :class='item.UnReadTotal >99 ? "plurality" : "singular"' :data-msg='item.UnReadTotal>0 ? item.UnReadTotal : ""'>
              <img :src="item.GroupPreview.GroupIcon">
            </div>
            <div class="right">
              <div class="name">{{item.GroupPreview.GroupTitle}}</div>
              <div class="cont">{{item.Group.LastMessage.Content}}</div>
            </div>
            <div class="time">{{item.Group.LastMessage.SendTimeFormate}}</div>
          </div>
        </section>
        <section v-for="(item1) in MsgPushList" :key="item1._id" class="sysmessage">
          <p class="time">{{item1.SendTimeFormate}}</p>
          <a class="blocka" href="javascript:;" @click="pushskipfun(item1.MessageDetail.Link)">
            <p class="content">{{item1.Content.Title}}</p>
            <div class="blockpic" v-if="item1.MessageDetail.ImageID">
              <img :src='"https://cdn." + item1.MessageDetail.ImagePath + ".img.95laibei.com/" + item1.MessageDetail.ImageName + "@!standard_src_l"'>
            </div>
            <p class="dcon">{{item1.Content.Description}}</p>
            <div class="moredetail" v-if="item1.MessageDetail.Link">更多详情<span>&#xe60b;</span></div>
          </a>
        </section>
      </template>
      <!-- 聊天窗口 -->
      <template v-if="openwindow">
        <!-- 系统提醒 -->
        <template v-if="!isTwain">
          <section class="sysmessage remind" v-for="item in MsgList" :key="item._id" @click="skiporder(item.Content.OrderID, item.Content.OrderClassify)">
            <p class="time">{{item.SendTimeFormate}}</p>
            <p class="content">{{item.Content.MessageContent}}</p>
            <div class="smgoodsinfo clearfix">
              <div class="left"><img :src="item.Content.GoodsImage"></div>
              <div class="right">{{item.Content.GoodsTitle}}</div>
            </div>
          </section>
        </template>
        <!-- 对聊 -->
        <template v-else>
          <div>sfsfd</div>
          <div class="dialog-bottom-send" style="height: 233px;">
            <div class="dialog-input clearfix">
              <span class="dialog-upload">
                <img src="https://cdn.sys.img.95laibei.com/Content/Images/upload.png" alt="上传图片" style="width:100%;">
                <input type="file" class="upload-btn" accept="image/*">
              </span>
              <div class="dialog-textarea">
                  <label id="for_imContent" for="im-content" style="display:none;"></label>
                  <textarea id="im-content" maxlength="100" type="text" class="msgcontent" placeholder="想对他说点什么"></textarea>
              </div>
              <button id="im-keyboard" class="keyboard-btn"></button>
              <button id="im-blow" class="brow-btn" style="display: none;"></button>
              <button id="im-sendMsg" class="sendbtn disabled" disabled="disabled" style="margin-top:10px;width:52px;">发送</button>
            </div>
            <div class="dialog-brow">
              <section>
                <ul class="brow-theme1">
                  <li><span class="brow-item brow-theme1-1"></span></li>
                  <li><span class="brow-item brow-theme1-2"></span></li>
                  <li><span class="brow-item brow-theme1-3"></span></li>
                  <li><span class="brow-item brow-theme1-4"></span></li>
                  <li><span class="brow-item brow-theme1-5"></span></li>
                  <li><span class="brow-item brow-theme1-6"></span></li>
                  <li><span class="brow-item brow-theme1-7"></span></li>
                  <li><span class="brow-item brow-theme1-8"></span></li>
                  <li><span class="brow-item brow-theme1-9"></span></li>
                  <li><span class="brow-item brow-theme1-10"></span></li>
                </ul>
              </section>
            </div>
          </div>
        </template>
      </template>
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
      headtitle: '消息',
      currentPageIndex: 0,
      pushPageIndex: 0,
      pageSize: 20,
      busy: true,
      showLoading: true,
      tips: '正在加载',
      pushGroupID: '',
      systemGroupID: '',
      currentGroupID: '',
      // 拿第一条消息的添加时间做获取聊天记录的过滤条件,防止分页拉取聊天记录数据重复
      MsgEndTime: '',
      isTwain: false,
      MsgPreviewList: [],
      MsgPushList: [],
      MsgList: [],
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
        message.SendTimeFormate = _that.getTimeMark(message.SendTime)
        _that.MsgPushList.unshift(message)
        _that.MsgPushList.pop()
      } else {
        message.SendTimeFormate = _that.getTimeMark(message.SendTime)
        message.Content = _that.getMsgContent(message)
        let isExistence = false
        _that.MsgPreviewList.forEach(ele => {
          if (ele.Group.GroupID === message.GroupID) {
            ele.Group.LastMessage.SendTimeFormate = message.SendTimeFormate
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
      if (this.openwindow) {
        this.openwindow = !this.openwindow
        this.headtitle = '消息'
        this.currentPageIndex = this.pushPageIndex
        this.currentGroupID = this.pushGroupID
        this.tips = '正在加载中...'
        this.busy = false
      } else {
        this.$router.back()
      }
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
          if (item.GroupPreview.ObjectType === _that.ChatGroup.SystemPush) {
            _that.pushGroupID = item.Group.GroupID
            _that.currentGroupID = item.Group.GroupID
          } else if (item.GroupPreview.ObjectType !== _that.ChatGroup.Praise && item.GroupPreview.ObjectType !== _that.ChatGroup.Comment) {
            if (item.GroupPreview.ObjectType === _that.ChatGroup.System) {
              _that.systemGroupID = item.Group.GroupID
              item.GroupPreview.GroupIcon = 'https://cdn.sys.img.95laibei.com/Content/Images/mes-sys.png'
            }
            item.Group.LastMessage.SendTimeFormate = _that.getTimeMark(item.Group.LastMessage.SendTime)
            item.Group.LastMessage.Content = _that.getMsgContent(item.Group.LastMessage)
            msglist.push(item)
          }
        })
        _that.MsgPreviewList = _that.MsgPreviewList.concat(msglist)
      }).fail()
    },
    setTotalUnRead (total) {
      window.sessionStorage.setItem('unReadTotal', total)
    },
    // 获取系统推送消息和系统提醒以及对聊消息
    getMessageList () {
      let _that = this
      _that.currentPageIndex += 1
      _that.busy = true
      window.hubProxy.invoke('GetMessageList', { PageIndex: _that.currentPageIndex, PageSize: _that.pageSize }, _that.currentGroupID, '', _that.MsgEndTime, null, '').done(function (data) {
        if (_that.currentGroupID === _that.pushGroupID) {
          console.log('获取系统推送消息', data)
          if (data.Data && data.Data.length > 0) {
            data.Data.forEach(item => {
              item.SendTimeFormate = _that.getTimeMark(item.SendTime)
            })
            _that.MsgPushList = _that.MsgPushList.concat(data.Data)
            _that.busy = false
          } else {
            _that.tips = '已经到底了...'
          }
        } else if (_that.currentGroupID === _that.systemGroupID) {
          console.log('获取系统提醒', data)
          _that.isTwain = false
          if (data.Data && data.Data.length > 0) {
            data.Data.forEach(item => {
              item.SendTimeFormate = _that.getTimeMark(item.SendTime)
            })
            _that.MsgList = _that.MsgList.concat(data.Data)
            _that.busy = false
          } else {
            _that.tips = '已经到底了...'
          }
        } else {
          console.log('获取对聊消息', data)
          _that.isTwain = true
          if (data.Data && data.Data.length > 0) {
            data.Data.forEach(item => {
              item.SendTimeFormate = _that.getTimeMark(item.SendTime)
            })
            _that.MsgList = _that.MsgList.concat(data.Data)
            _that.busy = false
          } else {
            _that.tips = '已经到底了...'
          }
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
      let oneMonth = 31 * oneDay
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
        timeMark = Math.floor(timeDiff / (31 * oneDay)) + '月前'
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
    // 根据id获取头像昵称最后一条消息
    getGroupPreviewFromServer (clientid) {
      let _that = this
      let model = {
        ObjectType: 1,
        ClientID: clientid
      }
      window.hubProxy.invoke('GetGroupPreview', model).done(function (data) {
        data.Group.LastMessage.SendTimeFormate = _that.getTimeMark(data.Group.LastMessage.SendTime)
        data.Group.LastMessage.Content = _that.getMsgContent(data.Group.LastMessage)
        _that.MsgPreviewList.unshift(data)
      }).fail()
    },
    openchat (index) {
      this.openwindow = true
      this.headtitle = this.MsgPreviewList[index].GroupPreview.GroupTitle
      this.currentGroupID = this.MsgPreviewList[index].Group.GroupID
      this.MsgEndTime = this.MsgPreviewList[index].GroupPreview.SendTimeFormate
      this.pushPageIndex = this.currentPageIndex
      this.currentPageIndex = 0
      this.MsgList = []
      this.getMessageList()
    },
    // 系统提醒跳转订单详情页
    skiporder (orderid, ordertype) {
      if (ordertype === 1) {
        this.$router.push({path: '/Order/zulindetail/' + orderid})
      } else {
        this.$router.push({path: '/Order/buydetail/' + orderid})
      }
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
// 系统提醒
.remind{
  .content{
    background-color: #fff;
    font-size: 14px;
    color: #3e3a39;
    padding: 6px .2rem;
    text-align: left;
    line-height: 24px;
  }
  .smgoodsinfo{
    padding: 6px;
    background-color: #fff;
    .left{
      float: left;
      width: 1rem;
    }
    .right{
      display: -webkit-box;
      margin-left: 1.2rem;
      font-size: 12px;
      width: 5.4rem;
      height: 30px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
// 聊天窗口发送模块
.dialog-bottom-send {
  position: absolute;
  bottom: 0;
  height: 53px;
  left: 0;
  right: 0;
  background-color: #fff;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  .dialog-input {
    position: relative;
    .dialog-upload {
      margin-top: 13px;
      position: relative;
      width: 25px;
      height: 25px;
      margin-left: 10px;
      float: left;
      overflow: hidden;
      .upload-btn {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        opacity: .01;
        z-index: 1;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        outline: none;
      }
    }
    .dialog-textarea {
      padding: 0 110px 0 50px;
      width: 100%;
      box-sizing: border-box;
      .msgcontent {
        margin-top: 10px;
        -webkit-appearance: none;
        outline: 0;
        border: none;
        float: left;
        width: 100%;
        box-sizing: border-box;
        font-size: 14px;
        resize: none;
      }
    }
    button{
      margin-left: 10px;
      margin-top: 13px;
      font-size: 14px;
      color: #fff;
      border: none;
      outline: 0;
      line-height: 18px;
      padding: 6px 12px;
    }
    .keyboard-btn {
      background: #ffffff url(https://cdn.sys.img.95laibei.com/Content/Images/keyboard.png) no-repeat;
      background-size: cover;
      width: 25px;
      height: 25px;
      position: absolute;
      top: 0;
      right: 70px;
    }
    .brow-btn {
      background: #ffffff url(http://cdn.sys.img.95laibei.com/Content/Images/brow.png) no-repeat;
      background-size: cover;
      width: 25px;
      height: 25px;
      position: absolute;
      top: 0;
      right: 70px;
    }
    .sendbtn {
      border-radius: 5px;
      background-color: #33a6ff;
      position: absolute;
      top: 0;
      right: 10px;
      margin-top: 10px;
      width: 52px;
    }
  }
  .dialog-brow {
    display: none;
    width: 100%;
    background-color: #ffffff;
    margin-top: 2px;
    box-shadow: 0 -1px 1px #ebebec;
    padding: 20px 0px;
    box-sizing: border-box;
    .brow-theme1 {
      padding: 0 .25rem;
      li {
        float: left;
        .brow-item {
          display: block;
          width: 1.4rem;
          height: 1.3333rem;
        }
        .brow-theme1-1 {
          background: transparent url(https://cdn.sys.img.95laibei.com/Content/Images/blowlist.png) no-repeat 0px 0px;
          background-size: 15rem 1.3333rem;
        }
        .brow-theme1-2 {
          background: transparent url(https://cdn.sys.img.95laibei.com/Content/Images/blowlist.png) no-repeat -1.5rem 0px;
          background-size: 15rem 1.3333rem;
        }
        .brow-theme1-3 {
          background: transparent url(https://cdn.sys.img.95laibei.com/Content/Images/blowlist.png) no-repeat -3rem 0px;
          background-size: 15rem 1.3333rem;
        }
        .brow-theme1-4 {
          background: transparent url(https://cdn.sys.img.95laibei.com/Content/Images/blowlist.png) no-repeat -4.5rem 0px;
          background-size: 15rem 1.3333rem;
        }
        .brow-theme1-5 {
          background: transparent url(https://cdn.sys.img.95laibei.com/Content/Images/blowlist.png) no-repeat -6rem 0px;
          background-size: 15rem 1.3333rem;
        }
        .brow-theme1-6 {
          background: transparent url(https://cdn.sys.img.95laibei.com/Content/Images/blowlist.png) no-repeat -7.5rem 0px;
          background-size: 15rem 1.3333rem;
        }
        .brow-theme1-7 {
          background: transparent url(https://cdn.sys.img.95laibei.com/Content/Images/blowlist.png) no-repeat -9rem 0px;
          background-size: 15rem 1.3333rem;
        }
        .brow-theme1-8 {
          background: transparent url(https://cdn.sys.img.95laibei.com/Content/Images/blowlist.png) no-repeat -10.5rem 0px;
          background-size: 15rem 1.3333rem;
        }
        .brow-theme1-9 {
          background: transparent url(https://cdn.sys.img.95laibei.com/Content/Images/blowlist.png) no-repeat -12rem 0px;
          background-size: 15rem 1.3333rem;
        }
        .brow-theme1-10 {
          background: transparent url(https://cdn.sys.img.95laibei.com/Content/Images/blowlist.png) no-repeat -13.5rem 0px;
          background-size: 15rem 1.3333rem;
        }
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
