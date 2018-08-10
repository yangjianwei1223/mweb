<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="bindset">
      <div class="content">
          <div class="iconfont">&#xe64b;</div>
          <p>微信<br><span v-show="IsWxBind">关联</span></p>
          <a href="javascript:;" class="bindbtn" @click="bindFun">{{text}}</a>
      </div>
    </section>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
export default {
  name: 'bindset',
  components: {
    'vHeader': head
  },
  data () {
    return {
      headinfo: {title: '关联设置'},
      IsWxBind: false
    }
  },
  computed: {
    text: function () {
      if (this.IsWxBind) {
        return '解除关联'
      } else {
        return '立即关联'
      }
    }
  },
  mounted: function () {
    let model = {
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Account_GetBindInfo,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('绑定信息', res.data)
        this.IsWxBind = res.data.IsWxBind
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  },
  methods: {
    bindFun: function () {
      // 解除绑定
      if (this.IsWxBind) {
        let model = {
          Token: this.$store.state.UserToken,
          Type: 1
        }
        this.$http({
          url: apiport.Account_RemoveBindingConnect,
          method: 'post',
          data: qs.stringify({ reqJson: JSON.stringify(model) })
        })
          .then(res => {
            console.log('解除绑定信息', res.data)
            this.IsWxBind = false
          })
          .catch(error => {
            console.log(2)
            console.log(error)
          })
      } else {
        // 绑定
        // eslint-disable-next-line
        if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7ff0669994ee3210&redirect_uri=https%3a%2f%2ft-mweb.95laibei.com%2fpay%2fWxCode&response_type=code&scope=snsapi_userinfo&state=wxlogin#wechat_redirect'
          return true
        } else {
          alert('微信关联请在app内或者微信内')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.bindset{
  margin: .4rem 0;
  box-shadow: 0 1px 1px #ebebec, 0 -1px 1px #ebebec;
  padding-top:1rem;
  .content{
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: .2rem;
    .iconfont{
      color: #03a200;
      font-size: 40px;
      margin-right: 10px;
      border-radius: 50%;
    }
    p{
      flex: 1;
      font-size: 13px;
      span{
        font-size: @base-ftsize;
        color: #9fa0a0;
      }
    }
    a{
      float: right;
      border: 1px solid @base-ycolor;
      border-radius: 4px;
      padding: 4px 6px;
      color: @base-ycolor;
      font-size: 13px;
    }
  }
}
</style>
