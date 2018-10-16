const STORAGE_USER_KEY = 'UserToken'
// 根据key获取页面缓存内容
function GetStorageDataByKey (key) {
  let StorageData = null
  let res = JSON.parse(window.localStorage.getItem(key))
  if (res !== null && res !== undefined) {
    // 判断是否过期
    let nowtime = new Date()
    let expTime = new Date(res.ExpTime)
    if (nowtime < expTime || res.ExpTime === null) {
      StorageData = res.ObjectData
    }
  }
  return StorageData
}
// 将数据存储在本地缓存中指定的 key 中
function SetDataToStorage (key, data, ExpTime, ExpType) {
  let dataCurrent = new Date()
  if (ExpType === 'Minutes') {
    dataCurrent.setMinutes(dataCurrent.getMinutes() + ExpTime)
  } else {
    dataCurrent.setHours(dataCurrent.getHours() + ExpTime)
  }
  window.localStorage.setItem(key, JSON.stringify({ExpTime: dataCurrent, Date: data}))
}
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
    let storagedata = {ExpTime: expTime1, ObjectData: JSON.stringify(data)}
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
  },
  GetStorageDataByKey: GetStorageDataByKey,
  SetDataToStorage: SetDataToStorage
}
