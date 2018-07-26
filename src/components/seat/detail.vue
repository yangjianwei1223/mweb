<template>
  <div class="seatdetail">
    <header class="header">
      <div><a class="iconfont back" @click="back">&#xe651;</a></div>
      <div>{{title}}</div>
      <div>
      </div>
    </header>
    <swiper :swiperdata="swiper"></swiper>
    <div class="sdtitle">
      <span class="buylimit">包邮</span>
      <div class="title">{{goodstitle}}</div>
      <div class="tip twolinetext">{{goodsdesc}}</div>
      <i class="iconfont showmore toclose">&#xe609;</i>
    </div>
    <div class="seatprice">
      <p class="pay">￥<span>{{Price}}</span></p>
      <p class="sales">销量：{{Sales}}</p>
    </div>
    <section class="sdpromise">
      <p class="line">
        <span class="pitem"><i class="iconfont textcolorr">&#xe606;</i> 全新正品</span>
        <span class="pitem"><i class="iconfont textcolorr">&#xe606;</i> 假一赔十</span>
        <span class="pitem"><i class="iconfont textcolorr">&#xe606;</i> 正规授权</span>
        <span class="pitem"><i class="iconfont textcolorr">&#xe606;</i> 3c认证</span>
        <i class="iconfont">&#xe61e;</i>
      </p>
    </section>
    <section class="fhnotice" v-if="AdvertisingRemark">
      <h3 class="textcolorr"><span class="iconfont">&#xe66b;  </span><span>消息通知</span></h3>
      <p class="thirdtext">{{AdvertisingRemark}}</p>
    </section>
    <div class="tw">
      <h5 class="specialefth88">
          <span class="tips">图文详情</span>
      </h5>
      <div class="wrap">
        <div v-html="DetailContent"></div>
        <img  src="https://cdn.sys.img.95laibei.com/Content/Images/aftersales-update-180307.jpg">
      </div>
    </div>
    <div class="headimg">
      <span>更多精选商品</span>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import swiper from '../common/swiper'
export default {
  name: 'seatdetail',
  components: {
    swiper
  },
  data () {
    return {
      SaleType: 0,
      swiper: [],
      goodstitle: '',
      goodsdesc: '',
      Price: 0,
      Sales: 0,
      AdvertisingRemark: '',
      DetailContent: ''
    }
  },
  methods: {
    back () {
      this.$router.back()
    }
  },
  computed: {
    title: function () {
      if (this.SaleType === 1) {
        return '座椅购买'
      }
      return '座椅租赁'
    }
  },
  mounted: function () {
    // 首页数据请求
    let model1 = {
      ProductBaseId: this.$route.params.id,
      GetCount: 8,
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Product_GetZLDetailById,
      method: 'post',
      // header:{
      //   "Content-Type":'application/x-www-form-urlencoded;charset=UTF-8'
      // },
      data: qs.stringify({ reqJson: JSON.stringify(model1) })
    }).then((res) => {
      console.log(1)
      console.log(res)
      this.swiper = JSON.parse(JSON.stringify(res.data.ImgList).replace(/Path/g, 'Img'))
      this.SaleType = res.data.SaleType
      this.goodstitle = res.data.Title
      this.goodsdesc = res.data.ProductContent
      this.Price = res.data.Price
      this.Sales = res.data.Sales
      this.AdvertisingRemark = res.data.AdvertisingRemark
      this.DetailContent = res.data.DetailContent
    }).catch((error) => {
      console.log(2)
      console.log(error)
    })
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
  }
  .back{
    font-size: 22px;
  }
}
.seatdetail{
  /deep/ .swiper{
    margin-top: 1rem;
    .swiper-container{
      height: 7.5rem;
      background-color: #fff;
      .swiper-slide a{
        display: flex;
        max-width: 100%;
        height: 7.5rem;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        img{
          height:auto;
          max-width: 7.5rem;
          max-height: 7.5rem;
        }
      }
    }
  }
}
.sdtitle{
  padding: .2rem;
  background-color: #fff;
  .buylimit{
    padding: 1px 5px;
    vertical-align: middle;
    font-size: 10px;
    color: #ff9c00;
    border: 1px solid #ff9c00;
    border-radius: 3px;
  }
  .title{
    display: inline;
    font-size: 16px;
    color: #3e3a39;
    line-height: 22px;
  }
  .tip{
    color: #9fa0a0;
    font-size: 14px;
    margin-top: .2rem;
    word-wrap: break-word;
  }
  .showmore{
    display: block;
    text-align: center;
    font-size: 16px;
    line-height: 1;
  }
}
.seatprice{
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 0 .2rem .2rem;
  background-color: #fff;
  .pay{
    font-size: 13px;
    line-height: 1;
    color: @base-ycolor3;
    span{
      font-size: 18px;
      font-weight: 600;
    }
  }
  .sales{
    font-size: 10px;
    color: #929292;
  }
}
.sdpromise .line{
  color: #9fa0a0;
  font-size: 12px;
  line-height: .74rem;
  padding-left: .2rem;
  .pitem{
    display: inline-block;
    margin-right: .1rem;
    .iconfont{
      font-size: 16px;
      vertical-align: middle;
      color: @base-ycolor3;
    }
  }
  .iconfont{
    float: right;
    margin-right: .2rem;
  }
}
.fhnotice{
  margin-bottom: .2rem;
  padding: 4px .2rem .2rem;
  background-color: #fff;
  border: 1px solid #efeff0;
  h3{
    line-height: 30px;
    font-size: 14px;
    color: @base-ycolor3;
  }
  p{
    font-size: 12px;
    line-height: 20px;
    color: #9fa0a0;
  }
}
.tw{
  background-color: #fff;
  word-wrap: break-word;
  font-size: 16px;
  .specialefth88{
    line-height: .88rem;
    padding-left: .2rem;
    position: relative;
    border-bottom: 1px solid #E5E5E5;
    .tips{
      margin-left: .24rem;
      font-size: 15px;
    }
    &:before{
      content: "";
      position: absolute;
      top: .29rem;
      left: .2rem;
      width: 2px;
      height: .3rem;
      background-color: #E62327;
    }
  }
}
.headimg{
  width: 70%;
  margin: 0 15% .2rem;
  color: #999;
  font-size: 12px;
  &::before{
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #dedddd;
    top: .4rem;
  }
}
</style>
