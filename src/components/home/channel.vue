<template>
  <div>
    <section class="channelwap" v-if="showpage">
      <a href="javascript:;" @click="skip" class="del iReturnHistoryEvent"><img src="https://cdn.sys.img.95laibei.com/Optimization/Images/delete1-2.png"></a>
      <a class="download" :href="downloadurl">立即下载</a>
    </section>
    <section class="channelgzh" v-else>
      <a href="javascript:;" @click="skip" class="del iReturnHistoryEvent"><img src="https://cdn.sys.img.95laibei.com/Optimization/Images/delete1-2.png"></a>
      <img src="https://cdn.sys.img.95laibei.com/Optimization/Images/channel-bg-gzh_qr_0622.jpg" style="position:absolute;top:45%;width:50%;left:25%;">
    </section>
  </div>
</template>

<script>
export default {
  name: 'download',
  data () {
    return {
      showpage: true,
      downloadurl: 'https://itunes.apple.com/us/app/95lai-bei/id1141843861'
    }
  },
  mounted () {
    let u = navigator.userAgent
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    if (isAndroid) {
      this.downloadurl = 'https://www.95laibei.com/apk/LaiBei_Latest_OW.apk'
    }
    // eslint-disable-next-line
    if (u.match(/MicroMessenger/i) == 'micromessenger') {
      this.showpage = false
    }
  },
  methods: {
    skip () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.channelwap{
  position: relative;
  width: 100%;
  min-height: 13.3rem;
  background: url(https://cdn.sys.img.95laibei.com/Optimization/Images/channel-bg-2.jpg) no-repeat #fff;
  background-size: 100% 100%;
  .del{
    position: absolute;
    right: .2rem;
    top: .2rem;
    img{
      width: .6rem;
    }
  }
  .download{
    position: absolute;
    bottom: 1.4rem;
    left: 50%;
    transform: translate(-50%,0);
    border: 1px solid #ff9c00;
    border-radius: 20px;
    padding: 6px 30px;
    color: #ff9c00;
  }
}
.channelgzh{
  position: relative;
  width: 100%;
  min-height: 13.3rem;
  background: url(http://cdn.sys.img.95laibei.com/Optimization/Images/channel-bg-gzh_0622.jpg) no-repeat #fff;
  background-size: 100% 100%;
  .del{
    position: absolute;
    right: .2rem;
    top: .2rem;
    img{
      width: .6rem;
    }
  }
}
</style>
