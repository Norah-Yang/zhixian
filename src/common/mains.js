import axios from 'axios'
import router from '@/router'
import Vue from 'vue'
import store from '@/store'
import apis from "@/common/api"
import * as requests from "@/common/request"
// 导入NProgress包对应的js和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import _ from 'lodash'
// 把两个对象合并一个对像
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
//省市区三级联动插件
import 'vue-area-linkage/dist/index.css'; // v2 or higher
import VueAreaLinkage from 'vue-area-linkage'
Vue.use(VueAreaLinkage)
NProgress.configure({
  showSpinner: false
});
router.beforeEach((to, from, next) => {
    // 这段代码是防止如果用户没有这个页面的权限,用户通过浏览器地址栏跳转到别的页面 
  if (store.state.toArr.some(x => {
      return x == to.path
    })) {
    if (!store.state.fromArr.some(x => {
        return x.from == from.path&&x.to == to.path
      })) {
      router.push("/welcome").catch(err => {
        console.log(err);
      })
    } else {

    }
  }
  store.state.token = sessionStorage.getItem('token')
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 判断该路由是否需要登录权限
  if (to.matched.some(function (item) {
      return item.meta.requireAuth
    })) {
    if (store.state.token != null) {
      // 通过vuex state获取当前的token是否存
      if (Object.keys(from.query).length === 0) { // 判断路由来源是否有query，处理不是目的跳转的情况
        next()
      } else {
        const redirect = from.query.redirect // 如果来源路由有query
        if (to.path === redirect) { // 这行是解决next无限循环的问题
          next()
        } else {
          next({
            path: redirect
          }) // 跳转到目的路由
        }
      }
      // next();
    } else {
      next({
        // 将跳转的路由path作为参数，登录成功后跳转到该路由
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})
// 配置请求的根路径
// 环境的切换
// if (process.env.NODE_ENV == 'development') {
//     axios.defaults.baseURL = 'https://manage.zhixianyun.cn/'
//   } else if (process.env.NODE_ENV == 'production') {
//     axios.defaults.baseURL = 'https://manage.zhixianyun.cn/'
//   }
axios.defaults.baseURL = 'https://manage.zhixianyun.cn/'
// 切换开发者模式和线上模式 上传图片的问题
if (process.env.NODE_ENV == 'development') {    
  Vue.prototype.$uplaadUrl="mapi/upload/pic"
  } 
else if (process.env.NODE_ENV == 'production') {    
  Vue.prototype.$uplaadUrl = 'https://manage.zhixianyun.cn/mapi/upload/pic';
}
axios.defaults.timeout = 30000;
// axois请求拦截
// 在request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')||""
  // 在最后必须 return config
  return config
})
// 在 response拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  // 在最后必须 return config
  // 判断登录是否过期
  if (config.data.code == 403) {
    Vue.prototype.$message.error(config.data.msg)
    router.push("/login").catch(err => {
      console.log(err);
    })
  }
  return config
})
Vue.prototype.$http = axios
// 封装所有的API接口  把两个对象改成一个对象
let api=_.assign(requests,apis);

Vue.prototype.$api = api
Vue.prototype.$_ =_
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: 'GeqGLzskaUhS1mVueYcEfUUd'
});
Vue.prototype.$api.error = (data) => {
  Vue.prototype.$message.error(data || "网络错误");
}

// 阻止用户多次点击
Vue.directive('noClick', {
  inserted(el, binding) {
    el.addEventListener('click', e => {
      el.classList.add('is-disabled');
      el.disabled = true;
      setTimeout(() => {
        el.disabled = false;
        el.classList.remove('is-disabled');
      }, binding.value || 1000)
    })
  }
});
//滚动条插件
import { HappyScroll } from 'vue-happy-scroll'
//自定义组件名
Vue.component('happy-scroll', HappyScroll)
// 引入css
import 'vue-happy-scroll/docs/happy-scroll.css'

