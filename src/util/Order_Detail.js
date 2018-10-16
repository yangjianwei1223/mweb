import qs from 'qs'
import apiport from 'api'

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
  }
}
export default orderDetail
