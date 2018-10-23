import apiport from './api'
import qs from 'qs'
import http from './http.js'

function SetDocument (code, sucfun) {
  let model = {
    code: code
  }
  http({
    url: apiport.DocumentBase_GetByCode,
    method: 'post',
    data: qs.stringify({ reqJson: JSON.stringify(model) })
  }).then((res) => {
    console.log('获取图文资料', res)
    if (typeof sucfun === 'function') {
      sucfun(res.data)
    }
  }).catch((error) => {
    console.log(error)
  })
}

export default {
  SetDocument: SetDocument
}
