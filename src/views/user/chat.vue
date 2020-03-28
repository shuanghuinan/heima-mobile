<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list">
      <div
        class="chat-item"
        v-for="(item,index) in list"
        :key="index"
        :class="{left:item.name==='xz',right:item.name!=='xz'}"
      >
        <van-image v-if="item.name==='xz'" fit="cover" round :src="xzIMG" />
        <div class="chat-pao">{{item.msg}}</div>

        <van-image v-if="item.name!=='xz'" fit="cover" round :src="photo" />
      </div>
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import xzIMG from '../../assets/u=3162816245,4100265419&fm=11&gp=0.jpg' // 引入小智的头像
import io from 'socket.io-client' // 引入socke.io的客户端
import { mapState } from 'vuex' // 引入vuex中的辅助函数
export default {
  data () {
    return {
      xzIMG, // 小智的头像
      value: '', // 输入框的内容
      loading: false, // 当前是否在提交
      list: [] // 用来存放聊天内容
    }
  },
  computed: {
    ...mapState(['photo', 'user'])
  },
  methods: {
    // 点提交的时候,向服务器发送消息
    send () {
      // 先看输入框是否为空,如果为空就不能发消息了
      if (!this.value) return false
      this.loading = true // 打开提交状态,目的是为了防止重复提交
      const obj = { msg: this.value, timestamp: Date.now() } // 定义要向服务器发送的消息对象
      // console.log(obj)

      this.socket.emit('message', obj) // 向服务器发送消息
      this.list.push(obj) // 将发出的消息加入到消息列表中
      this.loading = false // 关闭提交状态
      this.value = '' // 清空输入框的消息
    }
  },
  created () {
    // 在钩子函数中进行连接
    this.socket = io('http://ttapi.research.itcast.cn', {
      query: { token: this.user.token }
    })
    // 连接成功后,服务器接受消息
    this.socket.on('message', data => {
      // console.log(data)
      this.list.push({ ...data, name: 'xz' }) //  data就是 客户服务器回复的消息 认为接收的消息都是 小智同学回复的
    })
  },
  beforeDestroy () {
    // 需要在实例销毁之前  把websocket连接给关掉
    this.socket.close()
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
