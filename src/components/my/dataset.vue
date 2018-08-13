<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="tag-wrap">
      <div class="tag avator">
        <div class="portrait">
          <div class="tag-core">头像</div>
          <div class="tag-arrow iconfont">
            <img :src="FaceImage">
            <input type="file" accept="image/*">&#xe61e;
          </div>
        </div>
      </div>
      <div class="tag">
        <div>
          <div class="tag-core">登陆账号</div>
          <div class="tag-arrow">{{Mobile}}</div>
        </div>
      </div>
      <div class="tag">
        <div>
          <div class="tag-core">昵称</div>
          <div class="tag-arrow iconfont"><span>{{Nickname}}</span>&#xe61e;</div>
        </div>
      </div>
      <div class="tag">
        <div>
          <div class="tag-core">性别</div>
          <div class="tag-arrow">
            <label class="gender" :class="{selected: Sex==1}">男</label>
            <label class="gender" :class="{selected: Sex==0}">女</label>
          </div>
        </div>
      </div>
      <div class="tag">
        <div class="birthday">
          <div class="tag-core">生日</div>
          <div class="tag-arrow iconfont"><span>{{Birthday}}</span>&#xe61e;</div>
          <input type="date" :value="Birthday" min="1918-08-13" max="2018-08-13">
        </div>
      </div>
      <div class="tag">
        <div>
          <div class="tag-core">个性签名</div>
          <div class="tag-arrow iconfont"><span>{{Signature}}</span>&#xe61e;</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
export default {
  name: 'dataset',
  components: {
    vHeader: head
  },
  data () {
    return {
      headinfo: {title: '个人资料设置'},
      FaceImage: '',
      Mobile: '',
      Nickname: '',
      Sex: 0,
      Birthday: '',
      Signature: ''
    }
  },
  mounted: function () {
    let model = {
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Account_GetBaseByToken,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('获取个人资料', res.data)
        let data = res.data
        this.FaceImage = data.FaceImage
        this.Mobile = data.Mobile
        this.Nickname = data.Nickname
        this.Sex = data.Sex
        this.Birthday = data.Birthday
        this.Signature = data.Signature
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.tag-wrap{
  padding-top: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  .tag{
    height: .88rem;
    padding-left: .2rem;
    display: -webkit-box;
    display: -moz-box;
    position: relative;
    &>div{
      width:100%;
      display: -webkit-box;
    }
    &.avator{
      height: 1.1rem;
    }
    .tag-core{
      -webkit-box-flex: 1;
      line-height: .4rem;
      font-size: 13px;
      color: #666;
      -webkit-box-pack: start;
      -webkit-box-align: center;
      display: -webkit-box;
      border-bottom:1px solid #ededed;
    }
    .tag-arrow{
      padding-right: .2rem;
      line-height: .1rem;
      font-size: 13px;
      color: #333;
      -webkit-box-pack: start;
      -webkit-box-align: center;
      display: -webkit-box;
      border-bottom:1px solid #ededed;
    }
    .portrait{
      img{
        width: .7rem;
        height: .7rem;
        border-radius: 50%;
        vertical-align: middle;
      }
      input{
        position: absolute;
        top: 0;
        right: 0;
        width: 3rem;
        height: 1.1rem;
        opacity: .01;
      }
    }
    .birthday{
      input{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 7.3rem;
        opacity: .01;
      }
    }
  }
}
</style>
