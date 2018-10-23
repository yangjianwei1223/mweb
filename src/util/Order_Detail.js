import qs from 'qs'
import apiport from './api'
import http from './http.js'
// import router from '../router'
import BaseInfoHelper from './Global_BaseInfoHelper'
import globalWeiXinHelper from '@/util/Global_WeiXinHelper'

let orderDetail = {
  DeleteOrder: function (id, sucFun) {
    let model = {
      OrderBaseId: id,
      Token: BaseInfoHelper.GetToken()
    }
    http({
      url: apiport.Order_DeteleBase,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('删除订单', res.data)
        let data = res.data
        if (data.ResultNo === '00000000') {
          alert('删除成功')
          if (typeof (sucFun) === 'function') {
            sucFun(id)
          }
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
  },
  RemindDelivery: function (id) {
    let model = {
      OrderBaseId: id,
      Token: BaseInfoHelper.GetToken()
    }
    http({
      url: apiport.Order_ReminderDelivery,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('提醒发货', res.data)
        let data = res.data
        if (data.ResultNo === '00000000') {
          alert('提醒发货成功')
        } else {
          alert('提醒失败')
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  PageToGoodsPay: function (orderid) {
    if (globalWeiXinHelper.IsWXBrowser) {
      let openId = globalWeiXinHelper.GetOpenId()
      if (openId === null) {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7ff0669994ee3210&redirect_uri=https%3a%2f%2ft-mweb.95laibei.com%2fpay%2fWxCode&response_type=code&scope=snsapi_userinfo&state=GoodsPay|' + orderid + '#wechat_redirect'
      } else {
        window.location.href = '/Pay/GoodsPay?id=' + orderid
      }
    } else {
      window.location.href = '/Pay/GoodsPay?id=' + orderid
    }
  }
}
export default orderDetail
