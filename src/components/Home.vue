<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header_left">
        <div class="header_img" :style="isCollapse? 'width:60px': 'width:200px'">
          <img src="../assets/logo_login.png" alt="" width="200">
        </div>
        <!-- <span>电商后台管理系统</span> -->
        <div class="header_switch" @click="toggleCollapse">
          <i :class="isclass"></i>
        </div>
        <div>
          <el-menu
            class="el-menu-demo"
            mode="horizontal"
            :default-active="menuindex"
            background-color="#263238"
            text-color="#fff"
            @select="onselectMenu"
            active-text-color="#008080"
          >
            <el-menu-item
              :index="item.id+''"
              v-for="(item,index) in headerList "
              :key="index"
            >{{item.title}}</el-menu-item>
          </el-menu>
        </div>
      </div>
      <div class="userInfo">
        <span class="user_landtime">{{nowTime}}</span>
        <ScreenFull :width="50" :height="50" :fill="'#FFFFFF'"/>
        <img src="../assets/headimg.png" alt="">
        <div class="u_box">
          <span class="user">
            角色：{{userName}}
          </span>
          <span>账号：{{account}}</span>
        </div>
        <!-- <el-button type="info" @click="logout" v-no-click>退出</el-button> -->
        <el-dropdown :hide-on-click="false">
          <span class="el-dropdown-link">
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item > 
              <span @click="changePass" class="block">修改密码</span>      
            </el-dropdown-item>
            <el-dropdown-item >    
              <span @click="logout"  class="block">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <!-- <div class="toggle-button">|||</div> -->
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#263238"
          text-color="#fff"
          active-text-color="#008080"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          @select="onselectMenus"
          router
          :default-active="activePath"
          ref="menus"
          class="menus"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="item.icon" class="iconfont"></i>
              <!-- 文本 -->
              <span>{{item.title}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.submenu"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i :class="subItem.icon " class="iconfont"></i>
                <!-- 文本 -->
                <span>{{subItem.title}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
          <happy-scroll color="rgba(0,0,0,0.5)" size="10" resize hide-horizontal>
            <div style="width:100% " class="main">
              <tabviews @onclose="onclose" @onhome="onhome"></tabviews>
              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            </div>
          </happy-scroll>
          <el-dialog title="修改密码" :visible.sync="dialogpasswordVisible"  @close="dialogClose">
            <el-form :model="passwordForm" :rules="passwordFormRules"  ref="passwordForm">
              <el-form-item label="旧密码" :label-width="formLabelWidth">
                <el-input v-model="passwordForm.oldPassword" autocomplete="off"  show-password></el-input>
              </el-form-item>
              <el-form-item label="新密码" :label-width="formLabelWidth">
                <el-input v-model="passwordForm.newPassword" autocomplete="off"  show-password></el-input>
              </el-form-item>
              <el-form-item label="确认密码" :label-width="formLabelWidth">
                <el-input v-model="passwordForm.confirmPassword" autocomplete="off"  show-password></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogpasswordVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit('passwordForm')">确 定</el-button>
            </div>
          </el-dialog>
      </el-main>
      <!-- <el-footer>©Copyright 西安卓越网络科技有限公司 (www.cnzhuoyue.cn) 版权所有</el-footer> -->
    </el-container>
    <el-footer :class="isCollapse?'footML64':'footML200'">
      ©Copyright 科豹软件（www.keopard.com） 版权所有
      <span :class="isCollapse?'footML64':'footML200'"></span>
    </el-footer>
  </el-container>
</template>

<script>
import ScreenFull from "./screenfull/index";
import tabviews from "@/views/components/home/tabview/tabview";
// eslint-disable-next-line no-unused-vars
import { mapState, mapMutations } from "vuex";
// eslint-disable-next-line no-unused-vars
// import { log } from 'util'
export default {
  components: {
    ScreenFull,
    tabviews
  },
  data() {
    return {
      headerList: [],
      menuindex: sessionStorage.getItem("menuindex") || "1",
      // 左侧菜单数据
      menulist: [],
      isclass: "el-icon-s-fold",
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: "",
      userName: "",
      account: '',
      nowTime: "",
      dialogpasswordVisible:false,
      passwordForm:{
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordFormRules:{
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px'
    };
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
    this.userName = window.sessionStorage.getItem("username");
    this.account = window.sessionStorage.getItem("account");
    // this.nowTime = this.getNowDate(new Date());
    this.getmenu();
    setInterval(() => {
      this.nowTime = this.getNowDate(new Date());
    }, 1000);
  },
  methods: {
    ...mapMutations(["getTabIndex", "getauthcurent", "gettabview"]),
    logout() {
      this.$confirm("确定退出智鲜后台管理系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          window.sessionStorage.clear();
          this.$router.push("/login");
        })
        .catch(() => {
          return false;
        });
        
    },
    // 获取所有的菜单
    async getMenuList() {
      // 因为get获取到的是一个Promise对象,为了简化操作可以用async和await
      // console.log('sadfasd')
      const { data: res } = await this.$http.get("mapi/index/column");
      // console.log(res);
      if (res.status !== 1) return this.$message.error(res.msg);
      this.menulist = res.data;
      this.getauthcurent(res.data);
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {
        this.isclass = "el-icon-s-unfold";
      } else {
        this.isclass = "el-icon-s-fold";
      }
      // el-icon-s-unfold
    },
    //  保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    getNowDate(date) {
      return (
        date.getFullYear() +
        "年" +
        (date.getMonth() + 1) +
        "月" +
        date.getDate() +
        "日 " +
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
        ":" +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":" +
        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds())
      );
    },
    // 获取导航栏菜单
    getmenu() {
      this.$api
        .getmenu({})
        .then(res => {
          // eslint-disable-next-line eqeqeq
          if (res.data.code == 200) {
            this.headerList = res.data.data;
            // 防止页面刷新页面上导航栏数据丢失
            if (sessionStorage.getItem("menuindex")) {
              this.onselectMenu(sessionStorage.getItem("menuindex"));
            } else {
              this.getMenuList();
            }
          }
        })
        .catch(res => {});
    },
    // 点击头部menu发送请求更改左侧菜单栏
    onselectMenu(e) {
      this.getTabIndex(e);
      this.menuindex = e;
      sessionStorage.setItem("menuindex", e);
      const index = this.headerList.find(x => {
        // eslint-disable-next-line eqeqeq
        return x.id == e;
      });
      this.$api
        .getmenuaside({
          params: {
            id: index.id
          }
        })
        .then(res => {
          // eslint-disable-next-line eqeqeq
          if (res.data.code == 200) {
            this.menulist = res.data.data;
            this.getauthcurent(res.data.data);
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    // 点击把当前导航栏menu索引传到vuex
    onselectMenus(e) {
      this.gettabview(e);
    },
    // 点击标签页跳转路由页面
    onclose(e) {
      // console.log(e);
      e = "/" + e;
      this.activePath = e;
    },
    // 打开home配置项
    onhome() {
      this.activePath = "/home";
      this.menuindex = "1";
      this.onselectMenu("1");
      this.$router.push("/home").catch(res => {});
    },
    // 修改密码
    changePass(){
      this.dialogpasswordVisible = true
    },
    // 关闭弹框
    dialogClose(){
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    onSubmit(formName){
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // eslint-disable-next-line camelcase
          if(this.passwordForm.newPassword !== this.passwordForm.confirmPassword){
            return this.$message.warning('两次输入新密码不一致，请重新输入')
          }
            const { data: res } = await this.$http.post('mapi/updatePassword', this.passwordForm)
            if (res.code !== 200) return this.$message.error(res.msg)
            this.$message.success('修改成功')
            this.dialogmerchantVisible = false;
            this.$router.push('login')
         
        } else {
          this.$message.warning('请检查是否填写完善！！')
          return false
        }
      })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../assets/css/font_1776542_oqnmvpe88k/iconfont.css";
@import "../assets/fonts/font_1782236_fobzya54zhj/iconfont.css";
// 线下字体图标
@import "../assets/fonts/font_1935443_ysn2ei2rv9/iconfont.css";
@import "../assets/fonts/font_1935616_luskwhk6ypa/iconfont.css";

.home-container {
  height: 100%;
  // transition: all .8s;
  // &:hover{
  //   transform: rotate(720deg)
  // }
}
.el-header {
  background-color: #263238;
  display: flex;
  justify-content: space-between;
  padding: 0 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  .header_left {
    display: flex;
    .header_img {
      width: 200px;
      height: 60px;
      img {
        width: 200px;
        height: 100%;
      }
    }
  }
  .header_switch {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    background: #263238;
    cursor: pointer;
    height: 60px;
    // i{
    //   transition: all .6s;
    // }
    //   i:hover{
    //     transform:scale(2);
    //   }
  }
  > div.userInfo {
    display: flex;
    align-items: center;
    img {
      width: 40px;
      vertical-align: middle;
      margin-right: 15px;
    }
    .u_box {
      display: flex;
      flex-direction: column;
      span {
        margin-right: 20px;
        font-size: 14px;
        i {
          font-size: 16px;
          font-style: normal;
        }
      }
      
    }
  }
}
span.user_landtime {
        font-size: 12px;
        margin-right:20px;
      }
.el-container {
  height: 100%;
  overflow: hidden;
}
.el-aside {
  background-color: #263238;
  height: 100%;
  overflow-x: hidden;
  transition: all 0.4s;
  &::-webkit-scrollbar {
    display: none;
  }
  .menus.el-menu {
    border-right: none;
    /deep/ .el-submenu{
      .el-submenu__title{
        height: 45px;
        line-height: 45px;
      }
    }
    /deep/ .el-menu-item{
      height: 40px;
      line-height: 40px;
    }
  }
  i{
    font-size: 20px;
    margin-right: 5px;
  }
}
.el-main {
  position: relative;
  margin-bottom: 30px;
   background-color: #EAEDF1;
  /deep/ .happy-scroll-container{
    width: 100% !important;
  }
  /deep/ .happy-scroll-content{
       width: 100% !important;
  }
  padding:5px;
}
.main {
  /deep/  .el-card {
  .el-card__body{
    padding: 5px;
    .el-table {
      font-size:12px;
      .cell{
       white-space: nowrap;
     }
    }
    .el-table th, .el-table td{
      padding: 0 0;
    }
    .el-form {
      .el-form-item{
        margin-bottom: 15px;
        .el-form-item__error{
          padding-top:2px;
        }
        .el-form-item__label{
          height: 30px;
          line-height: 30px;
        }
        .el-form-item__content{
          line-height: 30px;
          .el-input__inner{
            height: 30px;
            line-height: 30px;
          }
          .el-select .el-input .el-select__caret{
            line-height: 30px;
          }
          .el-input__icon{
            line-height: 30px;
          }
        }
      }
    }
  }
}
 /deep/ .el-dialog{
   .el-table{
     font-size:12px;
     th, td{
       padding:0 0;
     }
     .cell{
       white-space: nowrap;
     }
   }
 }
}

.toggle-button {
  background-color: #263238;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-100px);
}
.fade-leave-to{
   opacity: 0;
  transform: translateX(100px);
}
.el-footer {
  height: 30px !important;
  width: 100%;
  transition: all 0.4s;
  text-align: center;
  font-size: 14px;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #ccc;
  line-height: 30px;
  background: #fff;
  margin-left: 200px;
}
.footML64 {
  margin-left: 64px;
}
.footML200 {
  margin-left: 200px;
}
.el-dropdown{
  color: #fff;
  cursor: pointer;
  
}
.el-dropdown-menu__item{
  padding:0;
   .block{padding:0 20px;display: block;} 
  }
.el-input-group__append {
    padding: 0 10px !important;
}
</style>
