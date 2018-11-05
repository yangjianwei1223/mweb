<template>
  <div>
    <v-header :headinfo="headinfo"></v-header>
    <section class="bindset">
      <div class="content">
          <div class="iconfont">&#xe64b;</div>
          <p>微信<br><span v-show="IsWxBind">关联</span></p>
          <a href="javascript:;" class="bindbtn" @click="bindFun">{{text}}</a>
      </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable */
import qs from 'qs'
import apiport from '../../util/api'
import head from '@/components/common/header'
import weiXinHelper from "../../util/Global_WeiXinHelper";
import apicloudHelper from "../../util/Global_ApicloudHelper";
import baseInfoHelper from "../../util/Global_BaseInfoHelper";

export default {
  name: 'bindset',
  components: {
    'vHeader': head
  },
  data () {
    return {
      headinfo: {title: '关联设置'},
      IsWxBind: false
    }
  },
  computed: {
    text: function () {
      if (this.IsWxBind) {
        return '解除关联'
      } else {
        return '立即关联'
      }
    }
  },
  mounted: function () {
    let model = {
      Token: baseInfoHelper.GetToken()
    }
    this.$http({
      url: apiport.Account_GetBindInfo,
      method: 'post',
      data: qs.stringify({ reqJson: JSON.stringify(model) })
    })
      .then(res => {
        console.log('绑定信息', res.data)
        this.IsWxBind = res.data.IsWxBind
      })
      .catch(error => {
        console.log(2)
        console.log(error)
      })
  },
  methods: {
    bindFun: function () {
      // 解除绑定
      if (this.IsWxBind) {
        let model = {
          Token:  baseInfoHelper.GetToken(),
          Type: 1
        }
        this.$http({
          url: apiport.Account_RemoveBindingConnect,
          method: 'post',
          data: qs.stringify({ reqJson: JSON.stringify(model) })
        })
          .then(res => {
            console.log('解除绑定信息', res.data)
            this.IsWxBind = false
          })
          .catch(error => {
            console.log(2)
            console.log(error)
          })
      } else {
        // 绑定
               var url = apiport.CurrentDomain + "/WeChat/Authorize?state=wxlogin";
                if (weiXinHelper.IsWXBrowser()) {
                    window.location.href = url;
                }
                else if (apicloudHelper.IsApp()) {
                    apicloudHelper.WX_getToken(SucCallBack);
                    function SucCallBack(ret) {
                          let model={
                              Type:1,
                              UnionId:'',
                              OpenId: ret.openId,
                              access_token:ret.accessToken,
                              NickName:'',
                              Sex:'',
                              Headimgurl:'',
                              Token: baseInfoHelper.GetToken()
                            }
                            this.$http({
                                  url: apiport.Account_BindingConnect,
                                  method: "post",
                                  header: {
                                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                                  },
                                  data: qs.stringify({ reqJson: JSON.stringify(model) })
                                })
                                .then(res => {
                                    var data=res.data;
                                      if (typeof (data.ResultNo) != "undefined" && data.ResultNo == "00000000") {
                                         this.IsWxBind =true;
                                          alert('关联微信成功')
                                      }
                                      else if (typeof (data) != "undefined" && data.ResultRemark != null) {
                                         alert(data.ResultRemark)
                                      }
                                      else {
                                        alert('操作失败')
                                      }
                              });
                       /* var data = GetBindsetData.Binding('1', '', ret.openId, '', '', '', TokenObj.Token, ret.accessToken);
                        if (typeof (data.ResultNo) != "undefined" && data.ResultNo == "00000000") {
                            $("#wx_span").html("关联");
                            $("#wx_bind").html("解除关联");
                            $("#wx_bind").attr("data-IsWxBind", 'true');
                            Global_PopupHelper.dialogautoclose({
                                'title': '关联微信成功',
                                'timer': '2000',//毫秒
                                'type': '1'
                            });
                        }
                        else if (typeof (data) != "undefined" && data.ResultRemark != null) {
                              alert(data.ResultRemark)
                        }
                        else {
                           alert('操作失败')
                        }*/
                    }
                }
                else{
                   alert('微信关联请在app内或者微信内')
                }
    
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.bindset{
  margin: .4rem 0;
  box-shadow: 0 1px 1px #ebebec, 0 -1px 1px #ebebec;
  padding-top:1rem;
  .content{
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: .2rem;
    .iconfont{
      color: #03a200;
      font-size: 40px;
      margin-right: 10px;
      border-radius: 50%;
    }
    p{
      flex: 1;
      font-size: 13px;
      span{
        font-size: @base-ftsize;
        color: #9fa0a0;
      }
    }
    a{
      float: right;
      border: 1px solid @base-ycolor;
      border-radius: 4px;
      padding: 4px 6px;
      color: @base-ycolor;
      font-size: 13px;
    }
  }
}
</style>
