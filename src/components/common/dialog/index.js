import AlertComponent from './alert/alert.vue'// 引入先前写好的vue
import ConfirmComponent from './confirm/confirm.vue'
import ToastComponent from './toast/toast.vue'
import PromptComponent from './prompt/prompt.vue'

const Dialog = {}
let showDialog = {
  alert: false,
  confirm: false,
  toast: false,
  prompt: false
}

// 注册Toast
Dialog.install = function (Vue) {
  // 生成一个Vue的子类
  const AlertConstructor = Vue.extend(AlertComponent)
  // 生成一个该子类的实例
  const alertinstance = new AlertConstructor()

  const ConfirmConstructor = Vue.extend(ConfirmComponent)
  const confirminstance = new ConfirmConstructor()
  const ToastConstructor = Vue.extend(ToastComponent)
  const toastinstance = new ToastConstructor()
  const PromptContructor = Vue.extend(PromptComponent)
  const promptinstance = new PromptContructor()
  // 通过Vue的原型注册一个方法
  // 让所有实例共享这个方法 <br>    // 其中的duration是持续时间
  Vue.prototype.$alert = (title, sucFun) => {
    if (!showDialog.alert) {
      showDialog.alert = true
      // 将这个实例挂载在我创建的div上
      // 并将此div加入全局挂载点内部
      alertinstance.$mount(document.createElement('div'))
      document.getElementById('app').appendChild(alertinstance.$el)
    }
    alertinstance.title = title || '来呗'
    alertinstance.show = true
    alertinstance.successFun = sucFun || null
  }
  Vue.prototype.$confirm = (title, sucFun, cancelFun) => {
    if (!showDialog.confirm) {
      showDialog.confirm = true
      confirminstance.$mount(document.createElement('div'))
      document.getElementById('app').appendChild(confirminstance.$el)
    }
    confirminstance.title = title || '来呗'
    confirminstance.show = true
    confirminstance.successFun = sucFun || null
    confirminstance.cancelFun = cancelFun || null
  }
  Vue.prototype.$toast = (title, timer) => {
    if (!showDialog.toast) {
      showDialog.toast = true
      toastinstance.$mount(document.createElement('div'))
      document.getElementById('app').appendChild(toastinstance.$el)
    }
    toastinstance.title = title || '来呗'
    toastinstance.show = true
    setTimeout(() => {
      toastinstance.show = false
    }, timer || 2000)
  }
  Vue.prototype.$prompt = (title, sucFun, cancelFun, placeholder) => {
    if (!showDialog.prompt) {
      showDialog.prompt = true
      promptinstance.$mount(document.createElement('div'))
      document.getElementById('app').appendChild(promptinstance.$el)
    }
    promptinstance.title = title || '来呗'
    promptinstance.placeholder = placeholder || ''
    promptinstance.promptval = ''
    promptinstance.show = true
    promptinstance.successFun = sucFun || null
    promptinstance.cancelFun = cancelFun || null
  }
}

export default Dialog
