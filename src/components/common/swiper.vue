<template>
  <div class="swiper">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(item, index) in swiperdata" :key="index">
          <a :href="item.Url">
            <img :src='item.Img+"@!standard_src_l"'>
          </a>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>
<script>
import {swiper, swiperSlide} from 'vue-awesome-swiper'
export default{
  name: 'swiper11',
  props: ['swiperdata'],
  data () {
    return {
      // 轮播config
      swiperOption: {
      // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
        debugger: true,
        slidesPerView: '1', // 设置slider容器能够同时显示的slides数量(carousel模式)。可以设置为数字（可为小数，小数不可loop），或者 'auto'则自动根据slides的宽度来设定数量。loop模式下如果设置为'auto'还需要设置另外一个参数loopedSlides
        autoplay: {delay: 4000, disableOnInteraction: false},
        pagination: {
          el: '.swiper-pagination',
          clickable: !0
        }
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  }
}
</script>
<style lang="less">
@import '../../assets/less/variable';
@import '../../../static/css/swiper.min.css';
.swiper-container {
    width: 100%;
    height: 3.5rem;
}
.swiper-slide{
    width:100%;
    height:3.5rem;
}
.swiper-slide img{
    width: 100%;
    height:100%;
    display: block;
}
.swiper-pagination-bullet{
    background:#fff;
}
.swiper-pagination-bullet-active{
    background: @base-ycolor2;
}
</style>
