import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入路由组件
const layout = () => import('@/views/layout')// 引入布局组件
const home = () => import('@/views/home')// 引入二级组件---首页
const question = () => import('@/views/question')// 引入二级组件---问答组件
const video = () => import('@/views/video')// 引入二级组件---视频组件
const user = () => import('@/views/user')// 引入二级组件---个人中心组件
//
const profile = () => import('@/views/user/profile')// 引入编辑资料组件
const chat = () => import('@/views/user/chat')// 引入小智同学组件
const login = () => import('@/views/login')// 引入登录组件
const search = () => import('@/views/search')// 引入搜索组件
const searchResult = () => import('@/views/search/search_result')// 引入搜索结果组件
const article = () => import('@/views/article')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: layout,
    children: [
      { path: '', component: home, meta: { isAlive: true } }, // 如果path什么都不写 默认就是二级路由的默认组件
      { path: '/question', component: question },
      { path: '/video', component: video },
      { path: '/user', component: user }
    ]
  }, {
    path: '/user/profile',
    component: profile
  }, {
    path: '/user/chat',
    component: chat
  }, {
    path: '/login',
    component: login
  }, {
    path: '/search',
    component: search
  }, {
    path: '/search/result',
    component: searchResult
  }, {
    path: '/article',
    component: article
  }

]

const router = new VueRouter({
  routes
})

export default router
