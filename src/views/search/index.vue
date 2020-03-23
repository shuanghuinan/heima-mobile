<template>
  <div>
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.go(-1)"></van-nav-bar>
    <!-- 搜索框 -->
    <van-search @search="onsearch" shape="round" v-model.trim="q" placeholder="请输入搜索关键词" />
    <!-- 有输入内容时的联想内容 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell @click="toResult(item)" icon="search" v-for="(item,index) in suggestList" :key="index" >
      {{item}}
      </van-cell>
    </van-cell-group>
    <!-- 没输入内容时的历史记录 -->
    <div class="history-box" v-else>
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group>
        <van-cell  @click="toSearchResult(item)" v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/articles' // 引入获取联想记忆的接口
const key = 'hm-94-toutiao-history' // 定义一个key变量,表示历史记录在本地存储时的名字
export default {
  data () {
    return {
      q: '', // 搜索的关键字
      historyList: JSON.parse(localStorage.getItem(key) || '[]'), // 历史记录列表
      suggestList: [] // 联想的搜索建议
    }
  },
  watch: {
    // 防抖
    q () {
      // console.log(this.q)
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (!this.q) { // 如果在输入框中没有输入值的话,就将建议数组置空
          this.suggestList = []
          return
        }
        const res = await getSuggestion({ q: this.q }) // 如果输入框中有输入值的话,就去请求数据
        this.suggestList = res.options// 将返回的词条的options赋值给 当前的联想建议
      }, 200)
    }
    // 节流
    // q () {
    //   if (!this.timer) {
    //     this.timer = setTimeout(async () => {
    //       if (!this.q) {
    //         this.suggestList = []
    //         return
    //       }
    //       const res = await getSuggestion({ q: this.q })
    //       this.suggestList = res.options
    //     }, 200)
    //   }
    // }
  },
  methods: {
    // 刪除某条历史记录
    delHistory (index) {
      this.historyList.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // 点击某条记录时,跳转结果
    toSearchResult (text) {
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    // 清空历史记录
    async clear () {
      try {
        await this.$dialog.confirm({ title: '提示', message: '您确定要清空搜索记录吗?' })
        this.historyList = []// 将本地历史记录设置为空
        localStorage.setItem(key, '[]')// 同步设置历史记录为空
      } catch (error) {
        this.$shnnotify({ message: '删除失败' })
      }
    },
    // 搜索事件
    onsearch () {
      // 先判断输入框内容是否为空
      if (!this.q) return
      this.historyList.push(this.q)// 将其添加到历史记录里面
      this.historyList = Array.from(new Set(this.historyList)) // 去重
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 更新到本地缓存
      this.$router.push({ path: '/search/result', query: { q: this.q } }) // 跳转地址
    },
    // 跳转到搜索结果页
    toResult (text) {
      this.historyList.push(text)// 加到历史记录里面
      this.historyList = Array.from(new Set(this.historyList))// 去重
      localStorage.setItem(key, JSON.stringify(this.historyList))// 存入本地
      this.$router.push({ path: '/search/result', query: { q: text } })
    }
  }

}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
</style>
