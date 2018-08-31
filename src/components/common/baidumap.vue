<template>
  <div id="ShowBaiduMap">
    <p style="text-align:center;margin-top:10px;">地图加载中...</p>
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
      return this.poi[0]
    },
    wd: function () {
      return this.poi[1]
    },
    tips: function () {
      return this.poi[2]
    }
  },
  methods: {
    getBaiDuApi () {
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
}
</style>
