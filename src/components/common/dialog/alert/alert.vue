<template>
  <div class="alerts" v-show="alertoptions.show">
    <div class="laibeimask" @click="closeModel"></div>
    <div class="dialog">
      <h2>{{alertoptions.title || '来呗'}}</h2>
      <button @click="sure()">确定</button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['alertoptions'],
  data () {
    return {}
  },
  methods: {
    sure () {
      if (typeof (this.alertoptions.successFun) === 'function') {
        this.alertoptions.successFun()
      }
      this.closeModel()
    },
    closeModel () {
      this.alertoptions.show = false
    }
  }
}
</script>
<style lang='less' scoped>
.alerts{
  .dialog{
    position: fixed;
    left: 50%;
    top: 50%;
    width: 72%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    z-index: 1006;
    line-height: 25px;
    color: #000;
    text-align: center;
    border: 1px solid #fff;
    border-radius: 8px;
  }
  h2{
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: normal;
    font-size: 14px;
    line-height: 1.8;
    min-height: 1.8rem;
    margin: .2rem;
    color: #333;
  }
  button{
    -webkit-appearance: none;
    color: #33a6ff;
    width: 100%;
    font-size: 14px;
    line-height: 42px;
    border: none;
    border-top: 1px solid #ebebeb;
    background-color: transparent;
    box-sizing: border-box;
    outline: none;
  }
}
</style>
