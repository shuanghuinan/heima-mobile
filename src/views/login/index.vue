<template>
  <div class='container'>
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()"></van-nav-bar>
    <van-cell-group>
        <van-field @blur="checkMobile" v-model.trim="FormData.mobile" :error-message="errorInfo.mobile" label="手机号" placeholder="请输入手机号"></van-field>
        <van-field @blur="checkCode" v-model.trim="FormData.code" :error-message="errorInfo.code" label="验证码 " placeholder="请输入验证码">
           <van-button slot="button" size="small" type="primary">发送验证码</van-button>
        </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
    <div class="login_btn">
      <van-button @click="login" type="info" block round size="small">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'// 引入登录用的接口
import { mapMutations } from 'vuex'// 引入vuex中的mutations中的方法

export default {
  data () {
    return {
      // 输入框数据
      FormData: {
        mobile: '', // 手机号
        code: ''// 验证码
      },
      // 输入框的错误信息
      errorInfo: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    ...mapMutations(['updateUser']), // 可以导入需要的方法,直接把updateUser方法映射到当前的methods方法中
    // 自动验证手机号格式是否对
    checkMobile () {
      // 如果手机号为空
      if (!this.FormData.mobile) {
        this.errorInfo.mobile = '手机号不能为空'
        return false
      }
      // 如果手机号格式错误
      if (!/^1[3456789]\d{9}$/.test(this.FormData.mobile)) {
        this.errorInfo.mobile = '手机号格式错误'
        return false
      }
      // 否则,表示正确,就要清空错误信息,并且返回true
      this.errorInfo.mobile = ''
      return true
    },

    // 自动校验验证码是否正确
    checkCode () {
      // 如果验证码为空
      if (!this.FormData.code) {
        this.errorInfo.code = '验证码不能为空'
        return false
      }
      // 如果验证码格式错误
      if (!/^\d{6}$/.test(this.FormData.code)) {
        this.errorInfo.code = '验证码格式错误'
        return false
      }
      // 否则,表示正确,就要清空错误信息,并且返回true
      this.errorInfo.code = ''
      return true
    },

    // 点登录按钮时的手动验证
    async login () {
      this.checkMobile()
      this.checkCode()
      // 如果对手机号和验证码的自动校验都通过的话,就去请求登录接口
      if (this.checkMobile() && this.checkCode()) {
        try {
          const res = await login(this.FormData)
          // 请求接口成功,代表登录成功,,并且进行页面的跳转
          // 就要将请求到的token存入到vuex
          this.updateUser({ user: res })
          // 然后进行页面的跳转,
          // 跳转的时候也要做一下验证,如果路由中有参数,就跳到参数地址。   如果没有参数,就跳到主页
          const { redirectUrl } = this.$route.query // query查询参数 也就是 ?后边的参数表
          this.$router.push(redirectUrl || '/')
        } catch (error) {
          // 提示消息 提示用户 告诉用户登录失败
          // this.$notify({ message: '用户名或者验证码错误', duration: 800 })
          this.$notify({ message: '用户名或验证码错误,请检查后重新输入', duration: 700 })
          // 这里我们要抖一个小机灵
        }
      }
    }
  }
}
</script>

<style>
.login_btn{
  padding:10px
}
</style>
