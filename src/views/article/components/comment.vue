<template>
  <div class="comment">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="load">
      <div
        class="item van-hairline--bottom van-hairline--top"
        v-for="(item,index) in comments"
        :key="index"
      >
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="item.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{item.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{item.like_count}}</span>
            </span>
          </p>
          <p v-html='item.content'></p>
          <p>
            <span class="time">{{item.pubdate | relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(item.com_id.toString())">{{item.reply_count}}回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>

    <!-- 回复评论 -->
    <van-action-sheet v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <van-list v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{item.aut_name}}</span></p>
            <p v-html="item.content"></p>
            <p><span class="time">{{item.pubdate | relTime}}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments } from '@/api/articles' // 引入获取文章评论的接口
export default {
  data () {
    return {
      loading: false, // 是否在上拉加载
      finished: false, // 全部加载完毕
      value: '', // 输入的内容
      submiting: false, // 控制提交中状态数据
      offset: null, // 偏移量,代表评论的id值
      comments: [], // 评论数据
      showReply: false, // 控制评论的评论面板是否显示
      reply: {
        // 此对象专门放置对评论的回复的信息  面板加载信息
        loading: false,
        finished: false,
        offset: null, // 偏移量
        list: [], // 存放回复的内容列表
        commentId: null // 用来存放评论Id  用这个id来去查询 这个评论的评论
      }
    }
  },
  methods: {
    // 获取评论
    async load () {
      const { artId } = this.$route.query // 从路由中获取当前文章id
      const res = await getComments({ type: 'a', source: artId, offset: this.offset }) // 发请求
      this.comments.push(...res.results) // 将评论数据追加到评论列表的尾部
      this.loading = false // 关闭正在上拉加载的状态
      this.finished = res.end_id === res.last_id // 如果所有评论的最后一个id 和 本次返回结果的最后一个评论id 相同,就关闭代表加载完毕
      // 如果没有加载完毕的话,
      if (!this.finished) {
        // 将偏移量设置为当前页的最后一个id
        this.offset = res.last_id
      }
    },
    // 获取评论的回复
    async getReplyInfo () {
      // 发请求,去请求评论的回复内容
      const res = await getComments({ type: 'c', source: this.reply.commentId, offset: this.reply.offset })
      this.reply.list.push(...res.results) // 将请求到的回复信息存到data中
      this.reply.loading = false// 关闭上拉加载的状态
      this.reply.finished = res.end_id === res.last_id // 如果所有回复的最后一个id 和 本次返回结果的最后一个回复id 相同,就关闭代表加载完毕
      if (!this.reply.finished) {
        this.reply.offset = res.last_id
      }
    },
    // 点击回复评论时,显示评论面板
    openReply (replyId) {
      //   alert(replyId)
      this.showReply = true// 先让评论面板显示
      this.reply.commentId = replyId// 重置当前回复id值
      this.reply.list = []// 清空之前的数据
      this.reply.loading = true // 主动打开加载状态 因为此时没有 主动检查
      this.reply.finished = false// 将finsish打开
      this.getReplyInfo()// 发请求
    }
  },
  created () {

  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
