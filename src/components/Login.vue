<template>
  <div class="login_container">
        <!-- <canvas id="canvas"></canvas> -->
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avator_box">
        <img src="../assets/logo_login.png" alt="" class="logo1">
        <img src="../assets/login_bg1.png" alt="" />
      </div>
      <!-- 登录表单区 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <p class="login_a">您好！</p>
        <p class="login_title">欢迎登录智鲜云后台管理系统</p>
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
            @keyup.enter.native="login"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login" :disabled="isDisabled">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
        <a class="login_forgot" @click="getPassword">忘记密码？</a>
      </el-form>
      <!-- <wxlogin v-if="backUrl !== null && state !== null"
        :appid="$store.getters.wechatAppId"
        :theme="'black'"
        :redirect_uri="backUrl"
        :scope="'snsapi_login'"
        :state="state"
        :href="'data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHsNCiAgZGlzcGxheTogbm9uZTsNCn0NCi5pbXBvd2VyQm94IC5zdGF0dXMuc3RhdHVzX2Jyb3dzZXIgew0KICBkaXNwbGF5OiBub25lOw0KfQ0KLmltcG93ZXJCb3ggLnFyY29kZSB7DQogIGJvcmRlcjogbm9uZTsNCiAgd2lkdGg6IDIwMHB4Ow0KICBoZWlnaHQ6IDIwMHB4Ow0KfQ0KLmltcG93ZXJCb3ggLnN0YXR1c3sNCiAgZGlzcGxheTogbm9uZQ0KfQ=='" rel="external nofollow"
      >
      </wxlogin> -->
    </div>
    <!-- 忘记密码对话框 -->
    <el-dialog
      title="找回密码"
      :visible.sync="passwordDialogVisible"
      width="650px"
      center>
      <div>
        <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px" class="dialog_form">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="passwordForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="passwordForm.code"></el-input>
            <el-button @click="getCode">{{count}}</el-button>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordForm.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="conPassword">
            <el-input v-model="passwordForm.conPassword"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getNewPassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 组件中引入
// import wxlogin from 'vue-wxlogin'
export default {
    mounted() {
	// var canvas = document.getElementById('canvas')
	// var context = canvas.getContext('2d')
	// var W = window.innerWidth
	// var H = window.innerHeight
	// canvas.width = W
	// canvas.height = H
	// var fontSize = 18
	// var colunms = Math.floor(W/fontSize)
	// var drops = []
	// for(var i = 0; i<colunms; i++){
	// 	drops.push(0)
	// }
	// var str = '0123456789qwertyuiopasdfghjklzxcvbnm'
	
	// function draw(canvas,context,W,H,fontSize,colunms,str,drops){
		
	// }
	// function randColor (){
	// 	var r = Math.floor(Math.random() * 256)
	// 	var g = Math.floor(Math.random() * 256)
	// 	var b = Math.floor(Math.random() * 256)
	// 	return "rgb(" + r + "," + g + "," + b + ")"
	// }
	// draw()
	// setInterval(()=>{
	// 	context.fillStyle = 'rgba(0,0,0,0.05)'
	// 	context.fillRect(0,0,W,H)
	// 	context.font = '0' + fontSize + 'px 微软雅黑'
	// 	context.fillStyle = '#00cc33'
	// 	for(var i = 0; i<colunms; i++){
	// 		var index = Math.floor(Math.random() * str.length)
	// 		var x = i * fontSize
	// 		var y = drops[i] * fontSize
	// 		context.fillText(str[index],x,y)
	// 		if(y >= canvas.height && Math.random() > 0.99){
	// 			drops[i] = 0
	// 		}else{
	// 			drops[i]++
	// 		}
	// 	}
	// },30)
  },
  // components: { wxlogin },
  data () {
    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 这是表单的验证规则
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在3到15个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
        ]
      },
      // 找回密码对话框显隐
      passwordDialogVisible: false,
      passwordForm: {},
      regCode: '',
      passwordRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '长度是6个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        conPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' }
        ]
      },
      count: '获取验证码',
      timer: null,
      isDisabled: false,
      state: null,
      backUrl: null
    }
  },
  created () {
    // const { data: res } = await this.$http.get('mapi/login/weixin')
    // console.log(res)
    // this.getUserInfo()
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    // 登录预验证
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        this.isDisabled = true
        // 如果返回结果是Promise,可以用async或者await 简化json Promise操作  await只能用在被async修饰的方法中
        const { data: res } = await this.$http.post('mapi/index/log', this.loginForm)
        // console.log(res)
        this.isDisabled = false
        if (res.status !== 1) return this.$message.error('登陆失败')
        // window.sessionStorage.setItem('token', res.token)
        window.sessionStorage.setItem('username', res.data.name)
        window.sessionStorage.setItem('account', res.data.phone)
        this.$store.commit('addToken', res.token)
        this.$store.commit('addUserInfo', res.data)
        this.$message.success('登陆成功')
        // 1.登陆成功之后的token,保存到客户端的sessionStorage中
        //  1.1 项目中除了登录之外的其他API接口,必须登录之后才能访问
        //  1.2 token 只应在当前网站打开期间生效，所以讲token 保存在 sessionStorage 中
        // 2.通过编程式导航跳转到后台主页，路由地址是 /home

        this.$router.push('/home')
      })
    },
    // 找回密码
    getPassword () {
      this.passwordDialogVisible = true
    },
    // 获取手机验证码
    getCode () {
      const TIME_COUNT = 60
      // console.log(111)
      if (!this.timer) {
        this.count = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            clearInterval(this.timer)
            this.timer = null
            this.count = '获取验证码'
          }
        }, 1000)
      }
    },
    // 获取新的密码
    getNewPassword () {
      this.$refs.passwordFormRef.validate(async valid => {
        // if (!valid) return
        // const { data: res } = await this.$http.post('/manage/index/getCode', this.passwordForm)
        // console.log(res)
      })
    }
    // async getUserInfo () {
    //   const { data: res } = await this.$http.get('mapi/login/backurl')
    //   console.log(res)
    //   this.state = res.state
    //   // eslint-disable-next-line no-undef
    //   this.backUrl = encodeURIComponent(res.backurl)
    //   console.log(this.backUrl)
    //   console.log(this.state)
    // }
  },
  beforeDestroy(){
  },
  destroyed(){
  }
}
</script>
<style lang="less" scoped>
// #canvas{
// 	background: #111;
// 	z-index: 1;
// 	position: absolute;
// 	left: 0;
// 	top: 0;
// 	width: 100%;
// 	height: 100%;
// }
.login_container {
  background: url(../assets/loginbg.jpg) no-repeat left top;
  height: 100%;
  background-size:100% 100%;
}
.login_box {
  position: relative;
  z-index: 10;
  width:610px;
  padding:50px 30px;
  background-color: #fff;
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  .avator_box {
    width: 240px;
    float: left;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
    }
    .logo1 {
      padding-bottom:20px;
    }
  }
  .login_form {
    float: right;
    width: 300px;
    box-sizing: border-box;
   }
}
.login_a {
  font-size:22px;
  font-weight: bold;
  padding-bottom: 7px;
  color:#666E80;
}
.login_title{
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 30px;
  color:#666E80;
}
.login_forgot{
  color: #979FB2;
  font-size: 12px;
  text-align: right;
  display: block;
  &:hover {
    text-decoration: underline;
    color:#337ab7;
    cursor: pointer;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.dialog_form {
  .el-input{
    width: 70%;
  }
  .el-button {
    margin-left:10px;
  }
}
</style>
