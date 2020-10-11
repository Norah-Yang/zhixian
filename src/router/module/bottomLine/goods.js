// 这是商品管理页面
export default [
    {
        path: '/categories',
        component:  () => import('@/components/goods/goodCate/Classify.vue'),
        meta: {
          requireAuth: true,
          title: "商品分类"
        },
        name: 'categories'
      },  {
        path: '/addsort',
        component:  () => import('@/components/goods/goodCate/AddSort.vue'),
        meta: {
          requireAuth: true,
          title: "新增商品"
        },
        name: 'addsort'
      }, {
        path: '/classifyedit',
        component: () => import('@/components/goods/goodCate/ClassifyEdit.vue'),
        meta: {
          requireAuth: true,
          title:'修改商品分类信息'
        },
        name: 'classifyedit'
      },  {
        path: '/goods',
        component: () => import('@/components/goods/goodList/GoodList.vue'),
        meta: {
          requireAuth: true,
          title: "商品列表"
        },
        name: 'goods'
      },   {
        path: '/addgood',
        name: 'addgood',
        component: () => import('@/components/goods/goodList/AddGood.vue'),
        meta: {
          requireAuth: true,
          title:'添加商品'
        }
      },{
        path: '/quickaddgood',
        name: 'quickaddgood',
        component: () => import('@/components/goods/goodList/QuickAddGood.vue'),
        meta: {
          requireAuth: true,
          title:'快速添加商品'
        }
      },{
        path: '/prices',
        name: 'prices',
        component:  () => import('@/components/goods/subbranchPrice/SubbranchPrice.vue'),
        meta: {
          requireAuth: true,
          title: '分店价格'
        }
      },  {
        path: '/recycle',
        name: 'recycle',
        component: () => import('@/components/goods/goodRecycle/GoodRecycle.vue'),
        meta: {
          requireAuth: true,
          title: '商品回收站'
        }
      }, {
        path: '/cash',
        name: 'cash',
        component:  () => import('@/components/goods/posGoods/PosGoods.vue'),
        meta: {
          requireAuth: true,
          title: '收银机商品'
        }
      },     {
        path: '/GoodEdit',
        component:  () => import('@/components/goods/goodList/GoodEdit.vue'),
        meta: {
          requireAuth: true,
          title: "商品修改"
        },
        name: 'GoodEdit'
      }, {
        path: '/goodlog',
        component:  () => import('@/components/goods/goodLog/GoodLog.vue'),
        meta: {
          requireAuth: true,
          title: "商品日志"
        },
        name: 'GoodLog'
      }, {
        path: '/percentage',
        component:  () => import('@/components/goods/percentage/Percentage.vue'),
        meta: {
          requireAuth: true,
          title: "调拨加价率"
        },
        name: 'Percentage'
      },
]