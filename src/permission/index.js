/**
 *此文件用来做导航守卫
 */

// 先确定要拦截的页面 /user个人中心   /user/chat小智同学   /user/profile搜索结果
// 为什么只拦截这三个页面呢?   因为要拉新(吸引用户,不要让用户失望,所以除了几个必要页面,其他页面都不进行拦截)
import router from '@/router'// 引入路由配置
import store from '../store'

// 路由前置守卫
router.beforeEach(function (to, from, next) {
  if (to.path.startsWith('/user') && !store.state.user.token) {
    // 如果要去的页面路由地址以/user开头 , 并且没有token-----则要带着参数返回到登录
    next({
      path: '/login',
      query: {
        redirectUrl: to.fullPath
      }
    })
  } else {
    // 否则就直接放行
    next()
  }
})
