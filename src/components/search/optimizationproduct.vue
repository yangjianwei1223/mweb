<template>
  <div>
    <a href="javascript:;" @click="ss(1)">我是一个alert按钮</a>
    <a href="javascript:;" @click="ss(2)">我是一个confirm按钮</a>
    <a href="javascript:;" @click="ss(3)">我是一个alert按钮</a>
    <a href="javascript:;" @click="ss(4)">我是一个alert按钮</a>
    <a href="javascript:;" @click="ss(1)">我是一个alert按钮</a>
    <a href="javascript:;" @click="ss(1)">我是一个alert按钮</a>
    <a href="javascript:;" @click="ss(1)">我是一个alert按钮</a>
    <alerts :alertoptions='alertoptions'></alerts>
    <confirms :confirmoptions='confirmoptions'></confirms>
  </div>
</template>

<script>
export default {
  name: 'OptimizationProduct',
  data () {
    return {
      alertoptions: {
        show: false,
        title: '来呗',
        successFun: function () {
          alert('alert确定了')
        }
      },
      confirmoptions: {
        show: false,
        title: 'laibei',
        successFun: function () {
          alert('queding')
        },
        cancelFun: function () {
          alert('quxiao')
        }
      }
    }
  },
  methods: {
    ss (i) {
      if (i === 1) {
        this.alertoptions.show = true
      } else if (i === 2) {
        this.confirmoptions.show = true
      }
    }
  }
}
</script>

<style scoped>

</style>
