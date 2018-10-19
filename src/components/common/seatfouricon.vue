<template>
  <div>
    <div class="seat-sum">
      <router-link to="/Zulin/RentKnowledge" class="piclink">
        <img src="https://cdn.sys.img.95laibei.com/Content/Images/zuindex-101.png" class="pic" alt="租赁须知">
      </router-link>
      <router-link to="/Zulin/ServiceAssurance" class="piclink">
        <img src="https://cdn.sys.img.95laibei.com/Content/Images/zuindex-102.png" class="pic" alt="服务保障">
      </router-link>
      <router-link to="/Activitys/SeatInstallVideo" class="piclink">
        <img src="https://cdn.sys.img.95laibei.com/Content/Images/zuindex-103.png" class="pic" alt="安装视频">
      </router-link>
      <router-link to="/Zulin/FreeInstall" class="piclink">
        <img src="https://cdn.sys.img.95laibei.com/Content/Images/zuindex-104.png" class="pic" alt="全国门店">
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'seatfouricon'
}
</script>

<style lang="less" scoped>
.seat-sum{
    display:flex;
    overflow:hidden;
    border-left: 1px solid #fff;
    border-right: 1px solid #fff;
    margin: 1rem auto .2rem;
    .piclink{
      flex:1;
      font-size: 0;
    }
}
</style>
