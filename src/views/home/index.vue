<template>
  <div class="container">
    <!-- tabs标签页组件 -->
    <van-tabs>
      <!-- 标签页内的每一项 -->
      <van-tab :title="`标签${item}`" v-for="item in 10" v-bind:key="item">
        <!-- 每项的内容,单独封装成一个组件 -->
        <articleList>

        </articleList>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import articleList from '@/views/home/component/article-list'
export default {

  components: {
    articleList
  }
}
</script>

<style>

</style>
