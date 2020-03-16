import axios from 'axios'
import bigInt from 'json-bigint'
import store from '../store'
import router from '@/router' // 引入router对象

// axios.create(),相当于创建了一个新的axios实例
const instance = axios.create({
  // 对原有默认值进行修改:处理axios请求基地址和大数字问题

  // 处理基地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',

  // 处理大数字,
  // transformResponse是一个数组, 在后台响应回来但是还没有进入到axios响应拦截器的时候执行,
  // 数组内可以写多个处理函数,函数的参数是指从后端响应回来的字符串数据
  transformResponse: [function (data) {
    return data ? bigInt.parse(data) : {} // data存在就将其用bigint的parse方法转为对象,data不存在就返回一个空对象
  }]

})

// ------请求拦截器
// 拦截器有两个参数,两个参数都为函数,第一个函数指成功后要执行的函数,第二个函数指失败后要执行的函数
// 第一个函数的参数config是指请求的配置信息,第二个函数的参数是指失败信息对象
// 需要注意的是,这两个函数对参数进行一系列设置改变后,都要进行返回
// 通俗点说就是: 都要将改动后的config / error进行返回
// 要在请求拦截器里面注入token(从store中获取的token)
instance.interceptors.request(function (config) {
  // 如果token存在的话,就将token注入请求拦截器
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
}, function (error) {
  // 如果失败的话,返回错误,这样进行返回的话,会直接进入到axios的catch中
  return Promise.reject(error)
})

// ------响应拦截器
// 拦截器有两个参数,两个参数都为函数,第一个函数指成功后要执行的函数,第二个函数指失败后要执行的函数
// 第一个函数的参数res是指响应数据,第二个函数的参数是指失败信息
// 需要注意的是,这两个函数对参数进行一系列设置改变后,都要进行返回
// 通俗点说就是: 都要将改动后的data / error进行返回
instance.interceptors.response(function (res) {
  // 如果成功了就对返回数据进行解构,通俗点说就是脱衣服
  // response实际上已经被 axios 默认包了一层数据  data才是 我们之前处理过的数据
  // 几乎所有的返回数据都有一层data
  try {
    return res.data.data// 如果成功则返回  如果两层可以解开 就返回两层
  } catch (error) {
    return res.data //  如果失败 说明 response.data不存在  如果两层解不开 就返回一层
  }
}, async function (error) {
  // 如果请求失败或者失效或者其他错误 会进入 到 响应拦截器的错误的区域
  // 如果响应失败,则根据失败信息对象error再进行一系列的操作
  /*****
   * error
   *    config  是出现这次错误请求的配置信息
   *    request  请求对象
   *    response 响应对象 status (状态码)
   * *****/
  if (error.response && error.response.state === 401) {
    // 先搞一个变量,用来表示跳转登录页的时候,要携带的参数
    // 参数表示登录页要跳转的地址,因为登陆成功后,还要回去
    const path = {
      path: '/login',
      query: {
        redirectUrl: router.currentRoute.fullPath // 表示登录页需要跳转的地址
      }
    }
    // 如果有响应且响应的状态码为401,则表示token失效,就需要处理token失效问题
    // 如果token失效,则先看有没有refresh_token
    if (store.state.user.refresh_token) {
      // 首先我们要明白(token的保质期只有两个小时,refresh_token的保质期是十四天, refresh_token用于在当前token过期之后,获取新的token)
      //     通俗点来说就是:token两小时过期,若你有有效的refresh_token,可以用refresh_token去换一个新的token,
      //     新的token保质期依旧是两小时,每隔两小时自动换一次,直至换到这个refresh_token过期
      //     refresh_token过期后,就要删除refresh_token,并强制跳转至登录页,重新登录

      // 如果refresh_token存在的话,先判断refresh_token是否有效,如果有效的话
      // 就要发用refresh_token来发axios请求接口来获取新的token,来代替token
      if (store.state.user.refresh_token) {
        // 注意:这里用axios调接口发请求, 必须要用axios,而不能用之前创建好的实例,
        // 因为现在token已经失效了, 但是我们之前封装的axios实例的请求拦截器还是会将失效的token注入到headers中,
        // 我们需要用没有拦截器的axios来刷新token
        try {
          const res = await axios({
            method: 'put',
            url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
            headers: store.state.user.refresh_token
          })
          // 请求成功后将新的token和原先的refresh_token设置vuex
          store.commit('updateUser', {
            user: {
              token: res.data.data.token, // 最新的token
              refresh_token: store.state.user.refresh_token// 还是原来的refresh_token,14天后过期
            }
          })
        } catch (error) {
          // 若请求失败,则代表refresh_token失效,要将refresh_token删掉,并且带着参数回到登录页
          store.commit('deleteUser')
          router.push('path')
        }
      } else {

      }
    } else {
      // refresh_token不存在的话,就要    1.删除token,   2.并且带着当前地址跳转到登录页面
      store.commit('deleteUser')// 删除token
      router.push(path)// 跳转
    }
  }
  return Promise.reject(error)
})

// 导出axios实例
export default instance
