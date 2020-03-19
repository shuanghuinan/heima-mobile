/**
 * 负责处理频道数据
 */

import request from '@/utils/request'// 引入请求文件

export function getChannels () {
  return request({
    url: '/user/channels'
  })
}
