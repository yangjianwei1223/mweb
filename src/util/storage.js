const STORAGE_USER_KEY = 'UserToken'

export default {
  // 获取
  getLocal (key = STORAGE_USER_KEY) {
    // console.log('get local operation')
    return JSON.parse(window.localStorage.getItem(key))
  },
  // 设置用
  setLocal (res, key = STORAGE_USER_KEY, isSaveOldData = false) {
    // 第三个参数是true的话,会增加数据而不是重新设置,res必须是数组
    if (isSaveOldData) {
      if (this.getLocal(key)) {
        let oldData = this.getLocal(key)
        return window.localStorage.setItem(key, JSON.stringify(oldData.concat(res)))
      }
    }
    return window.localStorage.setItem(key, JSON.stringify(res))
  },
  setUserTokenToStorage (data, expTime) {
    let expTime1 = new Date()
    expTime1.setHours(new Date().getHours() + expTime)
    let storagedata = {ExpTime: expTime1, ObjectData: data}
    return window.localStorage.setItem('UserToken', JSON.stringify(storagedata))
  },
  // 获取
  getSession (key = STORAGE_USER_KEY) {
    // console.log('get local operation')
    return JSON.parse(window.sessionStorage.getItem(key))
  },
  // 设置用
  setSession (res, key = STORAGE_USER_KEY, isSaveOldData = false) {
    // 第三个参数是true的话,会增加数据而不是重新设置,res必须是数组
    if (isSaveOldData) {
      if (this.getLocal(key)) {
        let oldData = this.getLocal(key)
        return window.sessionStorage.setItem(key, JSON.stringify(oldData.concat(res)))
      }
    }
    return window.sessionStorage.setItem(key, JSON.stringify(res))
  }
}
