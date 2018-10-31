<template>
  <div class="alerts" v-show="toastoptions.show">
    <div class="dialog">
      <h2>{{toastoptions.title || '来呗'}}</h2>
    </div>
  </div>
</template>
<script>
export default {
  props: ['toastoptions'],
  data () {
    return {}
  },
  methods: {
  }
}
</script>
<style lang='less' scoped>
.alerts{
  .dialog{
    max-width: 4rem;
    min-width: 3rem;
    padding: .3rem;
    background-color: rgba(0,0,0,.8);
    border-radius: 5px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #fff;
    text-align: center;
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
