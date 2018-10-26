<template>
  <div>
    支付宝支付中，请稍等
  </div>
</template>
<script>
/* eslint-disable */
import qs from 'qs'
import apiport from '../../util/api'
export default {
  name: 'alipayreturn',
  data () {
    return {
    }
  },
  mounted: function () {
console.log(this.$route.query)
console.log(window.location)
console.log(window.location.search)
    console.log(JSON.stringify(this.$route.query))
    this.$http({
      url:apiport.Alipay_Return+window.location.search,
      method: 'post'
     // data: this.$route.query
    })
      .then(res => {
         var data=res.data;
         var ToUrl = "";
            if (data.Payresult == "success")
            {
                if (data.type == 0)
                {
                    ToUrl = "/My/Points";
                }
                else if (data.type == 1)
                {
                    ToUrl = "/Pay/GoodsPay?id="+ data.relationId + "&paydetailId="+ data.payDetailId;
                }
            }
            else
            {
                if (data.type == 0)
                {
                    ToUrl = "/Pay/Recharge";
                }
                else
                {
                    ToUrl = "/My";
                }
            }
            this.$router.push(ToUrl)
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  }
}

</script>