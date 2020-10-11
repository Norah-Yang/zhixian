// 这是营销玩法设置
export default [
    {
        path: '/tuan',
        component: () => import('@/views/weChart/tuan/tuan.vue'),
        meta: {
          requireAuth: true,
          title: "拼团列表"
        },
        name: 'tuan'
      },       {
        path: '/addtuan',
        component:  () => import('@/views/weChart/tuan/addtuan.vue'),
        meta: {
          requireAuth: true,
          title: "添加拼团"
        },
        name: 'addtuan'
      },    {
        path: '/seckill',
        component: () => import('@/views/weChart/seckill/seckill/seckill.vue'),
        meta: {
          requireAuth: true,
          title: "秒杀列表"
        },
        name: 'seckill'
      },  {
        path: '/addseckill',
        component: () => import('@/views/weChart/seckill/seckill/addseckill.vue'),
        meta: {
          requireAuth: true,
          title: "添加秒杀"
        },
        name: 'addseckill'
      }, {
        path: '/scoregoods',
        name: 'scoregoods',
        component: () => import('@/views/weChart/scoregoods/scoregoods.vue'),
        meta: {
          requireAuth: true,
          title: '积分商城'
        }
      },  {
        path: '/addscoregoods',
        name: 'addscoregoods',
        component: () => import('@/views/weChart/scoregoods/addscoregoods.vue'),
        meta: {
          requireAuth: true,
          title: '新增积分商城'
        }
      },   {
        path: '/coupon',
        component:  () => import('@/views/weChart/coupon/coupon.vue'),
        meta: {
          requireAuth: true,
          title: "优惠券列表"
        },
        name: 'coupon'
      },    {
        path: '/fafang',
        name: 'fafang',
        component:  () => import('@/views/weChart/coupon/fafang.vue'),
        meta: {
          requireAuth: true,
          title: '发放优惠券'
        }
      },   {
        path: "/fullreduction",
        component:  () => import ("@/views/weChart/marketing/fullreduction/fullreduction.vue"),
        meta: {
          requireAuth: true,
          title: "满减活动"
        },
        name: "fullreduction"
      }, {
        path: "/consumegivegifts",
        component:  () => import ("@/views/weChart/marketing/consumegivegifts/consumegivegifts.vue"),
        meta: {
          requireAuth: true,
          title: "满减活动"
        },
        name: "consumegivegifts"
      }, {
        path: "/miniprogramDiscount",
        component:  () => import ("@/views/weChart/miniprogramDiscount/miniprogramDiscount.vue"),
        meta: {
          requireAuth: true,
          title: "商城限时折扣"
        },
        name: "miniprogramDiscount"
      }, {
        path: "/miniprogramDiscountEdit",
        component:  () => import ("@/views/weChart/miniprogramDiscount/miniprogramDiscountEdit.vue"),
        meta: {
          requireAuth: true,
          title: "商城限时折扣商品管理"
        },
        name: "miniprogramDiscountEdit"
      }, {
        path: "/shopDiscount",
        component:  () => import ("@/views/weChart/shopDiscount/shopDiscount.vue"),
        meta: {
          requireAuth: true,
          title: "门店限时折扣"
        },
        name: "shopDiscount"
      }, 
       {
          path: "/shopDiscountEdit",
          component:  () => import ("@/views/weChart/shopDiscount/shopDiscountEdit.vue"),
          meta: {
            requireAuth: true,
            title: "门店限时折扣商品管理"
          },
          name: "shopDiscountEdit"
        },
]