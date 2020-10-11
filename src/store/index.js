import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import _ from 'lodash'
export default new Vuex.Store({
  state: {
    appId: 'wx5a21e415da03ac06',
    baseUrl: '/',
    userId: '',
    token: '',
    userInfo:{},
    index: 1,
    authcurent: [],
    tabview: [
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ],
    fromArr: [{
      from: "/seckill",
      to: "/addseckill"
    }, {
      to: "/addtuan",
      from: "/tuan"
    }, {
      to: "/fafang",
      from: "/coupon"
    },
     {
      to: "/addscoregoods",
      from: "/scoregoods"
    },
    {
     to: "/addgoods",
     from: "/goodslisttwo"
   },
   {
    to: "/addmember",
    from: "/memberManagement"
  },
  {
   to: "/addaddress",
   from: "/memberManagement"
 }
  
  ], //用户来的页面
    toArr: ["/fafang", "/addtuan", "/addseckill","/addscoregoods","/addgoods","/addmember","/addaddress"], //用户要去的页面
    // "/addscoregoods"
  },
  getters: {
    wechatAppId(state) {
      return state.appId
    },
    baseUrl(state) {
      return state.baseUrl
    }
  },
  mutations: {
    addToken(state, token) {
      window.sessionStorage.setItem('token', token)
      state.token = token
    },
    removeToken(state, token) {
      window.sessionStorage.removeItem('token')
      state.token = undefined
    },
    // 动态获取左侧菜单栏数组
    getauthcurent(state, options) {
      state.authcurent = options
    },
    // 获取头部菜单栏数组的索引
    getTabIndex(state, index) {
      state.index = index
    },
    addUserInfo(state,userInfo){
      // window.sessionStorage.setItem('', token)
      state.userInfo = userInfo
    },
    // 这个函数是标签页处理函数 根据头部导航栏菜单显示不同标签
    gettabview(state, e) {
      e = e.slice(1)
      let item = null
      //  递归函数 找出当前路由在左侧菜单哪一项
      function fun(data) {
        data.forEach(x => {
          if (x.path == e) {
            item = x
          }
          // console.log(x.submenu);
          // fun(x.submenu);
          if (x.submenu) {
            if (x.submenu.length > 0) {
              fun(x.submenu);

            }
          }
        });
      }
      let data = _.cloneDeep(state.authcurent);
      fun(data)
      // 判断item有没有被赋值

      if (item) {
        // 当前路由是否在vuex中
        let issome = state.tabview[state.index].some(x => {
          return x.id == item.id
        })
        if (!issome) {
          state.tabview[state.index].unshift(item)

        }
      }

    },
  },
  actions: {},
  modules: {}
})
