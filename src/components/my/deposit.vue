<template>
  <div class="deposit">
    <v-header :headinfo="headinfo"></v-header>
    <section class="zu_deposit" v-for="(item, index) in deposits" :key="index">
      <div class="top">
        <span class="left">¥ <span class="bigfont">{{(item.PayMoney+0.001).toString().split('.')[0]}}</span> .{{(item.PayMoney+0.001).toString().split('.')[1].slice(0,2)}}元</span>
      </div>
      <div class="ref">订单编号：{{item.OrderCode}}</div>
      <div class="item">
        <router-link :to='"http://v2mp.95laibei.com/Order/ZulinDetail/" + item.CashPledgeId'>
          <div class="left">
            <img :src='item.ImgPath + "@!standard_square_m"'>
          </div>
          <div class="center">
            <p class="twolinetext">{{item.Title}}</p>
            <p class="style">{{item.PropertyValue}}</p>
            <p class="price">¥{{item.GoodsPrice}}</p>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'

export default {
  name: 'deposit',
  components: {
    vHeader: head
  },
  data () {
    return {
      headinfo: {title: '我的押金条'},
      deposits: []
    }
  },
  mounted: function () {
    let model = {
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Order_GetCashPledgeList,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('我的押金条', res.data)
        this.deposits = res.data.Data
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.deposit{
  padding-top: 1rem;
}
.zu_deposit{
  position: relative;
  margin: .2rem;
  background-color: #fff;
  .top{
    padding: .3rem .2rem;
    border-bottom: 1px solid #dcdddd;
    .left{
      color:@base-ycolor3;
      .bigfont{
        font-size: 26px;
        font-weight: 700;
      }
    }
  }
  .ref{
    padding: .2rem 0 .2rem .2rem;
    font-size: 14px;
  }
  .item{
    a{
      display: flex;
      padding: .2rem 0;
      .left{
        width: 1.6rem;
        margin-left: .2rem;
        margin-right: .2rem;
        font-size: 0;
      }
      .center{
        flex: 1;
        font-size: 12px;
        padding-right: .2rem;
        p:first-child{
          height: .6rem;
          line-height: .3rem;
        }
        .style{
          line-height: .3rem;
          min-height: .6rem;
          color:#9fa0a0;
        }
        .price{
          font-size: 16px;
          line-height: .4rem;
        }
      }
    }
  }
  &:after{
    content: "";
    display: block;
    width: 100%;
    height: 6px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAMCAIAAAAReyFmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxQTQyRDE1NjFBRUZFNTExOTc0NEM1OERDNjU1N0VDRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3NDA3M0U1Q0M2ODQxMUU2QjQwQkM4NEYwRENFMTcxMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NDA3M0U1QkM2ODQxMUU2QjQwQkM4NEYwRENFMTcxMSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3ZmRmNDhmOS1lNWRiLWY1NDgtYjI2My0wZWUxNTczMTM5ZTAiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjYThlMTUwNi1jNWI0LTExZTYtYTBmMy1lZjVkMTlhNWRjMTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Yr3qrAAAAmklEQVR42rSS2wrEIAxEN7rog///p4p436GUtghNDWXzqDPHMQmNMT5/qC9z11rrvROR2uotFz9IKeWcAT0OwTXGWGvxzAqXpj4gYwjhSrwW6M45rfUjV01Q7/0dFIUrCCATcBEcSR/HuCg7uTFGJumUGuIlLqQY1Pq4p6necksp0g3lLTu31irl8hZ1bIKUy1vO/kq5vOUnwAAFdXObS/Y0WwAAAABJRU5ErkJggg==) repeat-x;
    background-size: 15px 6px;
  }
}
</style>
