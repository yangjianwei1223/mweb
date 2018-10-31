<template>
  <div class="alerts" v-show="confirmoptions.show">
    <div class="laibeimask" @click="closeModel"></div>
    <div class="dialog">
      <h2>{{confirmoptions.title || '来呗'}}</h2>
      <button @click="cancel()" class="cancelbtn">取消</button><button @click="sure()">确定</button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['confirmoptions'],
  data () {
    return {}
  },
  methods: {
    sure () {
      if (typeof (this.confirmoptions.successFun) === 'function') {
        this.confirmoptions.successFun()
      }
      this.closeModel()
    },
    cancel () {
      if (typeof (this.confirmoptions.cancelFun) === 'function') {
        this.confirmoptions.cancelFun()
      }
      this.closeModel()
    },
    closeModel () {
      this.confirmoptions.show = false
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
    margin: .2rem;
    color: #333;
  }
  button{
    -webkit-appearance: none;
    color: #33a6ff;
    width: 50%;
    font-size: 14px;
    line-height: 42px;
    border: none;
    border-top: 1px solid #ebebeb;
    background-color: transparent;
    box-sizing: border-box;
    outline: none;
  }
  .cancelbtn{
    color:#666;
    border-right: 1px solid #e5e5e5;
  }
}
</style>
