import request from '@/utils/request' // 引入请求文件

// 导出一个用于用户登录的方法
export function login (data) {
  return request({
    url: '/authorizations',
    method: 'post',
    data: data
  })
}
