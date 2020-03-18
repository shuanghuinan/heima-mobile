<template>
  <!-- 我是每个tab -->
  <div class="scroll-wrapper">
      <van-list v-model="loading" :finished="finished" @load="load"></van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false, // 表示当前是否在上拉加载
      finished: false // 表示当前列表的所有数据是否已经加载完毕
    }
  },
  methods: {
    // 此方法在滚动条与底部举例小于offset时触发
    load () {
    //   this.loading = true
      this.finished = true
    }
  }
}
</script>

<style>
</style>
