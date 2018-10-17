import qs from 'qs'
import apiport from './api'
import http from './http.js'

let orderDetail = {
  DeleteOrder: function (id) {
    let model = {
      OrderBaseId: id,
      Token: this.$store.state.UserToken
    }
    this.$http({
      url: apiport.Order_DeteleBase,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('删除订单', res.data)
        let data = res.data
        if (data.ResultNo === '00000000') {
          alert('删除成功')
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 验证邀请码是否有效
  CheckPromotionCode: function (code) {
    return new Promise((resolve, reject) => {
      if (String(code).indexOf('M') > -1) {
        resolve(1)
      } else {
        let model = {
          code: code
        }
        http({
          url: apiport.Account_CheckPromotionCode,
          method: 'post',
          data: qs.stringify({ reqJson: JSON.stringify(model) })
        })
          .then(res => {
            console.log('验证邀请码', res.data)
            let data = res.data
            if (data.ResultNo === '00000000') {
              resolve(data.Data)
            } else {
              reject(new Error('邀请码错误'))
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    })
  }
}
export default orderDetail
