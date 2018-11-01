<template>
  <div class="alerts" v-if="show">
    <div class="laibeimask"></div>
    <div class="dialog">
      <h2 class="title">{{title}}</h2>
      <div class="btns">
        <button @click="sure()">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      show: false,
      title: '来呗',
      successFun: null
    }
  },
  methods: {
    sure () {
      if (typeof (this.successFun) === 'function') {
        this.successFun()
      }
      this.closeModel()
    },
    closeModel () {
      this.show = false
    }
  }
}
</script>
<style lang='less' scoped>
</style>
