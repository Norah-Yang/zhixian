// 这是订单页面
export default [
    {
        path: '/orders',
        component:  () => import('@/components/order/OrderList.vue'),
        meta: {
          requireAuth: true,
          title: "订单列表"
        },
        name: 'orders'
      },   {
        path: '/account',
        component: () => import('@/components/order/BuyingCredit.vue'),
        meta: {
          requireAuth: true,
          title: '挂账列表'
        },
        name: 'account'
      },
]