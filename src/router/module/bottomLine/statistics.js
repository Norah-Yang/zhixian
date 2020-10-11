// 这是会员卡统计
export default [
    {
        path: '/membertotal',
        component: () => import('@/components/member/membertotal/membertotal.vue'),
        meta: {
          requireAuth: true,
          title: '收银统计'
        },
        name: 'membertotal'
      },
      {
        path: '/shoptotal',
        component: () => import('@/components/member/membertotal/shoptotal.vue'),
        meta: {
          requireAuth: true,
          title: '门店统计'
        },
        name: 'shoptotal'
      },
]