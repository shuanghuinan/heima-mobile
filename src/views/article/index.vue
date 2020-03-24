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
        <van-button :loading="followLoading" round size="small" type="info" @click="follow()">{{articleInfo.is_followed ? '已关注' : '+ 关注'}}</van-button>
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

    <!-- 放置一个遮罩层 -->
     <van-overlay :show="loading">
       <!-- 遮罩层里面有加载圈 -->
      <van-loading type="spinner" color="#1989fa" />
     </van-overlay>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles' // 引入文章详情接口
import { followUser, unFollowUser } from '@/api/user'// 引入关注用户/取消关注用户的接口
export default {
  data () {
    return {
      articleInfo: {}, // 用来存放当前文章信息
      followLoading: false, // 是否正在点击关注
      loading: false// 遮罩层状态
    }
  },
  methods: {
    // 获取文章信息
    async  getArticleInfo () {
      this.loading = true// 开启遮罩层
      try {
        const { artId } = this.$route.query // 从当前路由信息对象读取 query参数
        this.articleInfo = await getArticleInfo(artId) // 请求接口取得数据
      } catch (error) {
        // alert(error.message)
        this.$shnnotify({ message: '获取文章失败' })
      } finally {
        this.loading = false // 关闭遮罩层
      }
    },
    // 点击按钮的时候, 关注用户 / 取消关注用户
    async follow () {
      this.followLoading = true// 开启按钮的加载中状态
      try {
        // 如果此时的状态是已关注,就去请求取消关注接口
        if (this.articleInfo.is_followed) {
          await unFollowUser(this.articleInfo.aut_id)
        } else {
        // 否则表示未关注,就要去请求关注用户接口
          await followUser(this.articleInfo.aut_id)
        }
        // 将状态改为对立状态
        this.articleInfo.is_followed = !this.is_followed
      } catch (error) {
        this.$shnnotify({ message: '操作失败' })
      } finally {
        this.followLoading = false// 关闭按钮的加载中状态
      }
    }

  },
  created () {
    this.getArticleInfo()
  }
}
</script>

<style lang='less' scoped>
.van-overlay{
  width: 100%;
  height: 100%;
  display: flex;
    justify-content: center;
  align-items: center;
  background-color:rgba(0,0,0,0.4)
}
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
