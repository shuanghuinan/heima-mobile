import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'// 将auth中的所有导出的东西都放入一个叫做auth的对象

Vue.use(Vuex)

export default new Vuex.Store({
  // 代表共享数据
  state: {
    user: auth.getUser(), // user代表token信息对象,要做持久化,就要在本地存储中将token中读取出来
    photo: null// 表示用户的个人头像,不能设置成固定值,因为用户头像是可以改的
  },
  // 要想改变共享数据,必须通过mutation
  mutations: {
    // 一个方法用来更新user
    updateUser (state, payload) {
      state.user = payload.user// 更改user
      auth.setUser(payload.user)// 并且将更改后的新user设置给本地存储
    },
    // 一个方法用来删除user
    deleteUser (state) {
      state.user = {} // 删除第一步:将user置空
      auth.delUser()// 删除第二步:删除本地存储
    },
    // 修改个人头像的方法
    updateIMG (state, payload) {
      state.photo = payload.photo// 在载荷中传入photo
    }
  },
  actions: {
  },
  modules: {
  }
})
