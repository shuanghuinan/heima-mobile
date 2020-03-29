<template>
  <div id="app">
    <!-- 通过$route.meta来决定是否采用 keep-alive来包裹 我们的一级路由容器 -->
    <keep-alive>
       <!-- 里面是当需要缓存时 -->
      <router-view v-if="$route.meta.isAlive"></router-view>
    </keep-alive>
       <!-- 外面是不需要缓存时 -->
      <router-view v-if="!$route.meta.isAlive"></router-view>
  </div>
</template>

<style lang="less">

</style>
