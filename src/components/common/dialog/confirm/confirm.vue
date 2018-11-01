<template>
  <div class="alerts" v-if="show">
    <div class="laibeimask"></div>
    <div class="dialog">
      <h2>{{title || '来呗'}}</h2>
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
      cancelFun: null
    }
  },
  methods: {
    sure () {
      if (typeof (this.successFun) === 'function') {
        this.successFun()
      }
      this.closeModel()
    },
    cancel () {
      if (typeof (this.cancelFun) === 'function') {
        this.cancelFun()
      }
      this.closeModel()
    },
    closeModel () {
      this.show = false
    }
  }
}
</script>
