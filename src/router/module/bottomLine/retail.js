// 这是零售统计
export default [
      {
        path: '/retails',
        component:  () => import('@/components/retail/retails/retails.vue'),
        meta: {
          requireAuth: true,
          title: "收银日报"
        },
        name: 'retails'
      }, {
        path: '/shopsreports',
        component:  () => import('@/components/retail/shopsreports/shopsreports.vue'),
        meta: {
          requireAuth: true,
          title: "门店日报"
        },
        name: 'shopsreports'
      },
    {
        path: '/salesdetail',
        component:  () => import('@/components/retail/salesdetail/salesdetail.vue'),
        meta: {
          requireAuth: true,
          title: "销售明细"
        },
        name: 'salesdetail'
      },
      {
        path: '/accountdetails',
        component: () => import(/* webpackChunkName: "OnaccountDetail" */'@/components/retail/onaccountdetail/OnaccountDetail.vue'),
        meta: { requireAuth: true, title: '挂账明细' },
        name: 'accountdetails'
      },
      {
        path: '/paymentdetails',
        component: () => import(/* webpackChunkName: "PaymentDetail" */'@/components/retail/paymentdetail/PaymentDetail.vue'),
        meta: { requireAuth: true, title: '付款明细' },
        name: 'paymentdetails'
      },
      {
        path: '/salesreports',
        component: () => import(/* webpackChunkName: "SaleReports" */'@/components/retail/salereports/SaleReports.vue'),
        meta: { requireAuth: true, title: '销售日报' },
        name: 'salesreports'
      }
          
]