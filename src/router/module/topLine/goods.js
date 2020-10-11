// 这是商品设置
export default [
    {
        path: '/goodscatetwo',
        component: () => import('@/views/weChart/goods/goodscatetwo.vue'),
        meta: {
          requireAuth: true,
          title: "商品分类"
        },
        name: 'goodscatetwo'
      },    {
        path: '/goodslisttwo',
        component:  () => import('@/views/weChart/goods/goodslisttwo.vue'),
        meta: {
          requireAuth: true,
          title: "商品列表"
        },
        name: 'goodslisttwo'
      },{
        path: '/addgoods',
        component:  () => import('@/views/weChart/goods/addgoods/addgoods.vue'),
        meta: {
          requireAuth: true,
          title: "商品添加"
        },
        name: 'addgoods'
      },  {
        path: '/attributetemplate',
        name: 'attributetemplate',
        component:  () => import('@/views/weChart/wxgoods/attributetemplate/attributetemplate.vue'),
        meta: {
          requireAuth: true,
          title: '属性模板'
        }
      },    {
        path: '/goodsevaluatetwo',
        name: 'goodsevaluatetwo',
        component:  () => import('@/views/weChart/wxgoods/goodsevaluatetwo/goodsevaluatetwo.vue'),
        meta: {
          requireAuth: true,
          title: '商品评价'
        }
      },
]