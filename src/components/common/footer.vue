<template>
    <div class="footer">
        <router-link :to="{name:'index'}" class="home" :class="{active:urlRouter == '/index' || urlRouter == '/'}">
            <div class="pic iconfont"></div>
            <p>首页</p>
        </router-link>
        <router-link :to="{name:'beiquan'}" class="quan" :class="{active:urlRouter == '/Beiquan/List'}">
            <div class="pic iconfont"></div>
            <p>呗圈</p>
        </router-link>
        <router-link :to="{name:'about',query: {isback: 1}}" class="service" :class="{active:urlRouter == '/My/About'}">
            <div class="pic iconfont"></div>
            <p>客服中心</p>
        </router-link>
        <router-link :to="{name:'my'}" class="my" :class="{active:urlRouter == '/My'}">
            <div class="pic iconfont"></div>
            <p>我的</p>
        </router-link>
    </div>
</template>

<script>
export default {
  props: ['urlRouter']
}
</script>

<style lang="less">
@import '../../assets/less/variable.less';
    .footer{
        position:fixed;
        bottom:0;
        left:0;
        width:100%;
        background-color:#fff;
        display:flex;
        z-index: 50;
        a{
            display:block;
            flex:1;
            font-size:@base-ftsize;
            color:@base-color1;
            text-align: center;
            p{
                margin-bottom: 4px;
            }
        }
        .active{
            color:@base-ycolor;
        }
        .pic{
            padding-top: 7px;
            font-size: 20px;
            text-align: center;
        }
        .home.active .pic:after{
            content:'\e6a0';
        }
        .quan.active .pic:after{
            content:'\e69c';
        }
        .service.active .pic:after{
            content:'\e69d';
        }
        .my.active .pic:after{
            content:'\e69e';
        }
        .home .pic:after{
            content:'\e69b';
        }
        .quan .pic:after{
            content:'\e6a2';
        }
        .service .pic:after{
            content:'\e6a3';
        }
        .my .pic:after{
            content:'\e69f';
        }
    }
</style>
