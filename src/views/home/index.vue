<template>
  <div class="container">
    <!-- tabs标签页组件 -->
    <van-tabs>
      <!-- 标签页内的每一项 -->
         <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 每项的内容,单独封装成一个组件 -->
        <articleList :article_id='item.id'>

        </articleList>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import articleList from '@/views/home/component/article-list' // 引入文章列表组件
import { getChannels } from '@/api/channels' // 引入获取频道请求

export default {
  components: {
    articleList
  },
  data () {
    return {
      channels: []
    }
  },
  methods: {
    async getChannels () {
      const res = await getChannels()
      this.channels = res.channels // 获取频道成功后,将获取到的数据加进data中的数据中
    }
  },
  created () {
    this.getChannels()
  }
}
</script>

<style lang='less' scoped>
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
