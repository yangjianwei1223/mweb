<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <div class="nav">
      <section class="install-video-brand">
        <div :class='{active: brand==="brand1"}' @click='changebrand("brand1")'>宝得适</div>
        <div :class='{active: brand==="brand2"}' @click='changebrand("brand2")'>斯迪姆</div>
        <div :class='{active: brand==="brand3"}' @click='changebrand("brand3")'>玳奇</div>
        <div :class='{active: brand==="brand4"}' @click='changebrand("brand4")'>感恩</div>
        <div :class='{active: brand==="brand6"}' @click='changebrand("brand6")'>迈可适</div>
      </section>
      <section class="install-video-brand">
        <div :class='{active: brand==="brand7"}' @click='changebrand("brand7")'>奇蒂</div>
        <div :class='{active: brand==="brand8"}' @click='changebrand("brand8")'>Kiwy</div>
        <div :class='{active: brand==="brand9"}' @click='changebrand("brand9")'>Pouch</div>
        <div :class='{active: brand==="brand10"}' @click='changebrand("brand10")'>惠尔顿</div>
        <div :class='{active: brand==="brand5"}' @click='changebrand("brand5")'>其他</div>
      </section>
      <section class="install-video-list">
        <div class="intsall-video-item" v-for="(item, index) in videolist[brand]" :key="index">
          <div class="right">
            <p class="title">{{item.title}}</p>
            <p class="desc">{{item.desc}}</p>
          </div>
          <video :poster='"https://cdn.sys.img.95laibei.com/Activitys/2018/SeatInstallVideo/" + item.index +".jpg"' :src='"https://cdn.article.video.95laibei.com/seatfile/" + item.index1 + ".mp4"' controls="" webkit-playsinline="true" playsinline="true" x-webkit-airplay="true" preload="none">您的浏览器不支持 video 标签。</video>
        </div>
      </section>
    </div>
    <go-top></go-top>
  </div>
</template>

<script>
import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'

export default {
  name: 'seatinstallvideo',
  components: {
    vHeader: head,
    goTop: goTop
  },
  data () {
    return {
      headinfo: {title: '安装视频', rightbtntext1: '<img src="https://cdn.sys.img.95laibei.com/Content/Images/ShareQRCode-0517v2.png">'},
      videolist: [],
      brand: 'brand1',
      playvideoindex: 0
    }
  },
  mounted: function () {
    this.$http({
      url: 'https://cdn.sys.file.95laibei.com/Activitys/js/seatvideo.json?v=2',
      method: 'get',
      data: null
    })
      .then(res => {
        console.log('安装视频', res.data)
        this.videolist = res.data
        this.$nextTick(function () {
          let myVideo = document.getElementsByTagName('video')
          for (let i = 0; i < myVideo.length; i++) {
            myVideo[i].removeEventListener('play', this.play)
            myVideo[i].addEventListener('play', this.play)
          }
        })
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  },
  methods: {
    play (e) {
      console.log(e)
      let myVideo = document.getElementsByTagName('video')
      for (let i = 0; i < myVideo.length; i++) {
        if (e.target !== myVideo[i]) {
          myVideo[i].pause()
        }
      }
    },
    changebrand (brand, index) {
      if (this.brand === brand) {
        return true
      } else {
        this.brand = brand
        this.$nextTick(function () {
          let myVideo = document.getElementsByTagName('video')
          for (let i = 0; i < myVideo.length; i++) {
            myVideo[i].removeEventListener('play', this.play)
            myVideo[i].addEventListener('play', this.play)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.nav{
  padding-top:1rem;
  .install-video-brand{
    display: flex;
    &:first-child{
      border-bottom: 1px solid #ddd;
    }
    div{
      flex: 1;
      font-size: 14px;
      line-height: 45px;
      text-align: center;
      &.active{
        color: @base-ycolor3;
      }
    }
  }
}
.install-video-list{
  background-color: #fff;
  .intsall-video-item{
    padding: 15px .2rem 10px .2rem;
    overflow: hidden;
    position: relative;
    .right{
      overflow: hidden;
      .title{
        font-weight: 400;
        font-size: 14px;
        color: #000;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
      }
      .desc{
        font-size: 11px;
        color: #999;
        line-height: 1.3;
        margin-top: .1rem;
        .twolinetext
      }
    }
    video{
      width: 7.1rem;
      height: 4rem;
      margin-top: 10px;
    }
    &::after{
      content: " ";
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1px;
      border-bottom: 1px solid #ddd;
      left: 10px;
    }
  }
}
</style>
