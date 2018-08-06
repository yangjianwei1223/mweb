<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="accountbox">
        <div class="accountline">
            <p class="borderbottom paddingleftp">
                <span>收货人</span>
                <input type="text" maxlength="20" v-model="RealName" value="" placeholder="请输入收货人">
            </p>
        </div>
        <div class="accountline">
            <p class="borderbottom paddingleftp">
                <span>手机号</span>
                <input type="tel" v-model="Mobile" maxlength="11" value="" placeholder="请输入手机号">
            </p>
        </div>
        <div class="accountline">
            <p class="borderbottom paddingleftp padr">
                <span>省市区</span>
                <span class="sil" :data-province="ProvinceId" :data-city="CityId" :data-district="DistrictId">{{CityName}}</span>
            </p>
            <a href="javascript:;" data-role="none" class="fap iconfont">&#xe637; 定位</a>
        </div>
        <div class="accountline">
            <p class="textarea">
                <textarea v-model="FullAddress" maxlength="50" rows="3" placeholder="请填写详细地址"></textarea>
            </p>
        </div>
    </section>
  </div>
</template>

<script>
import head from '@/components/common/header'
export default {
  name: 'addaddress',
  components: {
    'vHeader': head
  },
  data () {
    return {
      headinfo: {title: '添加地址', rightbtntext1: '确定'},
      RealName: '',
      Mobile: '',
      ProvinceId: '',
      CityId: '',
      DistrictId: '',
      CityName: '定位失败，请选择',
      FullAddress: ''
    }
  },
  methods: {
    rightbtnfunone () {
      console.log(123)
    }
  }
}
</script>

<style lang="less" scoped>
.accountbox {
  margin-top:1.4rem;
  background-color: #fff;
  .accountline{
    position: relative;
    padding-left: .2rem;
    p{
      position: relative;
      overflow: hidden;
      padding-left: 80px;
      border-bottom: 1px solid #ededed;
      span{
        position: absolute;
        left: 0;
        top: 0;
        line-height: 1rem;
        font-size: 13px;
      }
      input{
        -webkit-appearance: none;
        outline: none;
        border: none;
        line-height: .5rem;
        padding: .25rem 0;
        width: 100%;
        color: #3e3a39;
      }
      .sil{
        font-size: 14px;
        line-height: 1rem;
        padding-left: 80px;
        width: 52%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      textarea{
        -webkit-appearance: none;
        width: 100%;
        padding: .2rem .2rem .2rem 0;
        outline: none;
        border: none;
        height: 3.6rem;
        box-sizing: border-box;
        resize: none;
        -webkit-overflow-scrolling: touch;
      }
    }
    .textarea{
      padding-left: 0;
    }
    .padr{
      height: 1rem;
      padding-right: 1.5rem;
    }
    .fap{
      width: auto;
      position: absolute;
      top: 0;
      right: .2rem;
      font-size: 14px;
      color: #f1bc19;
      float: left;
      line-height: 1rem;
      margin-right: .2rem;
    }
  }
}
</style>
