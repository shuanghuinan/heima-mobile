<template>
  <div>
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.go(-1)"></van-nav-bar>
    <!-- 搜索框 -->
    <van-search shape="round" v-model.trim="keyword" placeholder="请输入搜索关键词" />
    <!-- 有输入内容时的联想内容 -->
    <van-cell-group class="suggest-box" v-if="keyword">
      <van-cell icon="search">
        <span>联想内容</span>
      </van-cell>
    </van-cell-group>
    <!-- 没输入内容时的历史记录 -->
    <div class="history-box" v-else>
      <div class="head">
        <span>历史记录</span>
      </div>
      <van-cell-group>
        <van-cell>
          <a class="word_btn">搜索记录</a>
          <van-icon class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keyword: '' // 搜索的关键字
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
