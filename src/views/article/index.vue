<template>
   <div class='container'>
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{articleInfo.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="articleInfo.aut_photo" />
        <div class="text">
          <p class="name">{{articleInfo.aut_name}}</p>
          <p class="time">{{articleInfo.pubdate | relTime}}</p>
        </div>
        <van-button round size="small" type="info">{{articleInfo.is_followed ? '已关注' : '+ 关注'}}</van-button>
      </div>
      <div class="content" v-html="articleInfo.content">
        <!-- 文章内容 -->
      </div>
      <div class="zan">
        <van-button round size="small" :class="{active:articleInfo.attitude===1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active:articleInfo.attitude===0}" plain icon="delete">不喜欢</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles' // 引入文章详情接口
export default {
  data () {
    return {
      articleInfo: {}// 用来存放当前文章信息
    }
  },
  methods: {
    async  getArticleInfo () {
      try {
        const { artId } = this.$route.query // 从当前路由信息对象读取 query参数
        this.articleInfo = await getArticleInfo(artId) // 请求接口取得数据
      } catch (error) {
        alert(error.message)
      }
    }
  },
  created () {
    this.getArticleInfo()
  }
}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
