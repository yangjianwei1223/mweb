<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="habout" v-html="documenthtml"></section>
    <p class="appvision">版本识别码:{{AppChannel}}|{{AppType}}|{{AppVersion}}|{{sessionId}}|{{GUID}}</p>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import storage from '../../util/storage'
import head from '@/components/common/header'
export default {
  name: 'aboutus',
  components: {
    vHeader: head
  },
  data () {
    return {
      headinfo: {title: '关于来呗'},
      documenthtml: '',
      AppChannel: '',
      AppType: '',
      AppVersion: '',
      GUID: '',
      sessionId: ''
    }
  },
  mounted: function () {
    this.getDocument()
    let model = {
      AppChannel: '',
      AppType: '',
      AppVersion: '',
      SystemType: '',
      DeviceId: '',
      DeviceModel: '',
      DeviceName: '',
      Operator: '',
      ScreenWidth: '',
      ScreenHeight: '',
      ConnectionType: '',
      MemberAccount: '',
      PositionType: '1',
      Longitude: '',
      Latitude: '',
      URL: window.location.href,
      GUID: ''
    }
    // eslint-disable-next-line
    if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
      model.AppChannel = 'WX'
    } else {
      model.AppChannel = 'OT'
    }
    this.$http({
      url: apiport.Common_AddSiteAccessLog,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('获取site信息', res.data)
        this.AppChannel = model.AppChannel
        this.AppType = model.AppType
        this.AppVersion = res.data.AppVersion
        this.GUID = res.data.GUID
        let resultStr = {
          AppChannel: model.AppChannel,
          AppType: model.AppType,
          AppVersion: model.AppVersion,
          SystemType: model.SystemType,
          DeviceId: model.DeviceId,
          DeviceModel: model.DeviceModel,
          DeviceName: model.DeviceName,
          ScreenWidth: model.ScreenWidth,
          ScreenHeight: model.ScreenHeight,
          GUID: res.data.GUID
        }
        storage.setLocal(resultStr, 'SiteAccesslocalStorage')
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  },
  methods: {
    getDocument () {
      let model = {
        code: 'about-laibei'
      }
      this.$http({
        url: apiport.DocumentBase_GetByCode,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('关于我们图文', res.data)
          this.documenthtml = res.data.Data.Content
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/less/variable";
.habout{
  background-color: #fff;
  font-size: 14px;
  padding: 1.2rem .2rem .2rem;
  line-height: 20px;
  /deep/ p{
    margin-bottom: .1rem;
  }
}
.appvision{
  color: #9fa0a0;
  text-indent: 0;
  word-break: break-all;
  font-size: 14px;
  line-height: 20px;
  background: #fff;
  padding: 0 .2rem .1rem;
}
</style>
