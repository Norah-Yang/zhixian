// 这是公共暴露出去的路由
export default [{
    path: '/dev',
    component: () => import('@/views/weChart/setwechat/dev/dev.vue'),
    meta: {
      requireAuth: true,
      title: '素材分类'
    },
    name: 'dev'
  }, {
    path: "/templateType",
    component: () => import('@/components/template/templateType.vue'),
    meta: {
      requireAuth: true,
      title: "收款方式"
    },
    name: "templateType"
  }, {
    path: "/merchant",
    component: () => import('@/views/brandjoining/merchant/merchant.vue'),
    meta: {
      requireAuth: true,
      title: "加盟商户"
    },
    name: "merchant"
  }, {
    path: "/merchantEdit",
    component: () => import('@/views/brandjoining/merchant/merchantEdit.vue'),
    meta: {
      requireAuth: true,
      title: "商户编辑"
    },
    name: "merchantEdit"
  }, {
    path: "/shop",
    component: () => import('@/views/brandjoining/shop/shop.vue'),
    meta: {
      requireAuth: true,
      title: "加盟店铺"
    },
    name: "shop"
  }, {
    path: "/warehouse",
    component: () => import('@/views/brandjoining/warehouse/warehouse.vue'),
    meta: {
      requireAuth: true,
      title: "加盟仓库"
    },
    name: "warehouse"
  }, {
    path: "/warehouseAdd",
    component: () => import('@/views/brandjoining/warehouse/warehouseAdd.vue'),
    meta: {
      requireAuth: true,
      title: "仓库编辑"
    },
    name: "warehouseAdd"
  },  {
    path: "/warehouseRefund",
    component: () => import('@/views/brandjoining/warehouse/warehouseRefund.vue'),
    meta: {
      requireAuth: true,
      title: "仓库回收"
    },
    name: "warehouseRefund"
  },
  {
    path: '/settlementdetail',
    component: () => import('@/components/guide/guidelist/SettlementDetail.vue'),
    meta: {
      requireAuth: true,
      title: '结算明细'
    },
    name: 'settlementdetail'
  }, 
  // {
  //   path: "/recommend",
  //   component: () => import('@/views/weChart/systemSettings/recommend/recommend.vue'),
  //   meta: {
  //     requireAuth: true,
  //     title: "热门推荐"
  //   },
  //   name: "recommend"
  // },
   {
    path: "/shopDiscountGoodsList",
    component: () => import("@/views/weChart/shopDiscount/shopDiscountGoodsList.vue"),
    meta: {
      requireAuth: true,
      title: "门店限时商品列表"
    },
    name: "shopDiscountGoodsList"
  }, {
    path: "/addprinter",
    component: () => import("@/views/weChart/systemSettings/printer/addprinter.vue"),
    meta: {
      requireAuth: true,
      title: "添加打印机"
    },
    name: "addprinter"
  }, 
  // {
  //   path: "/shopDiscountGoodsList",
  //   component: () => import("@/views/weChart/shopDiscount/shopDiscountGoodsList.vue"),
  //   meta: {
  //     requireAuth: true,
  //     title: "门店限时商品列表"
  //   },
  //   name: "shopDiscountGoodsList"
  // },
]
