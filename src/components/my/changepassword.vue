<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <div style="height: 1px;"></div>
    <div class="form-group mtop">
      <div class="padf borderbottom">
        <label>原密码</label>
        <input type="password" v-model="oldpassword" value="" maxlength="16" placeholder="请输入原密码">
      </div>
    </div>
    <div class="form-group">
      <div class="padf borderbottom">
        <label>新密码</label>
        <input type="password" v-model="newpassword" value="" maxlength="16" placeholder="请输入新密码">
      </div>
    </div>
    <div class="form-group">
      <div class="padf">
        <label>确认密码</label>
        <input type="password" v-model="password" value="" maxlength="16" placeholder="请确认密码">
      </div>
    </div>
    <button class="btn-primary" @click="changepassword">确定</button>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
export default {
  name: 'changepassword',
  components: {
    'vHeader': head
  },
  data () {
    return {
      headinfo: {title: '修改密码'},
      oldpassword: '',
      newpassword: '',
      password: '',
      isDisabled: false
    }
  },
  mounted: function () {
  },
  methods: {
    changepassword: function () {
      debugger
      if (!this.oldpassword || !this.newpassword || !this.password || this.newpassword === this.oldpassword || this.newpassword !== this.password) {
        alert('密码出错')
        return
      }
      let model = {
        Token: this.$store.state.UserToken,
        oldPassword: this.oldpassword,
        newPassword: this.password
      }
      this.$http({
        url: apiport.Account_ModifyPassword,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('修改密码', res.data)
          if (res.data.ResultNo === '00000000') {
            this.$router.back()
          } else {
            alert(res.data.ResultRemark)
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.mtop{
  margin-top: 1rem;
}
</style>
