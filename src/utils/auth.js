/*****
 * auth.js 专门处理 token的设置、获取 和删除,
 *   create by gaoly 2020/3/15
 * *****/
const USER_TOKEN = 'heima-mobile'

export function setUser (user) {
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}

// 本地不仅存着token(保质期两小时),还存着refresh_token(保质期十四天)
export function getUser () {
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || {})
}

export function delUser () {
  window.localStorage.removeItem(USER_TOKEN)
}
