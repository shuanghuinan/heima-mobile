<template>
  <!-- 我是每个tab -->
  <div class="scroll-wrapper">
    <!-- 大表格,外面包一层van-pull-refresh,可用来实现下拉刷新 -->
    <van-pull-refresh @refresh="onRefresh" v-model="refresh" :success-text="successTest">
      <van-list v-model="loading" :finished="finished" @load="load" finished-text="见底了">
        <van-cell-group>
          <!-- 每条信息 -->
          <van-cell v-for="(item,index) in articles" :key="index">
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">2020年,真的是世纪大变革,世界进程发生巨变的一年</h3>
              <!-- 三图图片 -->
              <div class="img_box">
                <!-- 图片组件用的是 vant的组件库中的图片组件 需要使用该组件 进行图片的懒加载 -->
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>
              <!-- 单图 暂时隐藏掉单图-->
              <!-- <div class="img_box">
                <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>-->
              <!-- 作者信息 -->
              <div class="info_box">
                <span>你像一阵风</span>
                <span>8评论</span>
                <span>10分钟前</span>
                <span class="close">
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
export default {
  data () {
    return {
      loading: false, // 表示当前是否在上拉加载
      finished: false, // 表示当前列表的所有数据是否已经加载完毕
      refresh: true, // 下载刷新状态 表示是否正在下拉刷新
      successTest: '', // 表示上拉刷新完成后的显示文本
      articles: [], // 用于存放文章文章列表
      timestamp: null // 定义一个时间戳属性 用来存储 历史时间戳
    }
  },
  props: {
    article_id: {
      required: true,
      type: Number,
      default: null
    }
  },
  methods: {
    // 此方法用来做上拉加载,在滚动条与底部举例小于offset时触发
    load () {
      // 如果文章长度大于50,则代表加载完毕
      if (this.articles.length > 50) {
        this.finished = true
      } else {
        // 否则认为没加载完毕,要继续往文章列表内添加数据
        const arr = Array.from(Array(15), (value, index) => {
          return this.articles.length + index + 1
        })
        this.articles.push(...arr) // 将生成的arr添加至文章列表数据
        this.loading = false // 然后关闭上拉加载状态
      }
    },

    // 此方法用来做下拉刷新
    onRefresh () {
      const arr = Array.from(Array(2), (value, index) => {
        return '我是新来的'
      })
      this.articles.unshift(...arr) // 将生成的arr从前加进文章列表数据
      this.refresh = false // 然后手动关闭正在加载的状态
      this.successTest = `更新了${arr.length}条数据` // 并且设置显示文本
    }
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
