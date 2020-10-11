// 这是订单管理
export default [
    {
        path: '/weiorderlist',
        component: () => import('@/views/weChart/wxrder/weiorderlist.vue'),
        meta: {
          requireAuth: true,
          title: "订单列表"
        },
        name: 'weiorderlist'
      },    {
        path: '/weituanorderlist',
        name: 'weituanorderlist',
        component: () => import('@/views/weChart/wxgoods/weituanorderlist/weituanorderlist.vue'),
        meta: {
          requireAuth: true,
          title: '团购列表'
        }
      },  {
        path: "/craftold",
        component:  () => import ("@/views/weChart/oder/craftold/craftold.vue"),
        meta: {
          requireAuth: true,
          title: "手工下单（旧）"
        },
        name: "craftold"
      },   {
        path: "/craft",
        component:  () => import ("@/views/weChart/oder/craft/craft.vue"),
        meta: {
          requireAuth: true,
          title: "手工下单"
        },
        name: "craft"
      },  {
        path: "/delivergoods",
        component: () => import ("@/views/weChart/oder/delivergoods/delivergoods.vue"),
        meta: {
          requireAuth: true,
          title: "批量发货"
        },
        name: "delivergoods"
      },  {
        path: "/stockup",
        component:  () => import ("@/views/weChart/oder/stockup/stockup.vue"),
        meta: {
          requireAuth: true,
          title: "备货清单"
        },
        name: "stockup"
      },
]