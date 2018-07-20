<template>
    <section class="st-act" v-if="ActivityList">
      <div class="item" v-for="(item,index) in ActivityList" :key="index">
        <router-link :to="item.Url">
          <img v-lazy='item.Img+"@!standard_src_l"'>
        </router-link>
        <div class="seat-sum" v-show="item.Children.length>0">
          <router-link  v-for="(item1,index1) in item.Children" :key="index1" :to="item1.Url">
            <img v-lazy='item1.Img+"@!standard_src_src"'>
          </router-link>
        </div>
      </div>
    </section>
</template>

<script>
export default {
  props: ['ActivityList']
}
</script>

<style lang="less" scoped>
@import '../../../assets/less/variable';
.st-act{
  font-size:0;
  .item{
    margin-top:.2rem;
    a{
      display:block;
    }
  }
  .seat-sum{
    display:flex;
    a{
      display:block;
      flex:1;
    }
  }
}
</style>
