<template>
    <p class="goTop" v-show="goTopShow" @click="goTop"></p>
</template>
<script>
export default {
  name: 'goTop',
  data () {
    return {
      scrollTop: '',
      goTopShow: false
    }
  },
  methods: {
    handleScroll () {
      this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (this.scrollTop > 700) {
        this.goTopShow = true
      } else {
        this.goTopShow = false
      }
    },
    goTop () {
      document.body.scrollTop = document.documentElement.scrollTop = 0
      this.goTopShow = false
    }
  },
  mounted () {
    this.handleScroll()
    window.addEventListener('scroll', this.handleScroll)
    console.log('bind1')
    // window.addEventListener('scroll',function(){console.log('bind')})
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
    console.log('unbind1')
    // window.removeEventListener('scroll',function(){console.log('unbind')})
  }
}
</script>
<style scoped>
  .goTop{
    position: fixed;
    bottom: 60px;
    right: 5px;
    z-index: 50;
    width: 35px;
    height: 35px;
    background: url(http://cdn.sys.img.95laibei.com/Content/Images/gotop.png) no-repeat;
    background-size: 35px;
    cursor: pointer;
    margin-bottom: env(safe-area-inset-bottom);
  }
</style>
