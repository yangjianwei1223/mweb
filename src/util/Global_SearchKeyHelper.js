import apiport from './api'
import qs from 'qs'
import http from './http.js'
// import storage from './storage'

let GlobalSearchKeyHelper = {
  debounce: (func, delay) => {
    let timer
    return (...args) => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  },
  getRealSearch: (query) => {
    return new Promise((resolve, reject) => {
      let model = {
        keyword: query,
        hits: 10
      }
      http({
        url: apiport.Search_GetRealTimeProduct,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('实时搜索', res.data)
          if (res.data.ResultNo === '00000000') {
            resolve(res.data.Data)
          }
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },
  settlesearchlist: (name, list) => {
    list.forEach(function (item, index) {
      if (item.SearchKey === name) {
        list.splice(index, 1)
      }
    })
    if (list.length > 19) {
      list.pop()
    }
    list.unshift({SearchKey: name})
    return list
  }
}
export default GlobalSearchKeyHelper
