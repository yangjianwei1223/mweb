<template>
  <div>
    微信授权中中，请稍等
  </div>
</template>
<script>
/* eslint-disable */ 
import qs from 'qs'
import apiport from '../../util/api'
export default {
  name: 'wxAuthorize',
  data () {
    return {
    }
  },
  mounted: function () {
    let model={
          state:this.$route.query.state,
          scope:"snsapi_userinfo"
        }
        this.$http({
              url: apiport.APIDomain+ "/MWeb/WeiXin/GetOauthUrlWithScope",
              method: "post",
              header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
              },
              data: qs.stringify({ reqJson: JSON.stringify(model) })
            })
              .then(res => {
                var data=res.data;
                console.log(JSON.stringify(data));
                window.location.href=data.OauthUrl
              });
  }
}

</script>