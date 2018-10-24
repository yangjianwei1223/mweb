<template>
  <div>
    <ul class="pic-group bgtr">
      <li v-for="(item, index) in uploadimg.imglist" :key="index">
        <img :src="item.imgpath">
        <span class="delimg" @click="delimg(index)"></span>
      </li>
      <li v-show="uploadimg.imglist.length < uploadimg.max">
        <label class="btnfile">
          <img :src='uploadimg.type === 2 ? "https://cdn.sys.img.95laibei.com/Content/Images/upimg1.png" : "https://cdn.sys.img.95laibei.com/Content/Images/uploadPhotos.png"'>
          <input type="file" class="input-file" accept="image/*" @change="sendimg">
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import {ZipAndUploadImg} from '@/util/Global_ImgHelper'
export default {
  props: ['uploadimg'],
  data () {
    return {
    }
  },
  methods: {
    sendimg (ele) {
      ZipAndUploadImg(ele, 1, this.sucfun, this.failfun)
    },
    sucfun (res) {
      this.uploadimg.imglist.push({imgpath: res.Path + '@!standard_square_s', imgbaseid: res.ImgBaseId})
      this.$emit('passimgid', res.ImgBaseId)
    },
    failfun () {
      console.log('图片上传失败')
    },
    delimg (index) {
      this.$emit('passimgid', this.uploadimg.imglist[index].imgbaseid)
      this.uploadimg.imglist.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.pic-group {
  padding: .2rem .2rem 0 .1rem;
  overflow: hidden;
  li {
    position: relative;
    float: left;
    width: 1.9rem;
    height: 1.8rem;
    padding: 0 0 0 .2rem;
    margin-bottom: 6px;
    box-sizing: border-box;
    .delimg {
      display: block;
      position: absolute;
      right: -9px;
      top: -9px;
      width: 25px;
      height: 25px;
      background: url(https://cdn.sys.img.95laibei.com/Content/Images/deletev2.png) no-repeat top right;
      background-size: 20px 20px;
    }
  }
  img {
    width: 1.7rem;
    height: 1.7rem;
    vertical-align: top;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .input-file {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    opacity: .01;
    z-index: 1;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    outline: none;
  }
}
</style>
