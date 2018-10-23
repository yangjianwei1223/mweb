<template>
  <div>
    <v-header :headinfo="headinfo" @rightbtn1click="skipchat"></v-header>
    <ul class="mycomment">
      <li v-for="(item, index) in goodsList" :key="index">
        <router-link :to='{path: item.OrderType==="Seat" ? "/Seat/Detail/" + item.ProductSaleId : "/Optimization/Detail/" + item.ProductSaleId}' class="productinfo">
          <div class="left">
            <img :src="item.GoodsImgPath + '@!standard_square_s'">
          </div>
          <div class="middle">
            <h2 class="twolinetext">{{item.GoodsTitle}}</h2>
            <h3>{{item.GoodsPropertyName}}</h3>
          </div>
          <div class="right">
            <h4>￥<span>{{item.GoodsPrice}}</span></h4>
            <h5>×<span>{{item.GoodsQuantity}}</span></h5>
          </div>
        </router-link>
        <section class="userinput">
          <div class="outer">
            <textarea placeholder="亲，宝贝满足您的期待吗？说说您的使用心得，分享给想买的他们吧" max-length="500" v-model="uploadimgdata[index].textarea"></textarea>
          </div>
          <imgupload :uploadimg='uploadimgdata[index]' @passimgid="receiveimgid"></imgupload>
        </section>
      </li>
    </ul>
    <div class="confirmcomment" @click="releaseComment">确认发布</div>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
import imgupload from '@/components/common/imgupload'

export default {
  name: 'comment',
  components: {
    vHeader: head,
    imgupload
  },
  data () {
    return {
      headinfo: {title: '评价', rightbtntext1: '&#xe67a;'},
      goodsList: [],
      uploadimgdata: []
    }
  },
  mounted () {
    let model = {
      Token: this.$store.state.UserToken,
      OrderBaseId: this.$route.params.id
    }
    this.$http({
      url: apiport.Order_GetGoodsBaseByOrderId,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        if (res.data.ResultNo === '00000000') {
          console.log('评价商品信息', res.data)
          this.goodsList = res.data.GoodsList
          for (let j = 0; j < res.data.GoodsList.length; j++) {
            this.uploadimgdata.push({max: 3, imglist: [], textarea: '', productBaseId: res.data.GoodsList[j].ProductBaseId})
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    skipchat () {
      this.$router.push({path: '/wechat/im'})
    },
    receiveimgid (imgid) {
      console.log(imgid)
    },
    // 发布评论
    releaseComment () {
      let commentList = []
      let notextarea = true
      for (let i = 0; i < this.uploadimgdata.length; i++) {
        let imgStr = ''
        this.uploadimgdata[i].imglist.forEach(function (item) {
          imgStr += item.productBaseId + ','
        })
        commentList.push({InfomationId: this.uploadimgdata[i].productBaseId, Content: this.uploadimgdata[i].textarea, ImageIdListStr: imgStr})
        if (this.uploadimgdata[i].textarea !== '') {
          notextarea = false
        }
      }
      if (notextarea) {
        alert('还没填写评论内容哦')
        return true
      }
      let model = {
        InfomationType: 1,
        Token: this.$store.state.UserToken,
        OrderBaseId: this.$route.params.id,
        commentList: commentList
      }
      this.$http({
        url: apiport.Order_GetGoodsBaseByOrderId,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          if (res.data.ResultNo === '00000000') {
            console.log('评价结果', res.data)
            this.goodsList = res.data.GoodsList
            alert('恭喜您评论成功！可在我的订单中查看评论')
            this.$router.back()
          } else {
            alert('评价失败了')
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.mycomment{
  padding-top: 1rem;
  li{
    margin-bottom: .2rem;
  }
  .productinfo{
    display: -webkit-box;
    display: flex;
    background-color: #fff;
    .left{
      width: 19%;
      margin: .2rem .25rem;
      font-size: 0;
      box-sizing: border-box;
    }
    .middle{
      width: 55%;
      box-sizing: border-box;
      h2{
        margin-top: .3rem;
        font-size: 13px;
        color: #333;
        line-height: 1.5;
      }
      h3{
        margin-top: .1rem;
        font-size: 12px;
        color: #666;
      }
    }
    .right{
      width: 19%;
      padding-right: .2rem;
      text-align: right;
      box-sizing: border-box;
      h4{
        margin-top: .3rem;
        font-size: 13px;
        color: #333;
      }
      h5{
        font-size: 11px;
        color: #999;
      }
    }
  }
  .userinput {
    margin-top: .1rem;
    padding-bottom: .3rem;
    background-color: #fff;
    .outer {
      height: 2rem;
      overflow: scroll;
      textarea{
        width: 100%;
        resize: none;
        outline: none;
        border: none;
        padding: 0.25rem 0.35rem;
        box-sizing: border-box;
        height: 2rem;
      }
    }
  }
}
.confirmcomment {
  width: 6.7rem;
  height: .88rem;
  line-height: .88rem;
  margin: .5rem auto;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  background-color: #ff9c00;
  border-radius: 3px;
}
</style>
