// 这是导购管理
export default [
    {
        path: '/guides',
        component: () => import('@/components/guide/guidelist/GuideList.vue'),
        meta: { requireAuth: true, title: '导购员管理' },
        name: 'guides'
      },  {
        path: '/aeguide',
        component:  () => import('@/components/guide/guidelist/AEGuide.vue'),
        meta: { requireAuth: true, title: '导购员编辑' },
        name: 'aeguide'
      },    {
        path: '/guidestep',
        component: () => import('@/components/guide/guidestep/GuideStep.vue'),
        meta: { requireAuth: true, title: '导购等级' },
        name: 'guidestep'
      },   {
        path: '/aeguidestep',
        component: () => import('@/components/guide/guidestep/AEGuideStep.vue'),
        meta: { requireAuth: true, title: '导购等级编辑' },
        name: 'aeguidestep'
      },  {
        path: '/commissiondetail',
        component:  () => import('@/components/guide/guidedetail/GuideDetail.vue'),
        meta: { requireAuth: true, title: '提成明细' },
        name: 'commissiondetail'
      },  {
        path: '/commissiontotal',
        component: () => import('@/components/guide/commissiontotal/CommTotal.vue'),
        meta: { requireAuth: true, title: '提成统计' },
        name: 'commissiontotal'
      },
]