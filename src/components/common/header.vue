<template>
   <header class="header">
      <div><a v-show="showbackbtn" class="iconfont back" @click="back">&#xe651;</a></div>
      <div>{{headinfo.title}}</div>
      <div>
        <a v-if="headinfo.rightbtntext1" href="javascript:;" class="rightbtn1" @click.stop="rightbtnfun1" v-html="headinfo.rightbtntext1"></a>
      </div>
    </header>
</template>

<script>
export default {
  name: 'head1',
  data () {
    return {
      showbackbtn: true
    }
  },
  props: ['headinfo'],
  beforeMount () {
    // 帮助页面从订单详情过去要返回按钮
    this.showbackbtn = this.$route.query.isback !== 1
  },
  methods: {
    back () {
      if (this.headinfo.leftfun === 1) {
        this.$emit('hidediv')
      } else {
        this.$router.back()
      }
    },
    rightbtnfun1 () {
      this.$emit('rightbtn1click')
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 22;
  background: @base-ycolor;
  display: -webkit-box;
  height: 1rem;
  line-height: 0.8rem;
  text-align: center;
  & > div {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    display: -webkit-box;
    display: -moz-box;
    font-size: 18px;
    color: #000;
  }
  & > div:first-child {
    text-align: left;
    margin-left: 0.2rem;
    -moz-box-pack: start;
    -webkit-box-pack: start;
    min-width: 20%;
  }
  & > div:last-child {
    text-align: right;
    margin-right: 0.2rem;
    -webkit-box-pack: end;
    min-width: 20%;
    font-size: 16px;
    .rightbtn1{
      font-family: 'iconfont';
      display: inline-block;
      min-width: .6rem;
      /deep/ img{
        width: .6rem;
        vertical-align: middle;
      }
    }
  }
  .back{
    font-size: 22px;
  }
}
</style>
