// 这是小程序设置
export default [
    {
        path: "/microcommunities",
        component:  () => import ("@/views/weChart/setwechat/microcommunities/microcommunities.vue"),
        meta: {
          requireAuth: true,
          title: "微社区配置"
        },
        name: "microcommunities"
      },  {
        path: "/miniprograminform",
        component: () => import ("@/views/weChart/setwechat/miniprograminform/miniprograminform.vue"),
        meta: {
          requireAuth: true,
          title: "小程序通知"
        },
        name: "miniprograminform"
      },   {
        path: "/miniprogramsubscript",
        component: () => import ("@/views/weChart/setwechat/miniprogramsubscript/miniprogramsubscript.vue"),
        meta: {
          requireAuth: true,
          title: "小程序订阅消息"
        },
        name: "miniprogramsubscript"
      },
]