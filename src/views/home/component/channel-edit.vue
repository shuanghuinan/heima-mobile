<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in Mychannels" :key="index">
          <span @click="$emit('selectChannel',index)" class="f12"  :class="{red:index===curChannel}">{{item.name}}</span>
          <van-icon @click="$emit('delMyChannel',item.id)" v-if="index!=0&&editing===true" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in optionalChannels" :key="index">
          <span class="f12">{{item.name}}</span>
          <van-icon @click="$emit('addMyChannel',item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  data () {
    return {
      editing: false, // 是否正处于编辑状态
      allChannels: []// 全部频道数据
    }
  },
  props: {
    // 接收我的频道数据
    Mychannels: {
      required: true,
      type: Array
    },
    curChannel: {
      required: true,
      type: Number
    }
  },
  methods: {
    async getAllChannels () {
      const res = await getAllChannels()
      this.allChannels = res.channels
    }

  },
  computed: {
    // 可选频道数据
    optionalChannels () {
      return this.allChannels.filter((item) => {
        return !this.Mychannels.some((items) => { return items.id === item.id })
      })
    }
  },
  created () {
    this.getAllChannels()
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
