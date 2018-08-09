<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="tag-wrap">
      <div class="tag">
        <router-link to="/My/DataSet">
          <div class="tag-core">个人资料设置</div>
          <div class="tag-arrow iconfont">&#xe61e;</div>
        </router-link>
      </div>
      <div class="tag">
        <router-link to="/My/SetPassword">
          <div class="tag-core">密码修改</div>
          <div class="tag-arrow iconfont">&#xe61e;</div>
        </router-link>
      </div>
      <div class="tag">
        <router-link to="/My/Bindset">
          <div class="tag-core">关联设置</div>
          <div class="tag-arrow iconfont">&#xe61e;</div>
        </router-link>
      </div>
      <div class="tag">
        <a href="javascript:;" @click="ClearWebView">
          <div class="tag-core">清理缓存</div>
          <div class="tag-arrow iconfont">&#xe61e;</div>
        </a>
      </div>
      <div class="tag">
        <a href="javascript:;" @click="SettingEnabledSound">
          <div class="tag-core">消息提示音</div>
          <div class="tag-arrow iconfont">
            <input type="checkbox" id="SettingEnabledSound" class="raw-checkbox" value="" style="display:none;" checked="checked">
            <label for="SettingEnabledSound" class="emulate-button"></label>
          </div>
        </a>
      </div>
      <div class="tag" v-if="false">
        <a href="javascript:;" @click="checkUpdate">
          <div class="tag-core">检查更新</div>
          <div class="tag-arrow iconfont">&#xe61e;</div>
        </a>
      </div>
    </section>
    <a href="javascript:;" @click="signout" class="signoutbtn">退出当前账号</a>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'

import head from '@/components/common/header'
export default {
  name: 'setting',
  components: {
    'vHeader': head
  },
  data () {
    return {
      headinfo: {title: '设置'}
    }
  },
  methods: {
    signout () {
      let model = {
        Token: this.$store.state.UserToken
      }
      this.$http({
        url: apiport.Account_SignOut,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('退出登陆', res.data)
          // Global_StorageHelper.DelSessionByKey("BaseInfo");
          // Global_StorageHelper.DelSessionByKey("ListPageDate");
          // Global_StorageHelper.DelSessionByKey("PageUrl");
          // Global_StorageHelper.DelStorageByKey("UserToken");
          // Global_StorageHelper.delCookie("UserToken");
          // Global_ValidCodeHelper.clearValidCodeTime();
          let storage = window.sessionStorage
          let storage1 = window.localStorage
          storage.removeItem('BaseInfo')
          storage.removeItem('ListPageDate')
          storage.removeItem('PageUrl')
          storage1.removeItem('UserToken')
          this.$router.push('/Account/Index')
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    ClearWebView () {
      // eslint-disable-next-line
      let deleteKeyRules = [[1, '95laibei_template'], [1, 'category_top'], [1, 'core_parent'], [1, 'usersearchkey'], [2, 'articlechannels'], [2, 'currentchannel'], [2, 'isclose'], [2, 'cache'], [2, 'cacheVerisonKey']]
    }
  }
}
</script>

<style lang="less" scoped>
.tag-wrap{
  padding-top: 1rem;
  background:#fff;
  .tag{
    height: .88rem;
    padding-left: .2rem;
    display: -webkit-box;
    display:flex;
    a{
      width: 100%;
      display: -webkit-box;
      border-bottom: 1px solid #ededed;
      div{
        -webkit-box-pack: start;
        -webkit-box-align: center;
        display: -webkit-box;
      }
    }
    .tag-core{
      -webkit-box-flex: 1;
      flex:1;
      line-height: .4rem;
      font-size: 13px;
      color: #666;
    }
    .tag-arrow{
      padding-right: .2rem;
      line-height: .1rem;
      font-size: 13px;
      color: #333;
    }
  }
  .tag:last-child a{
    border-bottom:none;
  }
}
.signoutbtn{
  display: inline-block;
  width: 7rem;
  background-color: #f1bc19;
  border: none;
  font-size: 18px;
  color: #fff!important;
  line-height: .8rem;
  margin: .4rem .25rem .2rem;
  text-align: center;
}
</style>
