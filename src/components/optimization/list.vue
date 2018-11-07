<template>
  <div class="optimation-list-topnav">
    <v-header :headinfo="headinfo"></v-header>
    <div class="gallery-top" >
        <ul class="gallery-container" id="OptimizationDate" :style="{width:topNavLength*100+'px'}">
            <li v-for="(item,index) in TopNavList" :key="index" :class="[navActiveIndex===index?'active':'', 'slide']"
            :data-id="item.id" :data-page="item.page"><span>{{item.name}}</span></li>
        </ul>
    </div>
     <div class="gallery-thumbs swiper-container" >
        <swiper class="gallery-container" id="TopCategoryList" :options="swiperOptionThumbs" ref="swiperOptionThumbs"
        @slideNextTransitionStart="getNextActiveIndex" @slidePrevTransitionStart="getPreActiveIndex">
            <div class="Preferred">
                <ul class="CategoryDataList clearfix">
                    <swiper-slide v-for="(item,index) in BottomProList" :key="index">
                        <a :href="'/Optimization/Detail/'+item.ProductBaseId">
                            <img :src="item.Path+'@!standard_src_l'" />
                            <p class="ptitle onelinetext">{{item.Title}}</p>
                            <p class="price">¥ {{item.Price}} <span class="sale">销量 {{item.Sales}}</span></p>
                        </a>
                    </swiper-slide>
                </ul>
            </div>
        </swiper>
    </div>
    <go-top></go-top>
  </div>
</template>

<script>
/* eslint-disable */ 
import Vue from 'vue'
import qs from 'qs'
import apiport from '../../util/api'
import infiniteScroll from 'vue-infinite-scroll'
import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'
import {swiper, swiperSlide} from 'vue-awesome-swiper'

Vue.use(infiniteScroll)
export default {
  name: 'optimizationlist',
  components: {
    vHeader: head,
    goTop: goTop,
    swiper,
    swiperSlide
  },
  data () {
    return {
      headinfo: {title: '母婴用品'},
      currentPageIndex: 0,
      pageSize: 20,
      busy: false,
      showLoading: true,
      tips: '正在加载',
      swiperOptionThumbs:{
        slidesPerView: 1,
      },
        topNavLength: 0,
        navActiveIndex:0,
        TopNavList:[
            // {name: '精选推荐', id:0, page:2},
            // {name: '蜜芽专区', id:0, page:0}
        ],
        BottomProList:[]
    }
  },
  methods: {    
    getNextActiveIndex () {
        let swiper = this.$refs.swiperOptionThumbs.swiper;
        let i = swiper.activeIndex; //当前activeIndex
        //console.log("当前topnav active的index为 "+ i)
        this.navActiveIndex = i

    },
    getPreActiveIndex () {
        let swiper = this.$refs.swiperOptionThumbs.swiper;
        let i = swiper.activeIndex; //当前activeIndex
        //console.log("当前topnav active的index为 "+ i)
        this.navActiveIndex = i
    },
    getCategoryList () { 
        //let CategoryTopId=0
        let model =
        {
            pageIndex:1,
            pageSize:20,
            CategoryTopId:0,
            CategorySubId:0,
            SupplierId:0
        }
        this.$http({
            url:apiport.Product_GetProductListByCategory,
            method:"post",
            data: qs.stringify({ reqJson: JSON.stringify(model) })
        }).then(res=>{
            console.log(res.data)
            this.BottomProList=res.data.Data
        }).catch(error=>{
            console.log("获取下面的数据列表报错")
            console.log(error)
        })
    }
  },
  computed:{

  },
  created () {
    this.$http({
      url: apiport.Product_GetCategoryTop,
      method: 'post',
    })
      .then(res => {
        console.log('母婴列表头部分类', res.data)
        let AddtionTopNav= res.data.IndependentModelList
        let allContent= res.data.Content
        let allTopLen = allContent.length
        var TopArr=[]
        this.topNavLength = allTopLen
        for (let m=0;m<allTopLen;m++){
            TopArr.push({//{name: '精选推荐', id:0, page:2, },
                "name": allContent[m].Name,
                "id":allContent[m].CategoryTopId,
                "page":0
            });
            if(allContent[m].CategorySubList.length>0){
                let subCategorylen= allContent[m].CategorySubList.length
                for(let k = 0 ;k<subCategorylen; k++){
                    TopArr[m].subCategory=[]
                    TopArr[m].subCategory.push({//subCategory:{sname:'',sid:0,imgPath:""},
                        "sname":allContent[m].CategorySubList[k].Name,
                        "sid":allContent[m].CategorySubList[k].CategorySubId,
                        "imgPath":allContent[m].CategorySubList[k].Path
                    });
                }
            }
        } 
        TopArr.unshift({"name":"蜜芽专区","id":AddtionTopNav[0].SupplierId,"page":0})//蜜芽
        TopArr.unshift({"name":"精选推荐","id":0,"page":0})
        this.TopNavList=TopArr
        this.getCategoryList();
      })
      .catch(error => {
        console.log("母婴头部分类 获取报错")
        console.log(error)
      })
  },
  mounted () {
    //console.log('母婴用品')
    // let model = {
    //   Token: this.$store.state.UserToken,
    //   OrderType: 2,
    //   OrderState: this.OrderState,
    //   pageIndex: this.currentPageIndex,
    //   pageSize: this.pageSize
    // }
    // this.$http({
    //   url: apiport.Product_GetProductListByCategory,
    //   method: 'post',
    //   data: qs.stringify({ reqJson: JSON.stringify(model) })
    // })
    //   .then(res => {
    //     console.log('母婴分类', res.data)
    //   })
    //   .catch(error => {
    //     console.log(2)
    //     console.log(error)
    //   })
  }
}
</script>

<style lang="less">
@import '../../assets/less/variable';
@import '../../../static/css/swiper.min.css';
.gallery-top{
  line-height: 40px;
  text-align: center;
  font-size: 15px;
  height:40px;
  position:fixed;
  background-color:#fff;
  overflow-x:auto;
  z-index:22;
  left: 0;
  top: 1rem;
  width: 100%;
}
.optimation-list-topnav .gallery-top::-webkit-scrollbar {
    display:none;
}
.optimation-list-topnav .gallery-top .gallery-container {
    height:  40px;
    background: #fff;
    position:relative;
    overflow: hidden;
    box-sizing: border-box;
}
.optimation-list-topnav .gallery-top .gallery-container .swiper-wrapper{
    // width: 100%;
    overflow-x: scroll;
    height: 40px;
    display: -webkit-flex;
    display: flex;
}
.optimation-list-topnav .gallery-top .slide{
    float:left;
    max-width:100px !important;
    height: 40px;
    margin: 0 13px;
    position:relative;
}
.optimation-list-topnav .gallery-top span{
    display: inline-block;
    font-size:15px;
}
.optimation-list-topnav .gallery-top .active span{
    color:#ff9c00;  
}
/*贝壳兑换各个分类页-17.05.09??优选列表页*/
.optimization-pro-list{
    display:-webkit-flex;
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
    padding: .1rem .2rem;
    background: #fff;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    flex-flow: row wrap;
}
.optimization-nav-item{
    width:25%;
    margin-top: .1rem;
    text-align: center;
}
.optimization-nav-item img{
    width:1rem;
    height:1rem;
}
.optimization-nav-item p{
    font-size:13px;
    margin-top: .1rem;
}
.optimization-nav-item.selected p{
    color: #ff9c00;
}
.optimization-pro-nav .Preferred{
    height:auto;
}
.gallery-thumbs{
    margin-top:2rem;
}
.gallery-thumbs .OtherCategory .pageloading{
    padding: 1.5rem 0 6rem;
    position:relative;
    z-index:2;
    background:#fff;
}
.gallery-thumbs .OtherCategory .pageloading>img{
    display: block;
    width: 3rem;
    margin: 0 auto;
    height: auto;
}

.gallery-thumbs .swiper-wrapper{
    display: -webkit-flex;
    display: flex;
}
.gallery-thumbs .swiper-wrapper .div{
    width:100%;
    height: 100%;
}


/*底部的dropload被覆盖*/
.gallery-thumbs.swiper-container>.swiper-wrapper{
	margin-bottom:50px;
    padding-top:40px;
}
.gallery-thumbs.swiper-container .dropload-down{
	position: absolute;
    bottom: -50px;
    left:0;
    width: 100%;
}
#OptimizationDate .optimization-categorylist-goods{
    overflow:hidden;
}
.gallery-thumbs .home-product-list li a{
    display:block;
}
.gallery-thumbs>.swiper-wrapper>.div{
    height:2rem; /*slide高度不同，避免出现所有slide高度相同但是有的产品不多导致scroll效果;*/
}
.gallery-thumbs>.swiper-wrapper>.div-active{
    height:auto;
}
.gallery-thumbs>.swiper-wrapper>.div .Preferred{
    height:10rem;
}
.gallery-thumbs>.swiper-wrapper>.div-active .Preferred{
    height:auto;
}
.gallery-thumbs .CategoryDataList {
    padding: 0 .1rem;
    font-size: 0;
    .swiper-slide{
        float: left;
        width: 3.45rem;
        margin: 0 .1rem .2rem;
        box-sizing: border-box;
        background-color: #fff;
        a{
            display: block;
            img{
                height: 3.5rem;
                max-height: 100%;
            }
            .ptitle {
                margin-top: .1rem;
                font-size: 13px;
            }
            .price{
                padding: 0 .2rem;
                margin:.1rem 0;
                font-size: 13px;
                color: #ff9c00;
                overflow: hidden;
                span{
                    float: right;
                    color: #929292;
                }
            }
        }
    }
}
.CategoryDataList .noorder{
    margin-bottom: 6rem;
}
.div.swiper-no-swiping{
	width: 1.875rem;
}
.optimization-categorylist-productlist{
    display:-webkit-box;
    display: flex;
}
.optimization-categorylist-productitem{
    width: 2.85rem;
    height: 100%;
    position: relative;
}
</style>
