<template>
  <div>
    <v-header :headinfo="headinfo"  @rightbtn1click="skipchat"></v-header>
    <seatfouricon></seatfouricon>
    <ul class="zulintype">
      <li>
        <router-link to='/Zulin/SeatList/long'>
          <img src="https://cdn.sys.img.95laibei.com/Content/Images/zulin-type2-1009.png" alt="">
        </router-link>
      </li>
      <li>
        <router-link to='/Zulin/SeatList/short'>
          <img src="https://cdn.sys.img.95laibei.com/Content/Images/zulin-type1-1009.png" alt="">
        </router-link>
      </li>
      <li>
        <router-link to='/Activitys/Lottery/zfbzl-2'>
          <img src="https://cdn.sys.img.95laibei.com/Content/Images/zulin-type1-1009.png" alt="">
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import head from '@/components/common/header'
import seatfouricon from '@/components/common/seatfouricon'

export default {
  name: 'zulin',
  components: {
    'vHeader': head,
    seatfouricon
  },
  data () {
    return {
      headinfo: {'title': '座椅租赁', rightbtntext1: '&#xe67a;'}
    }
  },
  methods: {
    skipchat () {
      this.$router.push('/wechat/im')
    }
  }
}
</script>

<style lang="less" scoped>
.zulintype{
  a{
    display: block;
    font-size: 0;
  }
}
</style>
