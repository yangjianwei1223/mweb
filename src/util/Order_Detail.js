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
  },
  // 获取物流信息
  getExpressData: function (orderid, token) {
    return new Promise((resolve, reject) => {
      let model = {
        OrderBaseId: orderid,
        Token: token
      }
      http({
        url: apiport.Common_GetExpressByOrderId,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          console.log('物流信息', res.data)
          if (res.data.ResultNo === '00000000') {
            resolve(res.data)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 公用去付款
  gopay: function (orderid, token) {
    let model = {
      Token: token,
      SubOrderList: orderid,
      DiscountCouponList: ''
    }
    http({
      url: apiport.Order_AddOrderParent,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        if (res.data.ResultNo === '00000000') {
          this.PageToGoodsPay(res.data.Data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  // 取消订单
  cancleOrdel (orderid, token, sucFun) {
    let r = confirm('是否确定关闭交易')
    if (r) {
      let model = {
        Token: token,
        OrderBaseId: orderid
      }
      http({
        url: apiport.Order_CancelBase,
        method: 'post',
        data: qs.stringify({ reqJson: JSON.stringify(model) })
      })
        .then(res => {
          if (res.data.ResultNo === '00000000') {
            alert('操作成功')
            if (typeof (sucFun) === 'function') {
              sucFun()
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  // 确认收货
  confirmExpress (id, type, money, goodsList, token, sucFun) {
    let IsCanConfirmExpress = true
    for (let i = 0; i < goodsList.length; i++) {
      if (goodsList[i].Status === 2 || goodsList[i].Status === 3 || goodsList[i].Status === 4) {
        IsCanConfirmExpress = false
        break
      }
    }
    if (!IsCanConfirmExpress) {
      alert('当前订单中有退租中商品<br/>退租结束才能确认收货')
    } else {
      let r = confirm(type === 5 ? '确认收货' : '确认收货后' + money + '元将打给卖家')
      if (r) {
        let model = {
          Token: token,
          OrderBaseId: id
        }
        http({
          url: apiport.Order_ConfirmExpress,
          method: 'post',
          data: qs.stringify({ reqJson: JSON.stringify(model) })
        })
          .then(res => {
            if (res.data.ResultNo === '00000000') {
              alert('操作成功')
              if (typeof (sucFun) === 'function') {
                sucFun()
              }
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  },
  // 撤销退款申请
  CancelRefund (id, token, sucFun) {
    let model = {
      Token: token,
      OrderGoodsId: id
    }
    this.$http({
      url: apiport.Order_CancelRefund,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('撤销申请', res.data)
        if (typeof (sucFun) === 'function') {
          sucFun()
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}
export default orderDetail
