// 这是会员设置
export default [
    {
        path: '/memberManagement',
        name: 'memberManagement',
        component:  () => import('@/views/weChart/wxgoods/memberManagement/memberManagement.vue'),
        meta: {
          requireAuth: true,
          title: '会员卡管理'
        }
      },  {
        path: "/integrationrule",
        component: () => import ("@/views/weChart/member/integrationrule/integrationrule.vue"),
        meta: {
          requireAuth: true,
          title: "积分规则"
        },
        name: "integrationrule"
      },   {
        path: "/balance",
        component:  () => import ("@/views/weChart/member/balance/balance.vue"),
        meta: {
          requireAuth: true,
          title: "余额提现"
        },
        name: "balance"
      },  {
        path: "/promotion",
        component: () => import ("@/views/weChart/member/promotion/promotion.vue"),
        meta: {
          requireAuth: true,
          title: "推广明细"
        },
        name: "promotion"
      },   {
        path: '/memberBalanceRecord',
        name: 'memberBalanceRecord',
        component: () => import('@/views/weChart/wxgoods/memberBalanceRecord/memberBalanceRecord.vue'),
        meta: {
          requireAuth: true,
          title: '余额记录'
        }
      },   {
        path: '/memberIntegralRecord',
        name: 'memberIntegralRecord',
        component: () => import('@/views/weChart/wxgoods/memberIntegralRecord/memberIntegralRecord.vue'),
        meta: {
          requireAuth: true,
          title: '积分记录'
        }
      },
      {
        path: "/weiupcount",
        component: () => import('@/views/weChart/wxgoods/weiupcount/weiupcount.vue'),
        meta: {
          requireAuth: true,
          title: "线上统计"
        },
        name: "weiupcount"
      }, 
      {
        path: '/addmember',
        name: 'addmember',
        component: () => import('@/views/weChart/wxgoods/memberManagement/addmember.vue'),
        meta: {
          requireAuth: true,
          title: '会员卡编辑'
        }
      },
       {
        path: '/addaddress',
        name: 'addaddress',
        component: () => import('@/views/weChart/wxgoods/memberManagement/addaddress.vue'),
        meta: {
          requireAuth: true,
          title: '会员卡地址'
        }
      }, 
]