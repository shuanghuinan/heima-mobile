/**
 * 负责处理文章数据
 */

import request from '@/utils/request'// 引入请求文件

export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params } // 合并 数据
  })
}

// 不感兴趣文章
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post', // 请求类型
    data
  })
}