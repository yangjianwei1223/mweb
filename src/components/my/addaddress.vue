<template>
  <div>
    <div class="mainpage" v-show="showpagenum === 0">
      <v-header :headinfo="headinfo"></v-header>
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
                  <span class="sil" :data-province="ProvinceId" :data-city="CityId" :data-district="DistrictId" @click="manualgetadd">{{CityName}}</span>
              </div>
              <a href="javascript:;" data-role="none" class="fap iconfont">&#xe637; 定位</a>
          </div>
          <div class="accountline">
              <div class="textarea formwrap">
                  <textarea v-model="FullAddress" maxlength="50" rows="3" placeholder="请填写详细地址"></textarea>
              </div>
          </div>
      </section>
    </div>
    <!-- 省 -->
    <div class="selectaddress" v-show="showpagenum === 1">
      <div class="header fixedtop">
        <div><span onclick="Global_GeoCoderHelper.BackProvincePage('ReleaseContent')" class="iconfont" data-rel="back"></span></div>
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
          <li class="borderbottom">
            <div class="localname" onclick="Global_GeoCoderHelper.ShowCorePage('ReleaseContent',1,'北京市',2)" data-regionid="1">
              <h1>北京市</h1>
            </div>
            <div class="iconfont arrow">&#xe61e;</div>
          </li>
        </ul>
      </section>
    </div>
    <!-- 市 -->
    <div id="CityPageDiv" class="selectaddress" v-show="showpagenum === 2">
      <div class="header fixedtop">
        <div>
          <span onclick="Global_GeoCoderHelper.BackCityPage('ReleaseContent')" class="iconfont" data-rel="back"></span>
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
          <li class="borderbottom">
            <div class="localname" onclick="Global_GeoCoderHelper.ShowCorePage('ReleaseContent',35,'北京市',3)" data-regionid="35">
              <h1>北京市</h1>
            </div>
            <div class="iconfont arrow">&#xe61e;</div>
          </li>
        </ul>
      </section>
    </div>
    <!-- 区 -->
    <div id="DistrictPageDiv" class="selectaddress" v-show="showpagenum === 3">
      <div class="header fixedtop">
        <div><span onclick="Global_GeoCoderHelper.BackDistrictPage('ReleaseContent')" class="iconfont" data-rel="back"></span></div>
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
          <li class="borderbottom">
            <div class="localname" onclick="Global_GeoCoderHelper.ChooseCore('ReleaseContent',406,'东城区')" data-regionid="406">
              <h1>东城区</h1>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
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
      RealName: '',
      Mobile: '',
      ProvinceId: '',
      CityId: '',
      DistrictId: '',
      CityName: '定位失败，请选择',
      FullAddress: '',
      HiTao: false
    }
  },
  mounted: function () {
    this.HiTao = this.$route.query.type === 'Haitao'
    console.log(wx)
  },
  methods: {
    rightbtnfunone () {
      console.log(123)
    },
    manualgetadd () {
      console.log(231231)
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
</style>
