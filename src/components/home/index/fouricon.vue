<template>
    <div class="fouricon" v-if="MenuList">
      <router-link v-for="(item,index) in MenuList" :to="item.Url" :key="index">
        <img v-lazy='item.Img+"@!standard_src_src"'>
      </router-link>
    </div>
</template>

<script>
export default {
  props: ['MenuList']
}
</script>

<style lang="less" scoped>
@import '../../../assets/less/variable';
.fouricon{
  background: #fff;
  display: flex;
  a{
    display:block;
    flex:1;
    font-size:0;
    text-align: center;
    img{
      width:100%;
    }
  }
}
</style>
