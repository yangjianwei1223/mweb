<template>
  <div>
    <div class="searchtabnav">
      <a class="iconfont back" href="javascript:;" @click="back">&#xe60a;</a>
      <input type="search" ref="searchbox" class="inputbox" v-model="goodsname" placeholder="搜商品" @keyup.enter="searchproduct()" @blur="clearreallist" @focus="getRealSearch(goodsname)">
      <span class="iconfont search">&#xe608;</span>
      <a href="javascript:;" class="iconfont chat" @click="skipchat">&#xe67a;</a>
    </div>
    <!-- 实时搜索 -->
    <div class="hoverlist" v-show="reallist.length>0">
      <ul>
        <li v-for="(item2, index2) in reallist" :key="index2" @click="searchproduct(item2.suggestion)">{{item2.suggestion}}</li>
      </ul>
    </div>
    <div v-infinite-scroll="getproductlist" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="productlist">
      <ul>
        <li v-for="(list,index) in searchlist" :key="index" class="item">
          <router-link :to='"/Optimization/Detail/" + list.ProductBaseId' class="goodsa">
            <img class="lazyDetail" :src='list.ImgPath + "@!standard_square_m"'>
            <p class="retitle">{{list.Title}}</p>
            <p class="redesc">{{list.Content}}</p>
            <p class="pricesale">
              <span class="newprice">¥ {{list.MarketPrice}}</span><span class="oldprice">￥{{list.Price}}</span><span class="sales"> 销量 <span>{{list.Sales}}</span></span>
            </p>
          </router-link>
        </li>
      </ul>
    </div>
    <!-- 模糊搜索提示 -->
    <div class="SearchMoreDom" v-if="finished && showmore === 0">
      <div class="left">
        <img src="https://cdn.sys.img.95laibei.com/Content/Images/fuzzy-search-result.png" alt="">
      </div>
      <div class="right">
        <p class="top">没有找到您想要的商品？</p>
        <p class="btm">建议您尝试<span @click="fuzzysearch">模糊搜索&gt;&gt;</span></p>
      </div>
    </div>
    <div tip="正在加载" class="tips" v-else>{{tips}}</div>
    <go-top></go-top>
  </div>
</template>

<script>
import Vue from 'vue'
import apiport from '../../util/api'
import infiniteScroll from 'vue-infinite-scroll'
import qs from 'qs'
import storage from '@/util/storage'
import GlobalSearchKeyHelper from '@/util/Global_SearchKeyHelper'
import goTop from '@/components/common/scrolltop'

Vue.use(infiniteScroll)
export default {
  name: 'product',
  components: {
    goTop
  },
  data () {
    return {
      key: '',
      goodsname: '',
      searchlist: [],
      reallist: [],
      currentpage: 0,
      busy: false,
      showLoading: true,
      tips: '正在加载',
      searchType: 4,
      showmore: 0, // 0 精确搜索 1模糊搜索
      localsearchlist: [],
      finished: false // 是否到底
    }
  },
  mounted () {
    let _that = this
    this.key = this.goodsname = this.$route.query.searchWord
    // 获取搜索历史
    this.localsearchlist = JSON.parse(storage.getDatawithDeadline('UserSearchKey' + this.searchType)) || []
    // 监听输入框
    this.$watch('goodsname', GlobalSearchKeyHelper.debounce((newQuery) => {
      // newQuery为输入的值
      _that.getRealSearch(newQuery)
    }, 200))
  },
  methods: {
    back () {
      this.$router.back()
    },
    skipchat () {
      this.$router.push('/wechat/im')
    },
    // 搜索框回车或点击实时词汇
    searchproduct (name) {
      document.activeElement.blur()
      let goodsname = name || this.goodsname.trim()
      if (!goodsname) {
        return true
      }
      let newlocalsearchlist = GlobalSearchKeyHelper.settlesearchlist(goodsname, this.localsearchlist)
      storage.setDatawithDeadline('UserSearchKey' + this.searchType, newlocalsearchlist, apiport.UserSearchExpTime)
      this.key = this.goodsname = goodsname
      this.searchlist = []
      this.currentpage = 0
      this.busy = false
      this.tips = '正在加载'
      this.showmore = 0
      this.finished = false
      this.getproductlist()
    },
    // 获取十条实时联想词汇
    getRealSearch (query) {
      query = query.trim()
      let _that = this
      if (!query) {
        this.reallist = []
        return true
      }
      GlobalSearchKeyHelper.getRealSearch(query).then(function (data) {
        if (_that.$refs.searchbox === document.activeElement) {
          _that.reallist = data || []
        } else {
          _that.reallist = []
        }
      })
      console.log(this.reallist)
    },
    clearreallist () {
      this.reallist = []
    },
    getproductlist () {
      this.busy = true
      this.currentpage += 1
      let model = {
        contentKey: this.key,
        pageIndex: this.currentpage,
        pageSize: 20,
        type: 1,
        showmore: this.showmore
      }
      this.$http({
        url: apiport.Search_GetProduct,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          if (res.data && res.data.ResultNo === '00000000' && res.data.Data.length > 0) {
            this.searchlist = this.searchlist.concat(res.data.Data)
            this.busy = false
            if (res.data.Data.length < 20) {
              this.tips = '已经到底了...'
              this.busy = true
              this.finished = true
            }
          } else {
            this.tips = '已经到底了...'
            this.busy = true
            this.finished = true
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    fuzzysearch () {
      this.searchlist = []
      this.currentpage = 0
      this.busy = false
      this.tips = '正在加载'
      this.finished = false
      this.showmore = 1
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/variable';
.searchtabnav{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 22;
  background-color: #f1bc19;
  box-sizing: border-box;
  padding: .2rem 0 .2rem 0;
  display: flex;
  .back{
    display: block;
    font-size: 20px;
    width:1rem;
    line-height:30px;
    text-align: center;
  }
  .inputbox{
    flex: 1;
    padding-left: 30px;
    background: #efefef;
    height: 100%;
    -webkit-appearance: none;
    border: 0;
    outline: 0;
    border-radius: 2px;
    line-height: 1.3;
    height:30px;
  }
  .search{
    position: absolute;
    left: 1rem;
    top: 8px;
    border: 0;
    padding: 7px 5px;
    font-size: 17px;
    color: #b5b5b6;
  }
  .chat{
    display: block;
    width: 40px;
    line-height: 30px;
    text-align: center;
  }
}
.productlist{
  padding: 1rem 0 0 .2rem;
  background-color: #fff;
  .item{
    position: relative;
    margin: .3rem 0;
    padding-bottom: .3rem;
    border-bottom: 1px solid #dcdddd;
  }
  .goodsa{
    display:block;
    height:1.8rem;
    img{
      float:left;
      width:1.8rem;
      height:1.8rem;
      border-radius: .2rem;
    }
    p{
      width:4.9rem;
      margin-left: 2rem;
      .twolinetext();
    }
    .retitle{
      line-height: .4rem;
      font-size: .28rem;
    }
    .redesc{
      line-height: .3rem;
      color:#9fa0a0;
      font-size: .24rem;
      -webkit-line-clamp: 1;
    }
    .pricesale{
      position:absolute;
      bottom:.3rem;
      left:0;
      line-height: 1;
      .newprice{
        display: inline-block;
        width: 1.5rem;
        font-size: .32rem;
        color: #ff9c00;
      }
      .oldprice{
        display: inline-block;
        width: 1.7rem;
        max-width: 2rem;
        font-size: .24rem;
        color: #9fa0a0;
        text-decoration: line-through;
      }
      .sales{
        display: inline-block;
        width: 1.7rem;
        max-width: 2rem;
        font-size: .24rem;
        color: #3e3a39;
      }
      .sales span{
        color: #9fa0a0;
      }
    }
  }
}
.hoverlist{
  position:fixed;
  top:1rem;
  left: 0;
  width: 100%;
  background: #fafafa;
  padding: 0 .2rem .2rem .3rem;
  z-index: 1111;
  li{
    padding: 10px 0;
    font-size: 15px;
    border-bottom: 1px solid #e4e8e7;
    .onelinetext();
  }
}
.SearchMoreDom{
  display: flex;
  justify-content: center;
  padding: .5rem 0;
  background-color: #efefef;
  .left{
    width: 1.1rem;
    height: 1rem;
    font-size: 0;
  }
  .right{
    margin-top: .1rem;
    margin-left: .2rem;
    .top{
      font-size: 12px;
      color: #666;
      line-height: 1;
    }
    .btm{
      margin-top: .15rem;
      color: #333;
      font-size: 13px;
      line-height: 1;
      span{
        font-size: 15px;
        color: #ff9c00;
      }
    }
  }
}
.tips{
  text-align:center;
  line-height:50px;
  margin-bottom:50px;
}
</style>
