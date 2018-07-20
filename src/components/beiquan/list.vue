<template>
  <div class="quan">
    <header class="header">
      <div></div>
      <div id="headerTitle">呗圈2</div>
      <div>
          <a id="im-messagelink" class="iconfont message newsmention" data-msg="3">&#xe67a;</a>
      </div>
    </header>
    <div v-infinite-scroll="infinite" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="_v-container">
      <section v-for="(list,index) in listdata" :key="index" class="item">
        <template v-if="list.Type==0">
          <router-link :to="{path:'/beiquan/detail/'+list.ArticleBaseId}" class="tw">
            <div class="left">
              <p class="title twolinetext">{{list.Title}}</p>
              <p class="dateinfo"><span>{{list.CreateTime}}</span><span>{{list.PraiseCount}} <i class="iconfont">&#xe624;</i></span></p>
            </div>
            <div class="right">
              <img class="lazyDetail" v-lazy='list.ImgList[0]+"@!standard_rectangle_m"'>
            </div>
          </router-link>
        </template>
        <template v-else>
          <p class="title twolinetext">{{list.Title}}</p>
          <video :poster='list.ImgList[0]+"@!standard_rectangle_m"' :src="list.VideoList[0]" :data-index="index" @play="pauseothervideo" controls="" webkit-playsinline="true" playsinline="true" x-webkit-airplay="true" preload="none">您的浏览器不支持 video 标签。</video>
        </template>
      </section>
    </div>
    <div tip="正在加载" v-if="showLoading" class="tips">{{tips}}</div>
    <v-footer :urlRouter="$route.path" />
    <go-top></go-top>
  </div>
</template>

<script>
import Vue from 'vue'
import apiport from '../../util/api'
import infiniteScroll from 'vue-infinite-scroll'

import qs from 'qs'
import footer from '../common/footer'
import goTop from '@/components/common/scrolltop'

Vue.use(infiniteScroll)

export default {
  name: 'List',
  data () {
    return {
      listdata: [],
      page: 0,
      busy: false,
      showLoading: true,
      tips: '正在加载'
    }
  },
  components: {
    'v-footer': footer,
    goTop
  },
  watch: {
  },
  methods: {
    getArticleData (done) {
      let model = {
        Token: '5061b637-a63e-4665-b448-b1b5bfeb4447',
        pageIndex: this.page,
        pageSize: 20
      }
      this.$http({
        url: apiport.BeiQuan_GetNewsList,
        // header:{
        //     "Content-Type":'application/x-www-form-urlencoded;charset=UTF-8'
        //   },
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log(1)
          console.log(res)
          if (res.data.Data.length > 0) {
            this.listdata = this.listdata.concat(res.data.Data)
            setTimeout(() => {
              done(true)
            }, 1500)
          } else {
            console.log(done)
            setTimeout(() => {
              done()
            }, 1500)
          }
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },

    infinite (done) {
      this.page += 1
      this.busy = true
      let model = {
        Token: '5061b637-a63e-4665-b448-b1b5bfeb4447',
        pageIndex: this.page,
        pageSize: 20
      }
      this.$http({
        url: apiport.BeiQuan_GetNewsList,
        method: 'post',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          if (res.data.Data.length > 0) {
            this.listdata = this.listdata.concat(res.data.Data)
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
    pauseothervideo ($event) {
      let videos = document.getElementsByTagName('video')
      let index = $event.target.dataset.index
      for (let i = 0; i < videos.length; i++) {
        videos[i].dataset.index !== index && !videos[i].paused && videos[i].pause()
      }
    }
  },
  mounted: function () {
    // this.getArticleData();
    let videos = document.getElementsByClassName('video')
    for (let i = 0; i < videos.length; i++) {
      videos[i].addEventListener('play', function () {
        for (let j = 0; j < videos.length; j++) {
          j !== i && videos[j].paused()
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../../assets/less/variable";
.quan{
  position:absolute;
  top:0;
  bottom:50px;
  left:0;
  right:0;
}
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
    -ms-box-flex: 1;
    -o-box-flex: 1;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -ms-box-pack: center;
    -o-box-pack: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    -mz-box-align: center;
    -o-box-align: center;
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
}
._v-container {
  margin-top: 1rem;
  padding: 0 0.2rem;
  background-color: #fff;
  bottom:50px;
  box-sizing: border-box;
  .item {
    padding: 0.2rem 0;
    border-bottom: 1px solid #ededed;
    .title {
      font-size: 14px;
      color: #333;
      margin-bottom: 0.2rem;
    }
    .dateinfo{
      color:@base-color2;
      span:last-child{
        float:right;
        i{
          color:@base-ycolor;
        }
      }
    }
    video {
      width: 7.1rem;
      height: 4rem;
    }
    .tw {
      display: flex;
      .left {
        width: 60%;
      }
      .right {
        width: 32%;
        margin-left: 8%;
        font-size: 0;
        img {
          width: 2.25rem;
          height: 1.45rem;
        }
      }
    }
  }
}
.quan .tips{
  text-align:center;
  line-height:50px;
  margin-bottom:50px;
}
</style>
