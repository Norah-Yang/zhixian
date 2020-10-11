// 这是会员卡管理
export default [
    {
        path: '/membercard',
        component:  () => import('@/components/member/memcardtype/MemCardTypeList.vue'),
        meta: { requireAuth: true, title: '会员卡类型' },
        name: 'membercard'
      },
      {
        path: '/addmemcardtype',
        component: () => import('@/components/member/memcardtype/AddMemCardType.vue'),
        meta: { requireAuth: true, title: '会员卡类型添加' },
        name: 'addmemcardtype'
      },    {
        path: '/memcardtypeedit',
        component:  () => import('@/components/member/memcardtype/MemCardTypeEdit.vue'),
        meta: { requireAuth: true, title: '会员卡类型编辑' },
        name: 'memcardtypeedit'
      },   {
        path: '/cardstep',
        component: () => import('@/components/member/memcardstep/MemCardStepList.vue'),
        meta: { requireAuth: true, title: '会员卡等级列表' },
        name: 'cardstep'
      },  {
        path: '/addcardstep',
        component:  () => import('@/components/member/memcardstep/AddMemCardStep.vue'),
        meta: { requireAuth: true, title: '会员卡等级添加' },
        name: 'addcardstep'
      },    {
        path: '/cardlist',
        component: () => import('@/components/member/memlist/MemList.vue'),
        meta: { requireAuth: true, title: '会员卡列表' },
        name: 'cardlist'
      },   {
        path: '/addmemcard',
        component:  () => import('@/components/member/memlist/AddMem.vue'),
        meta: { requireAuth: true, title: '会员卡添加' },
        name: 'addmemcard'
      },  {
        path: '/editmemcard',
        component: () => import('@/components/member/memlist/EditMem.vue'),
        meta: { requireAuth: true, title: '会员卡修改' },
        name: 'editmemcard'
      },   {
        path: '/tradingrecord',
        component: () => import('@/components/member/tradingrecord/TradingRecord.vue'),
        meta: { requireAuth: true, title: '会员卡交易记录' },
        name: 'tradingrecord'
      },  {
        path: '/scorerecord',
        component: () => import('@/components/member/memscore/ScoreDetail.vue'),
        meta: { requireAuth: true, title: '会员卡积分记录' },
        name: 'scorerecord'
      },  
      /* {
        path:"/scorerule",
        component:() => import('@/views/weChart/storedValueRule/scorerule.vue'),
        meta:{requireAuth:true,title:"充值规则"},
        name:"scorerule"
      },  */ 
      {
        path: '/cardstepedit',
        component:  () => import('@/components/member/memcardstep/MemCardStepEdit.vue'),
        meta: { requireAuth: true, title: '会员卡等级编辑' },
        name: 'cardstepedit'
      },  {
        path: '/storerule',
        component:  () => import('@/components/member/storerule/storerule.vue'),
        meta: { requireAuth: true, title: '储值规则' },
        name: 'storerule'
      },
      // 
]