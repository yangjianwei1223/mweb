<template>
  <div class="quandetail">
    <header class="header">
      <div>
        <a class="iconfont back" href="javascript:;" @click="back">&#xe651;</a>
      </div>
      <div>呗圈详情页</div>
      <div>
          <a id="im-messagelink" class="iconfont message newsmention" data-msg="3">&#xe67a;</a>
      </div>
    </header>
    <div class="beiquan-detail">
      <section class="bqhead">
          <h1 class="title twolinetext">{{detaildata.Title}}</h1>
          <h4 class="time">{{detaildata.CreateTime}}</h4>
      </section>
      <section class="maincontent" v-html="detaildata.Content"></section>
      <section class="bqfooter" v-if="showzan">
          <div class="zanicon" @click="changezannum" :class={already:detaildata.IsCurrentUserPraise}></div>
          <div class="moveup" v-show="detaildata.IsCurrentUserPraise"><i class="iconfont"></i></div>
          <p class="people">已有<span id="praiseCount">{{detaildata.PraiseCount}}</span>人点赞</p>
      </section>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
export default {
  name: 'Detail',
  data () {
    return {
      detaildata: {},
      showzan: false
    }
  },
  methods: {
    changezannum () {
      var _that = this
      let model = {
        Token: '5061b637-a63e-4665-b448-b1b5bfeb4447',
        ArticleId: this.$route.params.id
      }
      this.$http({
        url: apiport.BeiQuan_BasePraise,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          if (_that.detaildata.IsCurrentUserPraise) {
            _that.detaildata.PraiseCount = res.PraiseCount
            _that.detaildata.IsCurrentUserPraise = false
          } else {
            _that.detaildata.PraiseCount = res.PraiseCount
            _that.detaildata.IsCurrentUserPraise = true
          }
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    back () {
      this.$router.back()
    }
  },
  mounted: function () {
    let model = {
      Token: '5061b637-a63e-4665-b448-b1b5bfeb4447',
      ArticleId: this.$route.params.id
    }
    this.$http({
      url: apiport.BeiQuan_GetNewDetail,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log(1)
        // console.log(res);
        this.detaildata = res.data
        this.showzan = true
        console.log(this.detaildata)
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
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
    .back{
      display: block;
      width: 40px;
      font-size: 24px;
      color: #000;
    }
  }
  & > div:last-child {
    text-align: right;
    margin-right: 0.2rem;
    -webkit-box-pack: end;
    min-width: 20%;
    font-size: 16px;
    .message{
      display: block;
      width: 36%;
      font-size: 20px;
      color: #000;
    }
  }
}
.beiquan-detail{
  position:absolute;
  top:1rem;
  bottom:0;
  left:0;
  right:0;
  background:#fff;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding:0 .2rem;
  .bqhead{
    padding:.3rem 0;
    .title{
      font-size: 20px;
      color: @base-color;
    }
    .time{
      font-size: @base-ftsize3;
      color: @base-color2;
      margin-top: .2rem;
    }
  }
  .maincontent{
    font-size: @base-ftsize4;
  }
  .bqfooter{
    position: relative;
    padding-bottom: .7rem;
    padding-top: .5rem;
    text-align: center;
    .zanicon{
      width: 1.6rem;
      height: 1.6rem;
      margin: 0 auto;
      background: url(https://cdn.sys.img.95laibei.com/Content/Images/beiquan-article-detail.jpg) -1.6rem 0 no-repeat;
      background-size: 3.2rem 1.6rem;
      &.already{
        background-position: 0 0;
      }
    }
    .moveup{
      position: absolute;
      top: .8rem;
      left: 45%;
      animation: fadeOutUpBig 1s 0s 1 both;
      .iconfont{
        font-size: 40px;
        color: #e55e13;
      }
    }
    .people{
      margin-top: .4rem;
      padding: 4px 15px;
      color: #e25412;
      border: 1px solid #fe513d;
      display: inline-block;
      border-radius: 4px;
      font-size: @base-ftsize4;
      line-height: 1.3;
    }
  }
}
@keyframes fadeOutUpBig{
    0% {
      opacity: 1;
      font-size: 40px;
    }

    100% {
        opacity: 0;
        top: 2rem;
        font-size: 20px;
    }
}
</style>
