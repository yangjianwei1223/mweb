<template>
  <div>
    测试
  </div>
</template>

<script>
export default {
  name: 'joinjiuwu',
  mounted () {
    try {
      console.log(1)
      window.$.ajax({
        url: 'https://t-base-api.95laibei.com/MWeb/Account/GetMbrBase',
        data: {reqJson: JSON.stringify({Token: this.$store.state.UserToken})},
        type: 'post',
        async: false,
        success: function (data) {
          console.log(222)
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      console.log(2)
    }
  }
}
</script>

<style scoped>

</style>
