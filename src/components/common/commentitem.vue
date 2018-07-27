<template>
  <ul class="commentlist">
    <li v-for="(item, index) in commentlist" :key="index" class="commentitem">
      <h4>
        <img :src="item.FaceImage" alt="">
        <span>{{item.NickName}}</span>
      </h4>
      <h5>{{item.CreateTime}}</h5>
      <p class="cdetail newheight">{{item.Content}}</p>
      <div class="cimg-list swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(img, index1) in item.CommentImages" :key="index1">
            <img :src='img.Path + "@!standard_rectangle_m"'>
          </div>
        </div>
      </div>
      <div class="reply" v-if="item.ReplyContent">
        <span>客服回复：</span>{{item.ReplyContent}}
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'commentitem',
  props: ['commentlist']
}
</script>

<style lang="less" scoped>
.commentitem{
  padding: .2rem;
  border-bottom: 1px solid #f2f2f2;
  h4{
    font-size: 14px;
    margin-bottom: .2rem;
    img{
      width: .8rem;
      height: .8rem;
      border-radius: 50%;
      vertical-align: text-bottom;
      margin-right: 5px;
    }
    span{
      display: inline-block;
      line-height: .8rem;
      color: #333;
      vertical-align: text-bottom;
    }
  }
  h5{
    color: #999;
  }
  .cdetail {
    font-size: 12px;
    color: #333;
    margin: .1rem auto .2rem;
    line-height: 1.5;
    word-wrap:break-word;
  }
}
.cimg-list{
height: auto;
.swiper-wrapper{
  flex-wrap: wrap;
}
.swiper-slide{
  width:2.35rem;
  margin-bottom: 3px;
  height: auto;
  img{
    width:2.2rem;
    height:2.2rem;
  }
}
}
.reply{
  position: relative;
  margin-top: .2rem;
  padding: .2rem;
  background-color: #f2f2f2;
  font-size: 12px;
  color: #333;
  line-height: 1.5;
  &::before{
    content: "";
    position: absolute;
    top: -10px;
    left: .2rem;
    width: 0;
    height: 0;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #f2f2f2;
  }
}
.swiper-wrapper{
  display: -webkit-box;
  display: flex;
}
</style>
