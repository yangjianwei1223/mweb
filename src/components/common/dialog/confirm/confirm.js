import confirmsComponent from './confirm.vue'
const confirm = {
  install: function (Vue) {
    Vue.component('confirms', confirmsComponent)
  }
}
export default confirm
