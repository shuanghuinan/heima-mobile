module.exports = {
  // 所有的postcss插件
  plugins: {
    autoprefixer: {}, // 自动给css样式加前缀属性display:flex
    'postcss-pxtorem': {
      rootValue: 37.5, // 基准值37.5
      propList: ['*']// 哪些文件要转rem单位? 所有
    }
  }
}
