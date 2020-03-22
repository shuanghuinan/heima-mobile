import store from '@/store' // 引入vuex
/**
 * 负责处理频道数据
 */

import request from '@/utils/request'// 引入请求文件
const CACHE_CHANNEL_V = 'hm-94-toutiao-v' // 登录用户的key
const CACHE_CHANNEL_T = 'hm-94-toutiao-t' // 游客用户的key

// 获取我的频道数据
export function getChannels () {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // key根据当前的登录状态来判断
    const str = localStorage.getItem(key)// 通过缓存key获取缓存中的用户的频道数据
    // 本地缓存有数据 应该把本地数据释放给 后面的执行结果
    if (str) {
      resolve({ channels: JSON.parse(str) })// 这里的结构 是和 请求体中的结构一致的
    } else {
      // 本地缓存没有数据 本地没有数据 就要去请求接口拉取数据
      request({ url: '/user/channels' }).then((res) => {
        localStorage.setItem(key, JSON.stringify(res.channels))
        resolve(res) // 这里表示直接 成功执行了 获取用户频道数据
      })
    }
  })
}
// 删除我的频道
export function delMyChannel (id) {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // key根据当前的登录状态来判断
    const channels = JSON.parse(localStorage.getItem(key))// 直接将本地缓存中的字符串转化成对象
    const index = channels.findIndex((item) => { return item.id === id })
    if (index > -1) {
      channels.splice(index, 1)// 删除对应的下标元素
      localStorage.setItem(key, JSON.stringify(channels))// 重新写入缓存
      resolve()// 如果执行成功了 我们应该 resolve()
    } else {
      reject(new Error('没有找到对应的频道..')) // 如果没有找到对应的下标
    }
  })
}

// 添加我的频道
export function addMyChannel (channel) {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // key根据当前的登录状态来判断
    const channels = JSON.parse(localStorage.getItem(key))// 直接将本地缓存中的字符串转化成对象
    channels.push(channel) // 将添加的频道数据添加到队尾
    localStorage.setItem(key, JSON.stringify(channels))// 重新写入缓存
    resolve()// 执行这一步 相当于 告诉我们使用promise的方法 执行成功了
  })
}
// 获取我的频道数据
// export function getChannels () {
//   return request({
//     url: '/user/channels'
//   })
// }

// 获取全部频道数据
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
