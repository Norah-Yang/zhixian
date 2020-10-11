// 这是新闻管理
export default [
   {
        path: "/newsmanagement",
        component:  () => import ("@/views/weChart/news/newsmanagement/newsmanagement.vue"),
        meta: {
          requireAuth: true,
          title: "新闻管理"
        },
        name: "newsmanagement"
      },  {
        path: "/addnewsmanagement",
        component:  () => import ("@/views/weChart/news/newsmanagement/addnewsmanagement.vue"),
        meta: {
          requireAuth: true,
          title: "新闻管理编辑"
        },
        name: "addnewsmanagement"
      },
      {
        path: "/helpcate",
        component: () => import ("@/views/weChart/news/helpcate/helpcate.vue"),
        meta: {
          requireAuth: true,
          title: "帮助分类"
        },
        name: "helpcate"
      },   {
        path: "/addhelpcate",
        component: () => import ("@/views/weChart/news/helpcate/addhelpcate.vue"),
        meta: {
          requireAuth: true,
          title: "新增帮助分类"
        },
        name: "addhelpcate"
      },  {
        path: "/helpmanagement",
        component: () => import ("@/views/weChart/news/helpmanagement/helpmanagement.vue"),
        meta: {
          requireAuth: true,
          title: "帮助管理"
        },
        name: "helpmanagement"
      },
      {
        path: "/addhelpmanagement",
        component: () => import ("@/views/weChart/news/helpmanagement/addhelpmanagement.vue"),
        meta: {
          requireAuth: true,
          title: "新增帮助管理"
        },
        name: "addhelpmanagement"
      },
]