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
        <span class="submit" v-else slot="button" @click="submit">提交</span>
      </van-field>
    </div>

    <!-- 回复评论 -->
    <van-action-sheet @closed="reply.commentId=null" v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
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
import { getComments, commentOrreply } from '@/api/articles' // 引入获取文章评论的接口  和 提交评论或回复的接口

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
    },

    // 点击提交按钮时, 提交评论或回复
    // 在关闭回复的弹出面板时,将当前的评论id清除
    async submit () {
      this.$sleep(900)// 为了防止用户过于频繁的进行提交,刷屏现象,用延迟函数做个延迟
      // 只有登录用户才可以进行评论或回复
      if (this.$store.state.user.token) {
        // 确定是已登录用户后,再来判断输入框是否有内容
        if (!this.value) return false// 如果没有内容的话,直接返回false
        // 然后再进行有内容的操作
        this.submiting = true// 先将提交状态打开
        try {
          const res = await commentOrreply({ // 然后再去请求提交评论或回复的接口
            target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId, // 如果有评论id的话,就代表是要对评论进行回复,如果没有评论id的话,就代表是要对文章进行评论
            content: this.value,
            art_id: this.reply.commentId ? this.$route.query.artId : null
          })
          this.submiting = false// 请求完之后,将提交状态关闭
          // 并且将从后台响应回来的数据加到评论列表/回复列表
          // 如果有评论id,表明现在是在对评论进行回复,而不是对文章进行评论
          if (this.reply.commentId) {
            this.reply.list.unshift(res.new_obj)
            const comment = this.comments.find((item) => { return item.com_id.toString() === this.reply.commentId })// 寻找  文章评论中 ===当前评论id的id
            comment && comment.reply_count++ // 如果找到就将 回复数量+1
          } else {
            // 否则说明是在对文章进行评论
            this.comments.unshift(res.new_obj)
          }
          this.value = ''// 清空输入框
        } catch (error) {
          this.$shnnotify({ message: '评论失败' })
        }
      } else {
        // 如果没有登录的话,给个提示信息,并且带着参数回登录页
        try {
          await this.$dialog.confirm({ title: '提示', message: '您必须在登陆后才可以进行这个操作' })
          this.$router.push({
            path: '/login',
            query: { redirectUrl: this.$route.fullPath }
          })
        } catch (error) {
          // 点击了取消的话,不做任何操作
        }
      }
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
