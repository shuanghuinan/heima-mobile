/**
 * 负责处理频道数据
 */

import request from '@/utils/request'// 引入请求文件

// 获取我的频道数据
export function getChannels () {
  return request({
    url: '/user/channels'
  })
}

// 获取全部频道数据
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
