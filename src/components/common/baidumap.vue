<template>
  <div id="ShowBaiduMap">
    <p style="text-align:center;margin-top:2rem;">地图加载中...</p>
  </div>
</template>

<script>
export default {
  name: 'baidumap',
  props: ['poi'],
  data () {
    return {
      position: [120.263028, 30.245315, '九五来呗儿童安全座椅']
    }
  },
  computed: {
    jd: function () {
      return this.position[0]
    },
    wd: function () {
      return this.position[1]
    },
    tips: function () {
      return this.position[2]
    }
  },
  methods: {
    getBaiDuApi (currentpoi) {
      this.position = currentpoi
      if (typeof (BMap) === 'undefined') {
        let script = document.createElement('script')
        script.src = 'https://api.map.baidu.com/api?v=2.0&ak=sSRyjDOVLB9A7m5N3A6YXPLCimgIi3zv&services=&s=1&callback=ShowBaiduMap'
        document.body.appendChild(script)
      } else {
        this.queryLocation()
      }
    },
    queryLocation () {
      /* eslint-disable */
      let map = new BMap.Map('ShowBaiduMap')// 创建Map实例
      console.log('经纬度', this.jd, this.wd)
      let point = new BMap.Point(this.jd, this.wd)
      let marker = new BMap.Marker(point)
      map.addOverlay(marker)
      let label = new BMap.Label(this.tips, {
        offset: new BMap.Size(-50, -35)
      })
      /* eslint-disable */
      label.setStyle({
        border: 'none',
        background: 'none'
      })
      label.setContent('<div class="detailAddress">' + this.tips + '</div>')
      marker.setLabel(label)// 把label设置到maker上
      map.centerAndZoom(point, 15)// 初始化地图,设置中心点坐标和地图级别
    }
  },
  mounted: function () {
    console.log(this.poi[0])
    window['ShowBaiduMap'] = () => {
      this.queryLocation()
    }
  }
}
</script>

<style lang="less" scoped>
#ShowBaiduMap{
  width: 100%;
  height: 100%;
  /deep/ .detailAddress{
    height: 30px;
    border: 1px solid #c4c7cc;
    font-size: 13px;
    background-color: #FFF;
    padding-left: 14px;
    padding-right: 7px;
    line-height: 30px;
    cursor: pointer;
    border: 1px solid rgba(51,51,51,.2);
    box-shadow: 2px 2px 2px 0 rgba(0,0,0,.2);
    border-top: 0;
    border-left: 0;
  }
  /deep/ img{
    width: auto;
  }
}
</style>
