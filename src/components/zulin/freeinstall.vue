<template>
  <div>
    <div v-show="show">
      <v-header :headinfo='headinfo'></v-header>
      <div class="imagesLayout toheader" id="FreeInstallContent">
        <div class="image-text">
          <img src="https://cdn.product.img.95laibei.com/180426145204084145.jpg@!standard_src_src">
          <img src="https://cdn.product.img.95laibei.com/180426144436161852.jpg@!standard_src_src">
        </div>
        <div class="nationshoplist">
          <div class="item" v-for="(item, index) in shoplist" :key="index">
            <div class="left">
              <h3>{{item.title}}</h3>
              <p>{{item.address}}</p>
            </div>
            <div class="right" @click="callMap(item.poi)">
              <i class="iconfont">&#xe61a;</i>
              <span>地图</span>
            </div>
          </div>
        </div>
      </div>
      <go-top></go-top>
    </div>
    <div v-show="!show">
      <v-header :headinfo='headinfo1'></v-header>
      <baidumap class="bdmapwrap" :poi="poi" ref="bdmap"></baidumap>
    </div>
  </div>
</template>

<script>
import head from '@/components/common/header'
import goTop from '@/components/common/scrolltop'
import baidumap from '../common/baidumap'
export default {
  name: 'seatinstallvideo',
  components: {
    vHeader: head,
    goTop: goTop,
    baidumap: baidumap
  },
  data () {
    return {
      headinfo: {title: '全国门店', rightbtntext1: '<img src="https://cdn.sys.img.95laibei.com/Content/Images/ShareQRCode-0517v2.png">'},
      headinfo1: {title: '地址详情'},
      show: 1,
      poi: [120.263028, 30.245315, '九五来呗儿童安全座椅'],
      shoplist: [{
        'title': '安徽省·合肥市',
        'address': '安徽省合肥市新高区江西路拓基城市广场金座C座1809-1811',
        'poi': '117.212676,31.86081,拓基城市广场金座C座1809-1811'
      }, {
        'title': '安徽省·亳州市',
        'address': '安徽省亳州市香港步行街72号',
        'poi': '115.790874,33.859075,亳州市香港步行街72号'
      }, {
        'title': '安徽省·安庆市',
        'address': '安庆市宜秀区英德利汽配城三期2S店2栋1室',
        'poi': '117.069432,30.575625,英德利汽配城三期2S店2栋1室'
      }, {
        'title': '安徽省·蚌埠市',
        'address': '安徽省蚌埠市禹会区友谊路1079号',
        'poi': '117.32586,32.919409,友谊路1079号'
      }, {
        'title': '河南省·郑州市',
        'address': '河南省郑州市金水区金水路英协路盛润白宫东塔1903号',
        'poi': '113.727281,34.767496,盛润白宫东塔1903号'
      }, {
        'title': '河南省·洛阳市',
        'address': '洛阳市瀛洲路开元大道交叉口，顺驰驾校',
        'poi': '112.413736,34.606676,顺驰驾校'
      }, {
        'title': '河南省·信阳市',
        'address': '信阳市中山南路联通营业厅对面',
        'poi': '114.091075,32.11375,中山南路联通营业厅对面'
      }, {
        'title': '宁夏自治区·银川市',
        'address': '银川市兴庆区解放西街盛世春天商场三楼B02号',
        'poi': '106.275695,38.473805,解放西街盛世春天商场三楼B02号'
      }, {
        'title': '宁夏自治区·银川市',
        'address': '银川市金凤区悦海新天地北京华联商厦三楼28B',
        'poi': '106.252709,38.500192,新天地北京华联商厦三楼28B'
      }, {
        'title': '山东省·青岛市',
        'address': '青岛胶州宝龙城市广场A座',
        'poi': '120.033941,36.277622,宝龙城市广场A座'
      }, {
        'title': '福建省·泉州市',
        'address': '办公地址：泉州市丰泽区东海大街格联通街1号2楼 ',
        'poi': '118.659249,24.874815,东海大街格联通街1号2楼'
      }, {
        'title': '福建省·泉州市',
        'address': '门店：泉州市丰泽区东海大街新华都东海湾生活广场3楼',
        'poi': '118.660674,24.876948,新华都东海湾生活广场3楼'
      }, {
        'title': '辽宁省·葫芦岛市',
        'address': '辽宁省葫芦岛市龙港区富尔沃财富街B131',
        'poi': '120.85927,40.729607,龙港区富尔沃财富街B131'
      }, {
        'title': '广东省·深圳市',
        'address': '广东省深圳市宝安区石岩大道12号金色雅苑1615',
        'poi': '113.946416,22.678917,石岩大道12号金色雅苑1615'
      }, {
        'title': '天津市',
        'address': '天津和平区大沽北路津塔公寓2单元806',
        'poi': '117.208,39.1353,大沽北路津塔公寓2单元806'
      }, {
        'title': '云南省·昆明市',
        'address': '云南省昆明市五华区东风西路顺城西塔1302室',
        'poi': '102.7137,25.042723,东风西路顺城西塔1302室'
      }, {
        'title': '山西省·长治市',
        'address': '山西省长治市紫金东街388号东山国际大厦B座12楼1209室',
        'poi': '113.14948,36.197991,东山国际大厦B座12楼1209室'
      }]
    }
  },
  mounted: function () {
    console.log(123123123)
  },
  methods: {
    callMap (poi) {
      this.show = 0
      console.log(this.poi, poi)
      this.poi = poi.split(',')
      this.$refs.bdmap.getBaiDuApi()
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../assets/less/variable';
.image-text{
  padding-top: 1rem;
  img{
    display: block;
  }
}
.nationshoplist{
  background-color: #F2F2F2;
  padding: 32px .2rem;
  .item{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 7.1rem;
    background-color: #fff;
    box-sizing: border-box;
    margin-bottom: 10px;
    padding: 10px 0 10px 10px;
    border: 1px solid #CCC;
    border-radius: 8px;
    .left{
      border-right: 1px solid #CCC;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      min-height: 60px;
      h3{
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      p{
        font-size: 13px;
      }
    }
    .right{
      display: flex;
      align-items: center;
      flex-direction: column;
      width: 80px;
      font-size: 13px;
      color: #CCC;
      .iconfont{
        font-size: 28px;
        line-height: 1;
      }
    }
  }
}
.bdmapwrap{
  position: absolute;
  top:1rem;
  bottom:0;
  left: 0;
  right: 0;
}
</style>
