<template>
  <div class="container">
    <!-- tabs标签页组件 -->
    <van-tabs v-model="channelIndex">
      <!-- 标签页内的每一项 -->
         <!-- 有多少个tab,就有多少个articlelist组件 -->
         <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 每项的内容,单独封装成一个组件 -->
        <articleList :channel_id='item.id' @showAction='openAction'>

        </articleList>
      </van-tab>
    </van-tabs>
        <!-- 在tabs下放置图标  编辑频道的图标 -->
      <span class="bar_btn">
        <!-- 放入图标 vant图标 -->
         <van-icon name='wap-nav' @click="showChannelEdit=true"></van-icon>
      </span>
      <!-- 弹出层组件 -->
      <van-popup v-model="showMoreAction" style="width: 80%">
        <!-- 在弹出层组件中放置'更多操作组件' -->
          <!-- <moreAction @dislike="dislikeArticle" @report='reportArticle'></moreAction> -->
          <moreAction @dislike="dislikeArticle('display')" @report="dislikeArticle('report',$event)"></moreAction>
      </van-popup>
      <!-- 频道编辑组件 -->
      <van-action-sheet title="频道编辑" v-model="showChannelEdit" :round="false">
        <channelEdit :Mychannels='channels' :curChannel='channelIndex' @selectChannel='selectChannel'></channelEdit>
      </van-action-sheet>
  </div>
</template>

<script>
import articleList from '@/views/home/component/article-list' // 引入文章列表组件
import moreAction from '@/views/home/component/more-action' // 引入更多操作组件
import channelEdit from '@/views/home/component/channel-edit'// 引入频道编辑组件
import { getChannels } from '@/api/channels' // 引入获取频道请求
import { dislikeArticle, reportArticle } from '@/api/articles' // 引入对文章不喜欢的请求 he 举报文章的请求
import eventBus from '@/utils/eventbus' // 引入公共实例

export default {
  components: {
    articleList,
    moreAction,
    channelEdit
  },
  data () {
    return {
      channels: [], // 放置频道数据
      showMoreAction: false, // 是否显示弹层组件,默认不显示
      articleId: null, // 文章id
      channelIndex: 0, // 当前所在频道的索引值
      showChannelEdit: false// 是否显示频道编辑组件
    }
  },
  methods: {
    async getChannels () {
      const res = await getChannels()
      this.channels = res.channels // 获取频道成功后,将获取到的数据加进data中的数据中
    },
    // 此方法 会在article-list组件触发
    openAction (id) {
      // alert(id)
      this.showMoreAction = true
      this.articleId = id
    },
    // 对文章的不喜欢/举报
    async dislikeArticle (operateType, type) {
      try {
        operateType === 'display' ? await dislikeArticle({ target: this.articleId }) : await reportArticle({ target: this.articleId, type })// 发请求

        // this.articleId = res.target// 请求成功的话,将响应数据中的不喜欢文章id值赋值到data中
        this.$shnnotify({ type: 'success', message: '操作成功' })// 然后显示成功提示消息
        // 把当前所点击的文章的频道id和文章id传给其他组件
        eventBus.$emit('delArticle', this.channels[this.channelIndex].id, this.articleId)
        this.showMoreAction = false// 将弹层隐藏
      } catch (error) {
        // 请求不成功的话,显示错误提示消息
        this.$shnnotify({ message: '操作失败' })
      }
    },
    // async dislikeArticle () {
    //   try {
    //     await dislikeArticle({ target: this.articleId })
    //     // this.articleId = res.target// 请求成功的话,将响应数据中的不喜欢文章id值赋值到data中
    //     this.$shnnotify({ type: 'success', message: '操作成功' })// 然后显示成功提示消息
    //     // 把当前所点击的文章的频道id和文章id传给其他组件
    //     eventBus.$emit('delArticle', this.channels[this.channelIndex].id, this.articleId)
    //     this.showMoreAction = false// 将弹层隐藏
    //   } catch (error) {
    //     // 请求不成功的话,显示错误提示消息
    //     this.$shnnotify({ message: '操作失败' })
    //   }
    // },

    // // 举报文章
    // async reportArticle (type) {
    //   try {
    //     await reportArticle({ target: this.articleId, type })// 发请求
    //     this.$shnnotify({ type: 'success', message: '举报成功' })
    //     eventBus.$emit('delArticle', this.channels[this.channelIndex].id, this.articleId)
    //     this.showMoreAction = false// 将弹层隐藏
    //   } catch (error) {
    //     this.$shnnotify({ message: '操作失败' })
    //   }
    // }
    // 选择频道
    selectChannel (index) {
      this.channelIndex = index // 将当前频道索引改为子组件传过来的索引值
      this.showChannelEdit = false// 关闭弹层
    }
  },
  created () {
    this.getChannels()
  }
}
</script>

<style lang='less' scoped>
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
