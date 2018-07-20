<template>
    <section class="st-more" v-if="OptimizationList.length>0">
      <div class="title">
        <span class="tips">优选推荐</span>
        <a href="Zulin" class="more">查看更多>></a>
      </div>
      <div class="seat-sum">
        <router-link :to="item.Url" v-for="(item,index) in OptimizationList" :key="index">
          <img v-lazy='item.Img+"@!standard_src_src"'>
        </router-link>
      </div>
    </section>
</template>

<script>
export default {
  props: ['OptimizationList']
}
</script>

<style lang="less" scoped>
@import '../../../assets/less/variable';
.st-more{
  .bgwhite;
  margin-top: .2rem;
  .title{
    font-size: @base-ftsize;
    padding:0 .2rem;
    height:.7rem;
    line-height: .7rem;
    .tips{
      float: left;
      position: relative;
      padding-left: .2rem;
      &:before{
        content: '';
        position: absolute;
        top: .2rem;
        left: 0;
        width: 2px;
        height: 15px;
        background-color: @base-ycolor3;
      }
    }
    .more{
      float:right;
      color:@base-ycolor3;
    }
  }
  .seat-sum{
    display:flex;
    a{
      display:block;
      flex:1;
    }
  }
  .pushbuy{
    display:flex;
    .left{
      width:3.2rem;
    }
    .right{
      flex:1;
    }
  }
}
</style>
