import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant' // 引入vant组件库
import 'vant/lib/index.css'// 引入vant样式文件
import 'amfe-flexible'// 引入rem适配的插件---会根据当前屏幕变化而产生不同的font-size
import '@/styles/index.less'// 引入公共样式
import '@/permission' // 引入导航守卫
Vue.use(Vant)// 全局注册vant
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
