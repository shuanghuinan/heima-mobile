/**
 * 此工具专用于负责提供小函数,以及vue中常用的过滤器及函数
 */
export default {
  install (Vue) {
    // 为vue增加一个叫做$shnnotify的方法,该方法拥有$notify的所有的属性,
    // 但是:唯一不同的是  在Vant组件库中,$notify的属性duration的默认值是3000,我们这里将其改成了700
    Vue.prototype.$shnnotify = function (params) {
      Vue.prototype.$notify({ duration: 700, ...params })
    }
  }
}
