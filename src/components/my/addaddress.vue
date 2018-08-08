<template>
  <div>
    <div class="mainpage" v-show="showpagenum === 0">
      <v-header :headinfo="headinfo" @rightbtn1click="confirmadd"></v-header>
      <section class="accountbox">
          <div class="accountline">
              <div class="formwrap">
                  <span>收货人</span>
                  <input type="text" maxlength="20" v-model="RealName" value="" placeholder="请输入收货人">
              </div>
          </div>
          <div class="accountline">
              <div class="formwrap">
                  <span>手机号</span>
                  <input type="tel" v-model="Mobile" maxlength="11" value="" placeholder="请输入手机号">
              </div>
          </div>
          <div class="accountline" v-if="HiTao">
              <div class="formwrap">
                  <span>身份证号</span>
                  <input type="text" maxlength="18" value="" placeholder="请输入身份证号" />
              <p class="fscolor">海关政策要求，进口商品收货人必须提供真实姓名和身份证信息，加密保存，仅用于清关。</p>
              </div>
          </div>
          <div class="accountline">
              <div class="formwrap padr">
                  <span>省市区</span>
                  <span class="sil" :data-province="ProvinceId" :data-city="CityId" :data-district="DistrictId" @click="manualgetadd(0)">{{FullAddress}}</span>
              </div>
              <a href="javascript:;" @click="getPosition" class="fap iconfont">&#xe637; 定位</a>
          </div>
          <div class="accountline">
              <div class="textarea formwrap">
                  <textarea v-model="StreetAdd" maxlength="50" rows="3" placeholder="请填写详细地址"></textarea>
              </div>
          </div>
      </section>
    </div>
    <!-- 省 -->
    <div class="selectaddress" v-show="showpagenum === 1">
      <div class="header1">
        <div><span onclick="Global_GeoCoderHelper.BackProvincePage('ReleaseContent')" class="iconfont">&#xe651;</span></div>
        <div>所在地</div>
        <div></div>
      </div>
      <section class="selectadd toheader">
        <div class="title">您的位置</div>
        <ul onclick="Global_GeoCoderHelper.BaiDuAddressClick('ReleaseContent')">
            <li class="address BaiDuAddress">定位失败，请选择</li>
        </ul>
      </section>
      <section class="selectadd">
        <div class="title">切换城市</div>
        <ul id="ProvinceSelectUl">
          <li class="borderbottom" v-for="(item, index) in Provincelist" :key="index">
            <div class="localname" @click="manualgetadd(item.RegionId,item.RegionName)" :data-regionid="item.regionid">
              <h1>{{item.RegionName}}</h1>
            </div>
            <div class="iconfont arrow">&#xe61e;</div>
          </li>
        </ul>
      </section>
    </div>
    <!-- 市 -->
    <div id="CityPageDiv" class="selectaddress" v-show="showpagenum === 2">
      <div class="header1">
        <div>
          <span onclick="Global_GeoCoderHelper.BackCityPage('ReleaseContent')" class="iconfont" data-rel="back">&#xe651;</span>
        </div>
        <div>所在地</div>
        <div></div>
      </div>
      <section class="selectadd toheader">
        <div class="title">您的位置</div>
        <ul onclick="Global_GeoCoderHelper.BaiDuAddressClick('ReleaseContent')">
          <li class="address BaiDuAddress">定位失败，请选择</li>
        </ul>
      </section>
      <section class="selectadd">
        <div class="title">切换城市</div>
        <ul id="CitySelectUl">
          <li class="borderbottom" v-for="(item, index) in Citylist" :key="index">
            <div class="localname" @click="manualgetadd(item.RegionId,item.RegionName)" :data-regionid="item.regionid">
              <h1>{{item.RegionName}}</h1>
            </div>
            <div class="iconfont arrow">&#xe61e;</div>
          </li>
        </ul>
      </section>
    </div>
    <!-- 区 -->
    <div id="DistrictPageDiv" class="selectaddress" v-show="showpagenum === 3">
      <div class="header1">
        <div><span onclick="Global_GeoCoderHelper.BackDistrictPage('ReleaseContent')" class="iconfont" data-rel="back">&#xe651;</span></div>
        <div>所在地</div>
        <div></div>
      </div>
      <section class="selectadd toheader">
        <div class="title">您的位置</div>
        <ul onclick="Global_GeoCoderHelper.BaiDuAddressClick('ReleaseContent')">
          <li class="address BaiDuAddress">定位失败，请选择</li>
        </ul>
      </section>
      <section class="selectadd">
        <div class="title">切换城市</div>
        <ul id="DistrictSelectUl">
          <li class="borderbottom" v-for="(item, index) in Districtlist" :key="index">
            <div class="localname" @click="choosedistrict(item.RegionId,item.RegionName)" :data-regionid="item.regionid">
              <h1>{{item.RegionName}}</h1>
            </div>
            <div class="iconfont arrow">&#xe61e;</div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import apiport from '../../util/api'
import wx from 'weixin-js-sdk'

import head from '@/components/common/header'
export default {
  name: 'addaddress',
  components: {
    'vHeader': head
  },
  data () {
    return {
      showpagenum: 0,
      headinfo: {title: '添加地址', rightbtntext1: '确定'},
      ConsigneeId: 0,
      RealName: '',
      Mobile: '',
      ProvinceId: '',
      CityId: '',
      DistrictId: '',
      ProvinceName: '',
      CityName: '',
      DistrictName: '',
      FullAddress: '定位失败，请选择',
      StreetAdd: '',
      IsDefault: false,
      OrderNo: 1,
      Phone: '',
      Postcode: '',
      HiTao: false,
      Provincelist: [],
      Citylist: [],
      Districtlist: []
    }
  },
  mounted: function () {
    this.HiTao = this.$route.query.type === 'Haitao'
    if (this.$route.params.id) {
      this.headinfo.title = '修改地址'
      this.getAddressData(this.$route.params.id)
    } else {
      this.getPosition()
    }
    this.weixinconfig()
    console.log(wx)
  },
  methods: {
    // 确定按钮新增地址修改地址
    confirmadd () {
      if (!this.RealName && !this.Mobile && !this.FullAddress && !this.ProvinceId && !this.CityId && !this.DistrictId) {
        return
      }
      let model = {
        ConsigneeId: this.ConsigneeId,
        IsDefault: this.IsDefault,
        OrderNo: this.OrderNo,
        RealName: this.RealName,
        Mobile: this.Mobile,
        Phone: this.Phone,
        FullAddress: this.StreetAdd,
        ProvinceId: this.ProvinceId,
        CityId: this.CityId,
        DistrictId: this.DistrictId,
        Postcode: this.Postcode,
        IdentityCard: this.IdentityCard,
        Token: this.$store.state.UserToken
      }
      this.$http({
        url: apiport.Account_AddConsignee,
        method: 'post',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('地址新增成功或者修改成功', res.data)
          this.$router.go(-1)
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    // 修改地址获取地址信息
    getAddressData (id) {
      let model = {
        ConsigneeId: id
      }
      this.$http({
        url: apiport.Account_GetConsigneeById,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('收货地址信息', res.data)
          let data = res.data
          this.ConsigneeId = data.ConsigneeId
          this.RealName = data.RealName
          this.Mobile = data.Mobile
          this.ProvinceId = data.ProvinceId
          this.CityId = data.CityId
          this.DistrictId = data.DistrictId
          this.StreetAdd = data.FullAddress
          this.IdentityCard = data.IdentityCard
          this.IsDefault = data.IsDefault
          this.OrderNo = data.OrderNo
          this.Phone = data.Phone
          this.Postcode = data.Postcode
          this.FullAddress = data.CityName
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    // 手动选择省市区
    manualgetadd (i, name) {
      if (this.showpagenum === 0) {
        this.showpagenum++
        this.getaddresslist(i)
      } else if (this.showpagenum === 1) {
        this.showpagenum++
        this.ProvinceName = name
        this.getaddresslist(i)
      } else {
        this.showpagenum++
        this.CityName = name
        this.getaddresslist(i)
      }
    },
    getaddresslist (id) {
      let _that = this
      id === undefined && (id = 0)
      let model = {
        ParentId: id
      }
      this.$http({
        url: apiport.Common_GetCoreRegionByParentId,
        method: 'post',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('城市列表', res.data)
          if (this.showpagenum === 1) {
            _that.Provincelist = res.data.Data
          } else if (this.showpagenum === 2) {
            _that.Citylist = res.data.Data
          } else {
            _that.Districtlist = res.data.Data
          }
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    choosedistrict (i, name) {
      this.showpagenum = 0
      this.DistrictName = name
      this.FullAddress = this.ProvinceName + this.CityName + this.DistrictName
    },
    weixinconfig () {
      let model = {
        url: location.href.split('#')[0]
      }
      this.$http({
        url: apiport.WeiXin_GetJsApiConfig,
        method: 'post',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('获取微信jsskd参数', res.data)
          let data = res.data
          if (data.ResultNo === '00000000') {
            wx.config({
              debug: false,
              appId: data.appId,
              timestamp: data.timestamp,
              nonceStr: data.nonceStr,
              signature: data.signature,
              jsApiList: ['onMenuShareAppMessage',
                'onMenuShareTimeline',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'getLocation'
              ]
            })
          }
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
    },
    // 根据内核判断是通过微信还是浏览器获取经纬度
    getPosition () {
      // eslint-disable-next-line
      if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
        this.wxgetPoisiton(this.DisplayAddress)
      } else {
        this.browsergetposition(this.DisplayAddress, this.DisplayError)
      }
    },
    // 浏览器返回用户位置
    browsergetposition (sucFun, errFun) {
      console.log('浏览器获取位置')
      let result = {}
      if (navigator.geolocation) {
        let positionOption = {
          // 指示浏览器获取高精度的位置，默认为false
          enableHighAccuracy: true,
          // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
          timeout: 6000,
          // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
          maximumAge: 5000
        }
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, positionOption)
      } else {
        result.code = -1
        errFun(result)
      }
      function geoSuccess (position) {
        result.code = 0
        result.lat = position.coords.latitude
        result.lon = position.coords.longitude
        sucFun(result)
      }
      function geoError (error) {
        result.code = 1
        result.error = error
        errFun(result)
      }
    },
    // 微信获取用户位置
    wxgetPoisiton (successCallBack) {
      console.log(2424324234)
      wx.ready(function () {
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            var result = {
            }
            result.lat = res.latitude // 纬度，浮点数，范围为90 ~ -90
            result.lon = res.longitude // 经度，浮点数，范围为180 ~ -180。
            if (typeof successCallBack === 'function') successCallBack(result)
          }
        })
      })
    },
    // 获取到经纬度后的成功回调
    DisplayAddress (result) {
      let lat = result.lat
      let lng = result.lon
      this.GetGeoCoderAPI(lat, lng)
    },
    // 获取到经纬度后的失败回调
    DisplayError (result) {
      console.log('获取经纬度失败了')
    },
    // 根据经纬度返回省市区中文
    GetGeoCoderAPI (lat, lng) {
      let model = {
        lat: lat,
        lng: lng
      }
      this.$http({
        url: apiport.Common_GetGeoCoder,
        method: 'post',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('省市区', res.data)
          this.ProvinceId = String(res.data.ProvinceID)
          this.CityId = String(res.data.CityID)
          this.DistrictId = String(res.data.DistrictID)
          this.FullAddress = res.data.ProvinceName + res.data.CityName + res.data.DistrictName
        })
        .catch(error => {
          console.log(2)
          console.log(error)
        })
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
    .formwrap{
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
      .fscolor{
        font-size: 12px;
        color: #ff4965;
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
// 省市区头部
.header1{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 22;
  background-color: #f1bc19;
  height: 1rem;
  line-height: .8rem;
  text-align: center;
  display: -webkit-box;
  div{
    -webkit-box-pack: center;
    -webkit-box-align: center;
    -webkit-box-flex: 1;
    display: -webkit-box;
    font-size: 18px;
    color: #000;
  }
  div:first-child{
    text-align: left;
    margin-left: .2rem;
    -moz-box-pack: start;
    -webkit-box-pack: start;
    min-width: 20%;
    span{
      display: block;
      width: 40px;
      font-size: 24px;
      color: #000;
    }
  }
  div:last-child{
    min-width: 20%;
  }
}
.selectadd{
  &.toheader{
    margin-top:1rem;
  }
  .title{
    color: #9fa0a0;
    height: .8rem;
    line-height: .8rem;
    margin-top: .3rem;
    padding-left: .2rem;
  }
  ul li{
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    position: relative;
    background-color: #fff;
    width: 100%;
    height: .86rem;
    line-height: .86rem;
    padding-left: .2rem;
    box-sizing: border-box;
    border-bottom: 1px solid #ededed;
    .localname{
      -webkit-box-pack: center;
      -webkit-box-align: center;
      display: -webkit-box;
      flex: 1;
      h1{
        width:100%;
      }
    }
    .arrow{
      padding-right: .4rem;
      line-height: .8rem;
    }
  }
}
</style>
