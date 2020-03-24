<template>
  <div class="container">
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <!-- 将 导航栏固定在顶部 -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 防止搜索结果列表 -->
    <van-list v-model="upLoading" @load="onLoad" :finished="finished">
      <van-cell-group>
        <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type===3">
              <van-image class="w33" fit="cover" src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type===1">
              <van-image class="w100" fit="cover" src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{item.pubdate | relTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { searchArticle } from '@/api/articles' // 引入文章搜索的api
export default {
  data () {
    return {
      articles: [], // 放置文章列表
      finished: false, // 表示当前数据是否已加载完成
      upLoading: false, // 表示当前是否在上拉加载
      page: {
        page: 1, // 当前页数
        per_page: 10 // 每页数量
      }

    }
  },
  methods: {
    async onLoad () {
      const { q } = this.$route.query // 获取query参数
      const res = await searchArticle({ ...this.page, q })
      this.articles.push(...res.results) // 将从后台获取到的数据加到文章列表
      // 如果还能从后台获取的数据的话,就将页数加一继续查找
      this.upLoading = false // 关闭上拉加载的状态
      if (res.results.length) {
        this.page.page++
      } else {
        // 否则代表数据已经加载完成
        this.finished = true
      }
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
