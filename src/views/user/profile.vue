<template>
  <div class="container">
    <!-- 静态布局 -->
    <van-nav-bar @click-right="save" left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" @click="showPhoto=true" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="名称" @click="showName=true" :value="user.name" />
      <van-cell is-link title="性别" @click="showGender=true" :value=" user.gender===1 ? '女' : '男'" />
      <van-cell is-link title="生日" @click="showDate" :value="user.birthday" />
    </van-cell-group>

    <!-- 弹层组件 -->
    <!-- 头像弹层 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <van-cell is-link title="本地相册选择图片" @click="clickUpload"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 昵称弹层  -->
    <van-popup v-model="showName" style="width:80%" :close-on-click-overlay="false">
      <!-- 编辑用户昵称  双向绑定用户的昵称-->
      <van-field v-model.trim="user.name" type="textarea" rows="4" :error-message="errorMessage"></van-field>
      <van-button @click="nameBtn" block type="info" size="normal">确定</van-button>
    </van-popup>
    <!-- 性别弹层 -->
    <van-action-sheet @select="selectGender" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 日期弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate" @confirm="confirmTime" @cancel="showBirthDay=false"/>
    </van-popup>

    <!-- 放置一个文件上传框,是隐藏的 -->
    <input type="file" @change="uploadPhoto" style="display:none" ref="photoFile">
  </div>
</template>

<script>
import { getUserProfile, uploadPhoto, saveUserInfo } from '@/api/user' // 引入获取用户个人信息的接口   引入修改用户头像的接口   引入保存更改的接口
import { mapMutations } from 'vuex'// 引入vuex中的mapMutations
import dayjs from 'dayjs'
export default {
  data () {
    return {
      showPhoto: false, // 是否显示头像弹层
      showName: false, // 是否显示昵称弹层
      showGender: false, // 是否显示性别弹层
      showBirthDay: false, // 是否显示日期弹层
      minDate: new Date(1900, 1, 1), // 日期组件可以显示的最小时间
      maxDate: new Date(), // 日期组件可以显示的最大时间
      currentDate: new Date(), // 打开日期组件的时候,显示当前时间
      actions: [{ name: '男' }, { name: '女' }], // 性别下拉菜单中的各选项
      errorMessage: '', // 输入框的错误信息
      user: {
        name: '',
        photo: '',
        gender: '',
        birthday: ''
      } // 用于存放个人信息
    }
  },
  methods: {
    ...mapMutations(['updateIMG']), // 引入vuex中修改用户头像的方法
    async getUserProfile () {
      this.user = await getUserProfile()
    },

    // 点击昵称组件内的确定按钮时
    nameBtn () {
      // 如果昵称弹层内的输入框内容长度不在1-7之间,就要显示错误信息,并直接返回
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.errorMessage = '用户名的长度必须在1-7之间'
        return
      }
      this.errorMessage = ''// 清空错误信息
      this.showName = false // 关闭昵称组件
    },

    // 点击性别选择组件里面的任意选项时
    // van-action-sheet组件的select事件
    selectGender (item, index) {
      this.showGender = false // 关闭性别选择弹层
      this.user.gender = index
    },
    // 显示日期弹层组件
    showDate () {
      this.showBirthDay = true
      this.currentDate = new Date(this.user.birthday)
    },

    // 点击日期选择组件的确定按钮时
    confirmTime () {
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
      this.showBirthDay = false
    },

    // 点击上传头像的文字时
    clickUpload () {
      this.$refs.photoFile.click() // 触发input:file的click事件 触发事件就会弹出文件对话框
    },
    // 当input文件上传框发生变化时,代表在上传头像
    async uploadPhoto () {
      const fd = new FormData()
      fd.append('photo', this.$refs.photoFile.files[0])// 选择的图片文件 选择图片文件
      const res = await uploadPhoto(fd)
      this.user.photo = res.photo// 把成功上传的头像地址设置给当前data中的数据
      this.updateIMG({ photo: res.photo }) // 将最新的头像地址设置给 vuex数据
      this.showPhoto = false// 关闭头像弹层组件
    },

    // 点击保存按钮时,上传更改后的信息
    async  save () {
      try {
        await saveUserInfo(this.user)// 请求接口
        this.$shnnotify({ type: 'success', message: '保存成功' })
        this.$router.go(-1)
      } catch (error) {
        this.$shnnotify({ message: '保存失败' })
      }
    }
  },
  created () {
    this.getUserProfile()
  }
}
</script>

<style>
</style>
