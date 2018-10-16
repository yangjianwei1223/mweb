<template>
  <div class="my">
    <section class="miheader">
      <div class="my-setting clearfix">
        <div id="im-messagelink" class="message iconfont">&#xe67a;</div>
        <router-link class="setting iconfont" to="/My/Setting">&#xe677;</router-link>
      </div>
      <div class="my-info">
        <section class="portrait" id="MyIndexPersonalIn">
          <div class="avatar personal">
            <img id="My_Index_FaceImg" :src="FaceImage" />
            <input id="face_file" type="file" accept="image/*" data-role="none">
          </div>
        </section>
        <div class="baseinfo">
          <router-link v-if="Nickname" class="nickname" id="My_Index_NikeName" to="/My/DataSet"><span class="">{{Nickname}}</span></router-link>
          <router-link v-if="Nickname" class="iconfont" to="/My/Points">&#xe678;<span id="Index_points">{{PointsUsable}}</span>贝壳</router-link>
          <router-link v-else :to='{path:"/Account/Index",query:{redict:"/My/Index"}}' style="color:#fff">去登录</router-link>
        </div>
        <router-link class="gocart" to="/Home/Cart">
          <i class="iconfont newsmention" id="ShoppingCartCount">&#xe67c;</i>
          <span>购物车</span>
        </router-link>
      </div>
    </section>
    <order :listdata="zulinlist"></order>
    <order :listdata="buylist"></order>
    <section class="tag-wrap">
      <div class="tag" v-for="(item,index) in items" :key="index" v-show="item.show">
        <router-link :to="item.href">
          <div class="tag-icon iconfont" :style="{color:item.color}" v-html="item.icon"></div>
          <div class="tag-core">{{item.text}}</div>
          <div class="tag-arrow iconfont"><span v-show="item.count"></span>&#xe61e;</div>
        </router-link>
      </div>
    </section>
    <v-footer :urlRouter="$route.path" />
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import order from './order'
import footer from '../common/footer'
export default {
  name: 'My',
  components: {
    order,
    'v-footer': footer
  },
  data () {
    return {
      zulinlist: {
        text: '我的租赁',
        href: '/My/ZulinBuyIn',
        status: [1, 2, 3, 5, 4],
        count: []
      },
      buylist: {
        text: '我的购买',
        href: '/My/BuyIn',
        status: [1, 2, 3, 5, 4],
        count: []
      },
      items: [
        {icon: '&#xe684;', text: '邀请有礼', count: '', href: '/My/Share', color: '#FFA810', show: true},
        {icon: '&#xe67f;', text: '我的收藏', count: '', href: '/My/Praise', color: '#FF89A8', show: true},
        {icon: '&#xe685;', text: '我的活动', count: '', href: '/LocalLife/MyActivity', color: '#FCD430', show: false},
        {icon: '&#xe680;', text: '我的押金条', count: '', href: '/My/Deposit', color: '#FF5050', show: true},
        {icon: '&#xe681;', text: '我的优惠券', count: '', href: '/My/Coupon', color: '#76ADFF', show: true},
        {icon: '&#xe683;', text: '我的收货地址', count: '', href: '/My/AddressManage', color: '#77D7C4', show: true},
        {icon: '&#xe68d;', text: '关于来呗', count: '', href: '/Home/About', color: '#E0B0FF', show: true}
      ],
      Nickname: '',
      FaceImage: '',
      CommentCount: '',
      ShippedCount: '',
      NotPayCount: '',
      PointsUsable: '',
      RefundedCount: '',
      ZulinCommentCount: '',
      ZulinShippedCount: '',
      ZulinNotPayCount: '',
      ZulinPointsUsable: '',
      ZulinRefundedCount: ''
    }
  },
  mounted: function () {
  // 数据请求
    let model = {
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Account_GetMyIndex,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    }).then((res) => {
      this.Nickname = res.data.Nickname
      this.FaceImage = res.data.FaceImage || 'https://cdn.sys.img.95laibei.com/Content/Images/default-portrait-0419.png'
      this.PointsUsable = res.data.PointsUsable
      this.NotPayCount = res.data.NotPayCount
      this.NoShippedCount = res.data.NoShippedCount
      this.ShippedCount = res.data.ShippedCount
      this.RefundedCount = res.data.RefundedCount
      this.CommentCount = res.data.CommentCount
      this.ZulinPointsUsable = res.data.ZulinPointsUsable
      this.ZulinNotPayCount = res.data.ZulinNotPayCount
      this.ZulinNoShippedCount = res.data.ZulinNoShippedCount
      this.ZulinShippedCount = res.data.ZulinShippedCount
      this.ZulinRefundedCount = res.data.ZulinRefundedCount
      this.ZulinCommentCount = res.data.ZulinCommentCount
      this.zulinlist.count = [this.ZulinNotPayCount, this.ZulinNoShippedCount, this.ZulinShippedCount, this.ZulinCommentCount, this.ZulinRefundedCount]
      this.buylist.count = [this.NotPayCount, this.NoShippedCount, this.ShippedCount, this.CommentCount, this.RefundedCount]
    }).catch((error) => {
      console.log(2)
      console.log(error)
    })
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.miheader {
  position: relative;
  height: 3.1rem;
  color: #fff;
  /* autoprefixer: off */
  background: -webkit-linear-gradient(top,#ffda2a,#f6763f);
  /* autoprefixer: on */
  .message{
    position:relative;
    float:right;
    margin:.3rem .2rem 0 0;
    font-size:18px;
    &.newsmention:after{
      background-color: #E62327;
      color: #fff;
      border-radius: 50%;
      vertical-align: middle;
      width: 25px;
      height: 25px;
      position: absolute;
      right: -12px;
      top: -9px;
      transform: scale(0.3);
    }
  }
  .setting{
    float:right;
    margin:.25rem .4rem 0 0;
    font-size:20px;
    color:#fff;
  }
  .my-info{
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: .65rem;
    .portrait{
      text-align: left;
      margin-left: .2rem;
    }
    .baseinfo{
      flex: 3;
      margin-left:.3rem;
    }
    .gocart{
      flex: 1;
      color: #A55C01;
      background: #FDD43F;
      font-size: 12px;
      padding: 5px 0 5px 10px;
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
      .iconfont{
        font-size: 15px;
        position:relative;
        &::before{
          content: attr(data-msg);
          position: absolute;
          top: -7px;
          right: -10px;
          width: 15px;
          font-size: 10px;
          color: #E62327;
          border-radius:50%;
          font-weight: 600;
          text-align: center;
          background: url(https://cdn.sys.img.95laibei.com/Content/Images/redcircle.png) no-repeat center;
          background-size: contain;
          letter-spacing: -1px;
        }
      }
    }
    .gocart span{
      margin-left: .16rem;
    }
  }
  .nickname{
    display: block;
    color: #fff;
    font-size:15px;
  }
  .baseinfo{
     a.iconfont{
      display: inline-block;
      margin-top: .2rem;
      font-size: 13px;
      color: #fff;
      position:relative;
      &:after{
        content: "";
        position: absolute;
        top: 3px;
        right: -14px;
        width: 0;
        height: 0;
        border-width: 5px 0 5px 5px;
        border-style: solid;
        border-color: transparent transparent transparent #fff;
      }
      span{
        margin-left: .1rem;
      }
     }
  }
  .avatar{
    font-size:0;
    position:relative;
    img{
      display:inline-block;
      width:1.15rem;
      height:1.15rem;
      border:2px solid #fdd09b;
      border-radius:50%;
    }
    input{
      position: absolute;
      top: 0;
      right: 0;
      width: 3rem;
      height: 1.1rem;
      opacity: .01;
    }
  }
}

.tag-wrap{
    width: 100%;
    box-sizing: border-box;
    margin: .2rem 0 1.4rem;
    background-color: #fff;
    box-shadow:0 1px 1px #ebebec,0 -1px 1px #ebebec;
    .tag{
      height:.88rem;
      padding-left:.2rem;
      display:-webkit-box;
      .tag-icon{
        width: .5rem;
        margin-right: .2rem;
        font-size: .34rem;
        margin-left: .1rem;
      }
      &>a{
        width:100%;
        display:-webkit-box;
        color:#3e3a39;
        border-bottom:1px solid #ededed;
        &>div{
          -webkit-box-pack:start;
          -webkit-box-align:center;
          display:-webkit-box;
        }
      }
    }
    .tag-title{
      -webkit-box-pack:start;
      width:1rem;
      margin-right:.3rem;
      font-weight:500;
      color:#3e3a39;
    }
    .tag-core{
      -webkit-box-flex: 1;
      line-height:.4rem;
      font-size: 13px;
      color: #666;
    }
    .tag-arrow{
      padding-right:.2rem;
      line-height:.1rem;
      font-size:13px;
      color:#333;
    }
}
</style>
