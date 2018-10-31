import toastsComponent from './toast.vue'
const toast = {
  install: function (Vue) {
    Vue.component('toasts', toastsComponent)
  }
}
export default toast
