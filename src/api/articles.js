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

// 举报文章
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data
  })
}

// 获取联想搜索记忆
export function getSuggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}

// 搜索文章
export function searchArticle (params) {
  return request({
    url: '/search',
    params
  })
}

// 文章详情
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`
  })
}

// 获取文章评论
export function getComments (params) {
  return request({
    url: '/comments',
    params
  })
}

// 提交评论或回复
export function commentOrreply (data) {
  return request({
    url: '/comments',
    method: 'post',
    data
  })
}
