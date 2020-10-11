// 这是销售统计
export default [
    {
        path: "/shopmarket",
        component: () => import ("@/views/weChart/shop/shopmarket/shopmarket.vue"),
        meta: {
          requireAuth: true,
          title: "店点统计"
        },
        name: "shopmarket"
      },  {
        path: "/marketdaily",
        component: () => import ("@/views/weChart/shop/marketdaily/marketdaily.vue"),
        meta: {
          requireAuth: true,
          title: "销售日报"
        },
        name: "marketdaily"
      },
]