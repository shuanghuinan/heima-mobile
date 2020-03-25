/**
 * 负责处理用户数据
 */

import request from '@/utils/request' // 引入请求文件

// 导出一个用于用户登录的方法
export function login (data) {
  return request({
    url: '/authorizations',
    method: 'post',
    data: data
  })
}

// 关注用户
export function followUser (data) {
  return request({
    url: '/followings',
    method: 'post',
    data
  })
}

// 取消关注用户
export function unFollowUser (autid) {
  return request({
    url: `/followings/${autid}`,
    method: 'delete'
  })
}

// 获取用户基本信息
export function getUserInfo () {
  return request({
    url: '/user'
  })
}
