<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="accountbox">
        <div class="accountline">
            <div class="borderbottom paddingleftp">
                <span>新密码</span>
                <input type="password" value="" maxlength="16" placeholder="请输入新密码">
            </div>
        </div>
        <div class="accountline">
            <div class="paddingleftp">
                <span>确认密码</span>
                <input type="password" value="" maxlength="16" placeholder="请确认密码">
            </div>
        </div>
    </section>
    <button class="loginbtn">确定</button>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
export default {
  name: 'setpassword',
  components: {
    'vHeader': head
  },
  data () {
    return {
      headinfo: {title: '设置密码'}
    }
  }
}
</script>

<style lang="less" scoped>

</style>
