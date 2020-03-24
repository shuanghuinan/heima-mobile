<template>
  <!-- 我是每个tab -->
  <div class="scroll-wrapper">
    <!-- 大表格,外面包一层van-pull-refresh,可用来实现下拉刷新 -->
    <van-pull-refresh @refresh="onRefresh" v-model="refresh" :success-text="successTest">
      <van-list v-model="loading" :finished="finished" @load="load" finished-text="见底了">
        <van-cell-group>
          <!-- 每条信息 -->
          <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <!-- 三图图片 -->
              <div class="img_box" v-if="item.cover.type===3">
                <!-- 图片组件用的是 vant的组件库中的图片组件 需要使用该组件 进行图片的懒加载 -->
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 暂时隐藏掉单图-->
              <div class="img_box" v-if="item.cover.type===1">
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>{{item.aut_id}}</span>
                <span>{{item.ch_id}}评论</span>
                <span>{{item.pubdate | relTime}}</span>
                <!-- vuex中有token,就显示小叉号,没有token就不显示 -->
                <span @click.stop="$emit('showAction',item.art_id.toString())" class="close" v-if="$store.state.user.token">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/articles'
import eventBus from '@/utils/eventbus' // 引入公共实例

export default {
  data () {
    return {
      loading: false, // 表示当前是否在上拉加载
      finished: false, // 表示当前列表的所有数据是否已经加载完毕
      refresh: true, // 下载刷新状态 表示是否正在下拉刷新
      successTest: '', // 表示下拉刷新完成后的显示文本
      articles: [], // 用于存放文章文章列表
      timestamp: null // 定义一个时间戳属性 用来存储 历史时间戳
    }
  },
  props: {
    channel_id: {
      required: true,
      type: Number,
      default: null
    }
  },
  methods: {
    // 此方法用来做上拉加载,在滚动条与底部举例小于offset时触发
    // load () {
    //   // 如果文章长度大于50,则代表加载完毕
    //   if (this.articles.length > 50) {
    //     this.finished = true
    //   } else {
    //     // 否则认为没加载完毕,要继续往文章列表内添加数据
    //     const arr = Array.from(Array(15), (value, index) => {
    //       return this.articles.length + index + 1
    //     })
    //     this.articles.push(...arr) // 将生成的arr添加至文章列表数据
    //     this.loading = false // 然后关闭上拉加载状态
    //   }
    // },
    async load () {
      const res = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })// 如果有历史时间戳 用历史时间戳 否则用当前的时间戳
      // console.log(res)
      this.articles.push(...res.results) // 将获取到的结果一项一项加入articles中
      this.loading = false
      // 如果响应数据中有历史时间戳，就要把历史时间戳存入到data中的数据中
      // 否则存入当前时间戳
      if (res.pre_timestamp) {
        this.timestamp = res.pre_timestamp
      } else {
        this.finished = true
      }
    },

    // 此方法用来做下拉刷新
    // onRefresh () {
    //   const arr = Array.from(Array(2), (value, index) => {
    //     return '我是新来的'
    //   })
    //   this.articles.unshift(...arr) // 将生成的arr从前加进文章列表数据
    //   this.refresh = false // 然后手动关闭正在加载的状态
    //   this.successTest = `更新了${arr.length}条数据` // 并且设置显示文本
    // },
    async onRefresh () {
      await this.$sleep() // 调用自己封装的休眠函数
      const res = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() })// 请求下拉刷新的时候传的当前时间戳
      this.articles.unshift(...res.results)
      this.refresh = false // 然后手动关闭正在加载的状态
      // 如果响应数据中有历史时间戳，就要把历史时间戳存入到data中的数据中,并且要重新唤醒finished数据     否则存入当前时间戳
      if (res.pre_timestamp) {
        this.timestamp = res.pre_timestamp
        this.finished = false// 让列表可以继续上拉加载
        this.successTest = `更新了${res.results.length}条数据`
      } else {
        this.successTest = '当前已经是最新的了'
      }
      // this.successTest = `更新了${.length}条数据` // 并且设置显示文本
    }
  },

  created () {
    // debugger

    eventBus.$on('delArticle', (channelId, articleId) => {
      // alert(123)
      // 如果 传递过来的频道 等于 自身的频道  的话,再进行文章列表的删除
      if (channelId === this.channel_id) {
        // alert(this.channel_id)
        const index = this.articles.findIndex(item => item.art_id.toString() === articleId)
        // 如果点击的文章列表的索引>-1,就进行删除操作
        if (index > -1) {
          this.articles.splice(index, 1) // 删除对应下标的数据
        }
        // 当文章列表里面没有数据的时候(即我们把页面显示所有文章都点了不感兴趣后,就会导致列表里面没有数据,此时要在执行一下加载文章事件)
        if (this.articles.length === 0) {
          this.load()
        }
      }
    })
  }
}
</script>

<style lang='less' scoped>
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
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
