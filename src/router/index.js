import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '@/views/home'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: home
  }

]

const router = new VueRouter({
  routes
})

export default router
