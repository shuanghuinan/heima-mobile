/*****
 * auth.js 专门处理 token的读写和删除
 *   create by gaoly 2020/3/15
 * *****/
const USER_TOKEN = 'heima-mobile'

export function setUser (user) {
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}

export function getUser () {
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || {})
}

export function delUser () {
  window.localStorage.removeItem(USER_TOKEN)
}
