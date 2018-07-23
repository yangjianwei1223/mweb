<template>
  <section class="mybuyins">
    <h5 class="title">
      <span class="tips">{{listdata.text}}</span>
      <a class="more" :href="listdata.href">查看全部  &gt;</a>
    </h5>
    <ul class="clearfix">
      <li>
        <router-link :to="{path:listdata.href+'?status='+listdata.status[0]}">
          <i class="iconfont" :class="{newsmention:listdata.count[0]>0}" :data-msg="listdata.count[0]">&#xe679;</i>
          <p>待付款</p>
        </router-link>
      </li>
      <li>
        <router-link :to="{path:listdata.href+'?status='+listdata.status[1]}">
          <i class="iconfont" :class="{newsmention:listdata.count[1]>0}" :data-msg="listdata.count[1]">&#xe67b;</i>
          <p>待发货</p>
        </router-link>
      </li>
      <li>
        <router-link :to="{path:listdata.href+'?status='+listdata.status[2]}">
          <i class="iconfont" :class="{newsmention:listdata.count[2]>0}" :data-msg="listdata.count[2]">&#xe67d;</i>
          <p>待收货</p>
        </router-link>
      </li>
      <li>
        <router-link :to="{path:listdata.href+'?status='+listdata.status[3]}">
          <i class="iconfont" :class="{newsmention:listdata.count[3]>0}" :data-msg="listdata.count[3]">&#xe62c;</i>
          <p>待评价</p>
        </router-link>
      </li>
      <li>
        <router-link :to="{path:listdata.href+'?status='+listdata.status[4]}">
          <i class="iconfont" :class="{newsmention:listdata.count[4]>0}" :data-msg="listdata.count[4]">&#xe67e;</i>
          <p>退换货</p>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: ['listdata']
}
</script>

<style lang="less" scoped>
.title{
  margin-left: .2rem;
  padding-right: .2rem;
  height:.8rem;
  line-height:.8rem;
  border-bottom: 1px solid #ededed;
  .tips{
    float: left;
    padding-left: .2rem;
    font-size: 13px;
    color: #333;
    position:relative;
    &:before{
      content: '';
      position: absolute;
      top: .25rem;
      left: 0;
      width: 2px;
      height: 15px;
      background-color: #E62327
    }
  }
  .more{
    float: right;
    color: #989898;
    font-size: 11px;
  }
}
.mybuyins{
  background-color: #fff;
  margin-bottom: .2rem;
  ul>li{
    float: left;
    width: 20%;
    box-sizing: border-box;
    text-align: center;
    a{
      display:block;
      padding: .25rem 0;
    }
    .iconfont{
      font-size: 16px;
      position:relative;
      &.newsmention::before{
        content: attr(data-msg);
        position: absolute;
        top: -7px;
        right: -10px;
        width: 15px;
        font-size: 10px;
        color: #E62327;
        border-radius:50%;
        font-weight: 600;
        text-align: center;
        background: url(https://cdn.sys.img.95laibei.com/Content/Images/redcircle.png) no-repeat center;
        background-size: contain;
        letter-spacing: -1px;
      }
    }
    p{
      font-size: 12px;
      color: #333;
      margin-top: .15rem;
    }
  }
}
</style>
