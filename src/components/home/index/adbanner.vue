<template>
    <section class="st-ad" v-if="MiddleActivity.length>0">
      <router-link :to="MiddleActivity[0].Url">
        <img v-lazy='MiddleActivity[0].Img+"@!standard_src_src"'>
      </router-link>
    </section>
</template>

<script>
export default {
  props: ['MiddleActivity']
}
</script>

<style lang="less" scoped>
.st-ad{
  a{
    display:block;
  }
}
</style>
