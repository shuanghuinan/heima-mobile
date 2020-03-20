import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant' // 引入vant组件库,及图片懒加载组件
import 'vant/lib/index.less'// 引入vant样式文件
import 'amfe-flexible'// 引入rem适配的插件---会根据当前屏幕变化而产生不同的font-size
import '@/styles/index.less'// 引入公共样式
import '@/permission' // 引入导航守卫
import plugin from '@/utils/plugin'// 引入自己封装的插件工具

// 全局注册后,他们就都成了vue的属性,就可以在全局使用了
Vue.use(Vant)// 全局注册vant
Vue.use(plugin) // 全局注册plugin   必须放在全局注册vant的下面,因为我们要在plugin中用vant的内置函数,必须等vanguard注册完毕

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
