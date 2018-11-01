<template>
  <div class="alerts" v-if="show">
    <div class="laibeimask"></div>
    <div class="dialog">
      <h2>{{title}}</h2>
      <input type="text" class="promptinput" :placeholder="placeholder" v-model="promptval">
      <div class="btns">
        <button @click="cancel()" class="leftbtn">取消</button>
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
      successFun: null,
      cancelFun: null,
      promptval: '',
      placeholder: ''
    }
  },
  methods: {
    sure () {
      if (typeof (this.successFun) === 'function') {
        this.successFun(this.promptval)
      }
      this.closeModel()
    },
    cancel () {
      if (typeof (this.cancelFun) === 'function') {
        this.cancelFun(this.promptval)
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
