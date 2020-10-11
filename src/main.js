import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// element ui按需导入
import './plugins/element.js'
// 导入全局样式
import './assets/fonts/iconfont.css'
// 全局公共样式文件
import './assets/css/global.css'
// 自定义element颜色
import './assets/css/element-variables.scss'


// 拆分的man.js文件
import '@/common/mains'
import moment from "moment";
Vue.prototype.$moment = moment
//定义一个全局过滤器实现日期格式化
Vue.filter('datefmt',function (input,fmtstring) {
  // 使用momentjs这个日期格式化类库实现日期的格式化功能
  return moment.unix(input).format(fmtstring);
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 完全空白的项目初始化
// #git初始化
// git init
// #设置remote地址
// git remote add 地址
// #将全部文件加入git版本管理 .的意思是将当前文件夹下的全部文件放到版本管理中
// git add .
// #提交文件 使用-m 编写注释
// git commit -m "注释"
// #推送到远程分支
// git push
 
 
 
// 已有线上仓库的初始化
// #git初始化
// git init
// #设置remote地址
// git remote add  origin 网络地址
// #获取远程仓库master分支上的内容
// git pull origin master
// #将当前分支设置为远程仓库的master分支
// git branch --set-upstream-to=origin/master master
// #将全部文件加入git版本管理 .的意思是将当前文件夹下的全部文件放到版本管理中
// git add .
// #提交文件 使用-m 编写注释
// git commit -m "注释"
// #推送到远程分支
// git push
 
// 4、把远程分支拉到本地
 
// git fetch origin dev（dev为远程仓库的分支名）可以把远程的分支拉取到本地
 
// 下图红色勾选的为可使用的分支名
// 5、在本地创建分支dev并切换到该分支
 
// git checkout -b dev(本地分支名称) origin/dev(远程分支名称)
 
 
// 6、把某个分支上的内容都拉取到本地
 
// git pull origin dev(远程分支名称)