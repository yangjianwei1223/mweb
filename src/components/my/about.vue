<template>
  <div class="about">
    <header class="header">
      <div></div>
      <div id="headerTitle">帮助</div>
      <div>
          <a href="javascript:;" class="iconfont">&#xe67a;</a>
      </div>
    </header>
    <section class="helptop">
      <div class="ms">
        <img src="https://cdn.sys.img.95laibei.com/Optimization/Images/lbxms.png" alt="">
      </div>
      <h3>有什么疑问，我来帮你解答</h3>
      <p>Hi,我是客服,识产品,懂baby,做你的贴心小棉袄!</p>
    </section>
    <section class="tag-wrap">
      <div id="assistant_10127" data-assistant-name="lailai" class="tag kefu">
        <a onclick="Global_CommonHelper.BindChatEvent(10127, '客服来来', 0)">
          <div class="tag-core borderbottom">
            <img class="statusImg" src="https://cdn.sys.img.95laibei.com/Content/Images/lailai_online.png">
            <div>
              客服来来<br><span class="statusTxt" style="font-size:14px;color:#9fa0a0;">在线</span>
            </div>
          </div>
          <div class="tag-arrow borderbottom iconfont">&#xe61e;</div>
        </a>
      </div>
      <div class="tag kefu"><a href="tel:400-685-9595"><div class="tag-core borderbottom"><img src="https://cdn.sys.img.95laibei.com/Content/Images/hotline.png">安全座椅服务热线</div><div class="tag-arrow borderbottom iconfont"><span>400-685-9595</span>&#xe61e;</div></a></div>
    </section>
    <v-footer :urlRouter="$route.path" />
  </div>
</template>

<script>
import footer from '../common/footer'

export default {
  name: 'about',
  data () {
    return {
      asdf: 'sf'
    }
  },
  components: {
    'v-footer': footer
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/variable";
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 22;
  background: @base-ycolor;
  display: -webkit-box;
  height: 1rem;
  line-height: 0.8rem;
  text-align: center;
  & > div {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    display: -webkit-box;
    display: -moz-box;
    font-size: 18px;
    color: #000;
  }
  & > div:first-child {
    text-align: left;
    margin-left: 0.2rem;
    -moz-box-pack: start;
    -webkit-box-pack: start;
    min-width: 20%;
  }
  & > div:last-child {
    text-align: right;
    margin-right: 0.2rem;
    -webkit-box-pack: end;
    min-width: 20%;
    font-size: 16px;
    .iconfont{
      font-size: 20px;
    }
  }
}
.helptop{
    position:relative;
    margin-top: 1rem;
    padding:.4rem 0 .2rem 1.4rem;
    background-color:@base-ycolor3;
    overflow:hidden;
    color:#fff;
    .ms{
      position:absolute;
      font-size:0;
      bottom:0;
      left:.2rem;
      width:1rem;
      max-width:50px;
    }
    p{
      font-size:12px;
      line-height:20px;
    }
    h3{
      font-size: 16px;
    }
}
.tag-wrap{
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow:0 1px 1px transparent,0 -1px 1px #ebebec;
    .tag{
      height:1.4rem;
      padding-left:.2rem;
      display:-webkit-box;
      &:not(:last-child){
        border-bottom: 1px solid #ededed;
      }
      a{
        width: 100%;
        display: -webkit-box;
        color: @base-color;
        .tag-core{
          display: -webkit-box;
          -webkit-box-pack: start;
          -webkit-box-align: center;
          -webkit-box-flex: 1;
          line-height: .4rem;
          font-size: @base-ftsize1;
          color: @base-color1;
          img{
            width: 1rem;
            vertical-align: middle;
            margin-right: .2rem;
          }
        }
        .tag-arrow{
          display: -webkit-box;
          -webkit-box-pack: start;
          -webkit-box-align: center;
          padding-right: .2rem;
          line-height: .1rem;
          font-size: @base-ftsize1;
          color: @base-color3;
          &.iconfont span{
            margin-right: .1rem;
          }
        }
      }
    }
}
</style>
