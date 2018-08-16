<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="tag-wrap">
      <div class="tag avator">
        <div class="portrait">
          <div class="tag-core">头像</div>
          <div class="tag-arrow iconfont">
            <img :src="FaceImage">
            <input type="file" accept="image/*" @change="changeavator">&#xe61e;
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
            <label class="gender" :class="{selected: Sex==1}" @click="changesex(1)">男</label>
            <label class="gender" :class="{selected: Sex==0}" @click="changesex(0)">女</label>
          </div>
        </div>
      </div>
      <div class="tag">
        <div class="birthday">
          <div class="tag-core">生日</div>
          <div class="tag-arrow iconfont"><span>{{Birthday}}</span>&#xe61e;</div>
          <input type="date" :value="Birthday" min="1918-08-13" max="2018-08-13" @change="changebirthday">
        </div>
      </div>
      <div class="tag" v-if="Category">
        <div>
          <div class="tag-core">来呗认证说明</div>
          <div class="tag-arrow iconfont"><span>{{CategoryDesc}}</span>&#xe61e;</div>
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
      Category: '',
      CategoryDesc: '',
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
        this.Category = data.Category
        this.CategoryDesc = data.CategoryDesc
        this.Signature = data.Signature
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  },
  methods: {
    changesex (sexid) {
      if (this.Sex === sexid) {
        return true
      } else {
        this.Sex = sexid
        let model = {
          Token: this.$store.state.UserToken,
          Sex: this.Sex
        }
        this.$http({
          url: apiport.Account_ChangeBaseSex,
          method: 'post',
          data: qs.stringify({ reqJson: JSON.stringify(model) })
        })
          .then(res => {
            console.log('修改性别', res.data)
          })
          .catch(error => {
            console.log(2)
            console.log(error)
          })
      }
    },
    changebirthday () {
      if (!this.Birthday) {
        return true
      }
      let model = {
        Token: this.$store.state.UserToken,
        Birthday: this.Birthday
      }
      this.$http({
        url: apiport.Account_ChangeBirthday,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('修改生日', res.data)
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    changeavator (e) {
      console.log('头像', e.target.files)
    }
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
      .gender{
        &::before{
          content: "";
          display: inline-block;
          width: 20px;
          height: .88rem;
          background: url(https://cdn.sys.img.95laibei.com/Content/Images/circleunselect.png) no-repeat center;
          background-size: 14px;
          vertical-align: middle;
          margin-left: 30px;
          margin-right: 6px;
        }
        &.selected::before{
          background: url(https://cdn.sys.img.95laibei.com/Content/Images/circleselect_1.png) no-repeat center;
          background-size: 14px;
        }
      }
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
