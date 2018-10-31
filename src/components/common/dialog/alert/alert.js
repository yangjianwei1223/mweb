import alertsComponent from './alert.vue'
const alerts = {
  install: function (Vue) {
    Vue.component('alerts', alertsComponent)
  }
}
export default alerts
