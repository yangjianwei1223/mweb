<template>
  <div>
    <header class="header">
      <div><a class="iconfont back" @click="back">&#xe651;</a></div>
      <div id="headerTitle">聊聊</div>
      <div>
      </div>
    </header>
  </div>
</template>

<script>
import { hubConnection } from 'signalr-no-jquery'
export default {
  name: 'im',
  data () {
    return {
      sss: 111
    }
  },
  mounted () {
    let _that = this
    let options = {
      // transport: 'webSockets',
      // clientProtocol: 1.5,
      MbrToken: this.$store.state.UserToken
      // connectionToken: 'W9kgIX788ZBjQgATKkq8R8pwmbPsAuAfb7ktYZR3kB5z5wOjN4twcKkxqBVRwv2hwQ7%2Fvfk6ESaG6k5nHuo0HIfUhVRC3UsTMLAyiMRUInPwciW931739eJTWDo8Qu9c',
      // connectionData: '%5B%7B%22name%22%3A%22chatmessagehub%22%7D%5D',
      // tid: 5
    }
    const connection = hubConnection('https://t-im-api.95laibei.com', options)
    const hubProxy = connection.createHubProxy('Chatmessagehub')
    window.hubProxy = hubProxy

    // set up event listeners i.e. for incoming "message" event
    hubProxy.on('message', function (message) {
      console.log(message)
    })
    // connect
    connection.start({ jsonp: false })
      .done(function () {
        console.log('Now connected, connection ID=' + connection.id)
        // let msg = {
        //   Content: '手动阀手动阀',
        //   GroupID: 'MTAwOSwxMDE4',
        //   MessageID: 4,
        //   MsgContent: '手动阀手动阀',
        //   ObjectType: 1,
        //   SendTime: new Date(),
        //   SenderClientID: 1018
        // }
        // hubProxy.invoke('sendMessage', msg).done(function () {
        //   console.log('send success')
        // }).fail(function (error) {
        //   console.log(error.message)
        // })
        _that.getGroupList(1)
      })
      .fail(function () { console.log('Could not connect') })
  },
  methods: {
    back () {
      this.$router.back()
    },
    getGroupList (pageIndex) {
      return window.hubProxy.invoke('GetMessagePreviewList', { PageIndex: pageIndex, PageSize: 12 }, null, '').done(function (data) {
        console.log('获取第' + pageIndex + '页预览数据成功')
        // that.batchAppendMsgPreview(data.Data)
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
</style>
