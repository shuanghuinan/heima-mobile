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

// 获取用户个人信息
export function getUserProfile () {
  return request({
    url: '/user/profile'

  })
}

// 更新用户头像
export function uploadPhoto (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data
  })
}

// 保存用户更改的个人信息
export function saveUserInfo (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data: { ...data, photo: null }
  })
}
