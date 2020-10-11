// 这是会员卡管理
export default [
      {
        path:"/scorerule",
        component: () => import('@/views/weChart/storedValueRule/scorerule.vue'),
        meta:{requireAuth:true,title:"充值规则"},
        name:"scorerule"
      },
]