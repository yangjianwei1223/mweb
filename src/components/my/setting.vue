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
        <router-link :to='hasPassword ? {name: "changepassword"} : {name: "setpassword"}'>
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
      headinfo: {title: '设置'},
      hasPassword: false
    }
  },
  mounted () {
    this.CheckPwdFunc()
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
      let delArr = []
      let lStorage = window.localStorage
      // get delete storage key
      for (let i = 0; i < lStorage.length; i++) {
        let key = lStorage.key(i)
        for (var j = 0; j < deleteKeyRules.length; j++) {
          let curKey = deleteKeyRules[j][0]
          let curValue = deleteKeyRules[j][1]
          if (curKey === 1) {
            if (key.toLowerCase().indexOf(curValue) > -1) {
              delArr.push(key)
              break
            }
          } else if (curKey === 2) {
            if (key.toLowerCase() === curValue) {
              delArr.push(key)
              break
            }
          }
        }
      }
      // end get delete storage key
      // start delete localstorage
      for (let m = 0; m < delArr.length; m++) {
        lStorage.removeItem(delArr[m])
      }
      window.sessionStorage.clear()
      console.log('清除缓存')
    },
    SettingEnabledSound () {
      console.log('IM 待改')
    },
    CheckPwdFunc () {
      let model = {
        Token: this.$store.state.UserToken
      }
      this.$http({
        url: apiport.Account_CheckPassword,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('是否有密码', res.data)
          if (res.data.ResultNo === '00000000') {
            this.hasPassword = true
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
@import "../../assets/less/variable";
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
    .emulate-button{
      display: block;
      width: 50px;
      height: 24px;
      margin: 0;
      background: #dcdddd;
      border-radius: 12px;
      position: relative;
      transition: all .3s ease;
      &:after{
        content: '';
        display: block;
        width: 18px;
        height: 18px;
        border-radius: 100%;
        background: #fff;
        position: absolute;
        left: 3px;
        top: 3px;
        transform: translateZ(0);
        transition: all .3s ease;
      }
    }
    .raw-checkbox:checked + label{
      background: @base-ycolor;
    }
    .raw-checkbox:checked + label:after{
      left: 29px;
    }
  }
  .tag:last-child a{
    border-bottom:none;
  }
}
.signoutbtn{
  display: inline-block;
  width: 7rem;
  background-color: @base-ycolor;
  border: none;
  font-size: 18px;
  color: #fff!important;
  line-height: .8rem;
  margin: .4rem .25rem .2rem;
  text-align: center;
}
</style>
