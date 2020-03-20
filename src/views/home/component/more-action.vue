<template>
  <div class="more-action">
    <van-cell-group v-if="!isReport">
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell v-for="item in reports" :key="item.value" @click="$emit('report',item.value)">{{item.label}}</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants'
import eventBus from '@/utils/eventbus'// 引入公共实例
export default {
  data () {
    return {
      isReport: false, // 是否举报的意思
      reports
    }
  },
  created () {
    eventBus.$on('delArticle', () => {
      this.isReport = false // 只要你一开始删除 我就把弹层中反馈组件重置为初始状态
    })
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
