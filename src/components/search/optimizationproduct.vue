<template>
  <div>
    <div class="searchtabnav">
      <a class="iconfont back" href="javascript:;" @click="back">&#xe60a;</a>
      <input type="search" ref="searchbox" class="inputbox" v-model="goodsname" placeholder="搜商品名称" @keyup.enter="searchproduct()" @blur="clearreallist" @focus="getRealSearch(goodsname)">
      <span class="iconfont search">&#xe608;</span>
    </div>
    <div style="height:1px;"></div>
    <!-- 搜索历史 -->
    <div class="searchhis mtop" v-if="localsearchlist.length>0">
      <ul>
        <li v-for="(item, index) in localsearchlist" :key="index">
          <a href="javascript:;" @click="hotsearchfn(item.SearchKey)">{{item.SearchKey}}</a>
          <span class="iconfont" @click="delonelocalsearch(index)">&#xe665;</span>
        </li>
      </ul>
      <button class="clearhistory" @click="clearsearchhistory">清除搜索记录</button>
    </div>
    <!-- 热门搜索 -->
    <div class="hotsearch" v-if="hotlist.length>0" :class="{mtop: localsearchlist.length===0}">
      <div class="title">热门搜索</div>
      <ul>
        <li v-for="(item1, index1) in hotlist" :key="index1" @click="hotsearchfn(item1.SearchKey)">{{item1.SearchKey}}</li>
      </ul>
    </div>
    <!-- 实时搜索 -->
    <div class="hoverlist" v-show="reallist.length>0">
      <ul>
        <li v-for="(item2, index2) in reallist" :key="index2" @click="hotsearchfn(item2.suggestion)">{{item2.suggestion}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import apiport from '../../util/api'
import qs from 'qs'
import storage from '@/util/storage'
import GlobalSearchKeyHelper from '@/util/Global_SearchKeyHelper'

export default {
  name: 'OptimizationProduct',
  data () {
    return {
      localsearchlist: [],
      hotlist: [],
      reallist: [],
      goodsname: '',
      searchType: 4
    }
  },
  mounted () {
    let _that = this
    // 获取搜索历史
    this.localsearchlist = JSON.parse(storage.getDatawithDeadline('UserSearchKey' + this.searchType)) || []
    let model = {
      searchType: 4,
      pageIndex: 1,
      pageSize: 20
    }
    this.$http({
      url: apiport.Search_GetHotSearch,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('热门搜索', res.data)
        this.hotlist = res.data.Data
      })
      .catch(error => {
        console.log(error)
      })
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
    searchproduct (name) {
      let goodsname = name || this.goodsname.trim()
      if (!goodsname) {
        return true
      }
      let newlocalsearchlist = GlobalSearchKeyHelper.settlesearchlist(goodsname, this.localsearchlist)
      storage.setDatawithDeadline('UserSearchKey' + this.searchType, newlocalsearchlist, apiport.UserSearchExpTime)
      this.gotosearchresult(goodsname)
    },
    delonelocalsearch (index) {
      this.localsearchlist.splice(index, 1)
      storage.setDatawithDeadline('UserSearchKey' + this.searchType, this.localsearchlist, apiport.UserSearchExpTime)
    },
    clearsearchhistory () {
      storage.DelLocalByKey('UserSearchKey' + this.searchType)
      this.localsearchlist = []
    },
    hotsearchfn (name) {
      this.searchproduct(name)
      this.gotosearchresult(name)
    },
    gotosearchresult (name) {
      this.$router.push({name: 'searchproduct', query: {searchWord: name}})
    },
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
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.searchtabnav{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 22;
  background-color: #f1bc19;
  box-sizing: border-box;
  padding: .2rem .4rem .2rem 0;
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
}
.searchhis{
  background: #fff;
  padding-left: .8rem;
  position: relative;
  li{
    display: block;
    margin: 0;
    padding-left: .2rem;
    font-size: 15px;
    border-bottom: 1px solid #e4e8e7;
    position: relative;
    a{
      .onelinetext();
      display: block;
      font-size: .3rem;
      padding: .2rem 0;
      margin-right: .8rem;
      line-height: 0.4rem;
    }
    &::before{
      content: "\e68c";
      font-family: "iconfont";
      font-size: 15px;
      color: #9c9c9c;
      position: absolute;
      top: .26rem;
      left: -.45rem;
    }
    span{
      font-size: 16px;
      position: absolute;
      top: 0;
      right: .2rem;
      width: .6rem;
      text-align: center;
      line-height: .8rem;
    }
  }
  .clearhistory{
    width: 100%;
    -webkit-appearance: none;
    font-size: 12px;
    height: .8rem;
    color: #999;
    outline: none;
    border: none;
    background: #fff;
    position: relative;
    left: -.5rem;
  }
}
.hotsearch{
  margin-top: .2rem;
  padding: 0 .3rem;
  background: #fff;
  position: relative;
  font-size: 0;
  .title{
    line-height: .9rem;
    border-bottom: 1px solid #d3d3d4;
    font-size: 14px;
    color: #999;
  }
  li{
    display: inline-block;
    width: 50%;
    margin: 0;
    color: #000;
    padding: .2rem 0;
    font-size: 12px;
    border-bottom: 1px solid #e4e8e7;
    position: relative;
    .onelinetext();
    &:nth-child(2n){
      border-left: 1px solid #f2f2f2;
      box-sizing: border-box;
      padding-left: .2rem;
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
  li{
    padding: 10px 0;
    font-size: 15px;
    border-bottom: 1px solid #e4e8e7;
    .onelinetext();
  }
}
.mtop{
  margin-top: 1rem;
}
</style>
