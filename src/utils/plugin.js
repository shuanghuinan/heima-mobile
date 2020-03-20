/**
 * 此工具专用于负责提供小函数,以及vue中常用的过滤器及函数
 */
import dayjs from 'dayjs' // 引入dayjs插件
import relativeTime from 'dayjs/plugin/relativeTime' // 引入dayjs的相对时间插件
import 'dayjs/locale/zh-cn' // 引入dayjs的中文大陆语言包
dayjs.extend(relativeTime) // 把相对时间插件扩展给dayjs

export default {
  install (Vue) {
    // 为vue增加一个叫做$shnnotify的方法,该方法拥有$notify的所有的属性,
    // 但是:唯一不同的是  在Vant组件库中,$notify的属性duration的默认值是3000,我们这里将其改成了700
    Vue.prototype.$shnnotify = function (params) {
      Vue.prototype.$notify({ duration: 700, ...params })
    }
    // 将sleep函数加给Vue
    Vue.prototype.$sleep = sleep

    // 将相对时间过滤器注册成全局过滤器
    Vue.filter('relTime', relTime)
  }
}

// 休眠函数
// time  = 500 如果你传入了time 用你的 如果说你没传 time 用 500
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    window.setTimeout(() => resolve(), time)
  })
}

// 相对时间过滤器函数
function relTime (params) {
  return dayjs().locale('zh-cn').from(params)
}
