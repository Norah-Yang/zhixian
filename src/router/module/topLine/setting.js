// 这是系统设置
export default [
    {
        path: '/weibasicsetting',
        component: () => import('@/views/weChart/systemSettings/weibasicsetting/weibasicsetting.vue'),
        meta: {
          requireAuth: true,
          title: '基本设置'
        },
        name: 'weibasicsetting'
      },  {
        path: '/weicommonsetting',
        component: () => import('@/views/weChart/systemSettings/weicommonsetting/weicommonsetting.vue'),
        meta: {
          requireAuth: true,
          title: '通用设置'
        },
        name: 'weicommonsetting'
      },    {
        path: '/lineshop',
        component:  () => import('@/views/weChart/systemSettings/lineshop/lineshop.vue'),
        meta: {
          requireAuth: true,
          title: '收货地址管理'
        },
        name: 'lineshop'
      },  {
        path: '/addlineshop',
        component: () => import('@/views/weChart/systemSettings/lineshop/addlineshop.vue'),
        meta: {
          requireAuth: true,
          title: '添加收货地址'
        },
        name: 'addlineshop'
      },   {
        path: '/lineshoptime',
        component: () => import('@/views/weChart/systemSettings/lineshoptime/lineshoptime.vue'),
        meta: {
          requireAuth: true,
          title: '快递自提点设置'
        },
        name: 'lineshoptime'
      }, {
        path: "/freight",
        component: () => import ("@/views/weChart/systemSettings/freight/freight.vue"),
        meta: {
          requireAuth: true,
          title: "运费模板"
        },
        name: "freight"
      },
   {
    path: "/addfreight",
    component: () => import ("@/views/weChart/systemSettings/freight/addfreight.vue"),
    meta: {
      requireAuth: true,
      title: "添加运费模板"
    },
    name: "addfreight"
  },{
    path:"/sharesetting",
    component:() => import('@/views/weChart/systemSettings/sharesetting/sharesetting.vue'),
    meta:{requireAuth:true,title:"分享设置"},
    name:"sharesetting"
  },   {
    path: "/weiadvertising",
    component: () => import('@/views/weChart/systemSettings/weiadvertising/weiadvertising.vue'),
    meta: {
      requireAuth: true,
      title: "广告管理"
    },
    name: "weiadvertising"
  },{
    path: "/recommend",
    component:  () => import('@/views/weChart/systemSettings/recommend/recommend.vue'),
    meta: {
      requireAuth: true,
      title: "热门推荐"
    },
    name: "recommend"
  },
  {
    path: "/printer",
    component:  () => import ("@/views/weChart/systemSettings/printer/printer.vue"),
    meta: {
      requireAuth: true,
      title: "打印机管理"
    },
    name: "printer"
  }, {
    path: "/weinavigation",
    component:  () => import('@/views/weChart/systemSettings/weinavigation/weinavigation.vue'),
    meta: {
      requireAuth: true,
      title: "导航自定义"
    },
    name: "weinavigation"
  },
]