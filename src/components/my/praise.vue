<template>
<!-- 其他地方加了overflow-y:hidden 一直加载 -->
  <div style="width:100%;overflow-y:hidden;">
    <v-header :headinfo="headinfo"></v-header>
    <div class="container">
      <ul v-infinite-scroll="infinite" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <li class="list-item" v-for="(item,index) in praiselist" :key="index" data-type="0">
          <div class="list-box" @touchstart.capture="touchStart" @touchend.capture="touchEnd" @click="skip(item.Type, item.ProductBaseId)">
            <img class="list-img" :src='item.ImgPath + "@!standard_square_s"' alt="">
            <div class="list-content">
              <p class="title twolinetext">{{item.Title}}</p>
              <p class="price">&yen;{{item.Price}}</p>
            </div>
          </div>
          <div class="delete" @click="deleteItem($event,item.ProductBaseId)" :data-index="index">取消收藏</div>
        </li>
      </ul>
    </div>
    <div tip="正在加载" v-if="showLoading" class="tips">{{tips}}</div>
    <go-top></go-top>
  </div>
</template>

<script>
import Vue from 'vue'
import qs from 'qs'
import apiport from '../../util/api'
import infiniteScroll from 'vue-infinite-scroll'
import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'
Vue.use(infiniteScroll)

export default {
  name: 'praise',
  components: {
    vHeader: head,
    goTop: goTop
  },
  data () {
    return {
      headinfo: {title: '我收藏的'},
      currentPageIndex: 0,
      pageSize: 20,
      busy: false,
      showLoading: true,
      tips: '正在加载',
      praiselist: [],
      startX: 0,
      endX: 0
    }
  },
  methods: {
    infinite () {
      this.currentPageIndex += 1
      this.busy = true
      let model = {
        Token: this.$store.state.UserToken,
        pageIndex: this.currentPageIndex,
        pageSize: this.pageSize
      }
      this.$http({
        url: apiport.Account_GetProductPraiseList,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('我的收藏', res.data)
          if (res.data.Data.length > 0) {
            this.praiselist = this.praiselist.concat(res.data.Data)
            this.busy = false
          } else {
            this.tips = '已经到底了...'
            this.busy = true
          }
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    // 跳转
    skip (type, id) {
      if (this.checkSlide()) {
        this.restSlide()
      } else {
        type === 3 ? this.$router.push('/Seat/Detail/' + id) : this.$router.push('/Optimization/Detail/' + id)
      }
    },
    // 滑动开始
    touchStart (e) {
      // 记录初始位置
      this.startX = e.touches[0].clientX
    },
    // 滑动结束
    touchEnd (e) {
      // 当前滑动的父级元素
      let parentElement = e.currentTarget.parentElement
      // 记录结束位置
      this.endX = e.changedTouches[0].clientX
      // 左滑
      // eslint-disable-next-line
      if (parentElement.dataset.type == 0 && this.startX - this.endX > 30) {
        this.restSlide()
        parentElement.dataset.type = 1
      }
      // 右滑
      // eslint-disable-next-line
      if (parentElement.dataset.type == 1 && this.startX - this.endX < -30) {
        this.restSlide()
        parentElement.dataset.type = 0
      }
      this.startX = 0
      this.endX = 0
    },
    // 判断当前是否有滑块处于滑动状态
    checkSlide () {
      let listItems = document.querySelectorAll('.list-item')
      for (let i = 0; i < listItems.length; i++) {
        // eslint-disable-next-line
        if (listItems[i].dataset.type == 1) {
          return true
        }
      }
      return false
    },
    // 复位滑动状态
    restSlide () {
      let listItems = document.querySelectorAll('.list-item')
      // 复位
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].dataset.type = 0
      }
    },
    // 删除
    deleteItem (e, id) {
      // 当前索引
      let index = e.currentTarget.dataset.index
      // 复位
      this.restSlide()
      let model = {
        Token: this.$store.state.UserToken,
        ProductBaseId: id
      }
      this.$http({
        url: apiport.Product_BasePraise,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('取消收藏', res.data)
          // 删除
          this.praiselist.splice(index, 1)
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.container{
  padding-top: 1rem;
  // ul{
  //   overflow-x: hidden;
  // }
}
.list-item{
    position: relative;
    width: 100%;
    height: 1.8rem;
    padding-bottom: .2rem;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
}
.list-item[data-type="0"]{
    transform: translate3d(0,0,0);
}
.list-item[data-type="1"]{
    transform: translate3d(-1.6rem,0,0);
}
.list-item[data-type="0"] .delete{
  display:none;
}
.list-item[data-type="1"] .delete{
  display: block;
}
.list-item:after{
    content: " ";
    position: absolute;
    left: 2rem;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #ccc;
    color: #ccc;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
}
.list-box{
    padding: .2rem 0 0 .2rem;
    background: #fff;
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 0;
}
.list-item .list-img{
    display: block;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 3px;
}
.list-item .list-content{
    padding: 0 0 0.1rem 0.2rem;
    position: relative;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
}
.list-item .title{
    font-size: 14px;
}
.list-item .price{
  position: absolute;
  bottom:.2rem;
  font-size: 16px;
  color: #ff4965;
}
.list-item .delete{
  width: 1.6rem;
  height: 2rem;
  background: #E2421B;
  font-size: 14px;
  color: #fff;
  text-align: center;
  line-height: 2rem;
  position: absolute;
  top:0;
  right: -1.6rem;
}
.tips{
  text-align:center;
  line-height:50px;
  margin-bottom:50px;
}
</style>
