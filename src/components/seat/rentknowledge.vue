<template>
  <div class="rentknowledge">
    <header class="header">
      <div><a class="iconfont back" @click="back">&#xe651;</a></div>
      <div id="headerTitle">租赁须知</div>
      <div></div>
    </header>
    <div class="domcontent" v-html="dom"></div>
    <go-top></go-top>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import goTop from '@/components/common/scrolltop'

export default {
  name: 'RentKnowledge',
  data () {
    return {
      dom: ''
    }
  },
  components: {
    goTop
  },
  mounted () {
    let model = {
      code: 'zulinKnowlege'
    }
    this.$http({
      url: apiport.DocumentBase_GetByCode,
      method: 'post',
      data: qs.stringify({reqJson: JSON.stringify(model)})
    }).then((res) => {
      console.log(1, res)
      this.dom = res.data.Data.Content
    }).catch((error) => {
      console.log(2, error)
    })
  },
  methods: {
    back () {
      this.$router.back()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  }
  .back{
    font-size: 22px;
  }
}
.domcontent{
  margin-top: 1rem;
  font-size: 0;
}
</style>
