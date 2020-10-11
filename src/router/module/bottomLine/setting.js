// 线下系统设置路由
//  const Login = () => import(/* webpackChunkName: "login" */'../components/Login.vue')
export default [{
    path: '/settings',
    component: () => import('@/components/storeManagement/settings.vue'),
    meta: {
      requireAuth: true,
      title: "店铺管理"
    },
    name: 'settings'
  }, {
    path: '/welcome',
    component: () => import('@/components/Welcome.vue'),
    meta: {
      requireAuth: true
    },
    name: 'welcome'
  },

  {
    path: "/settingsAdd",
    component: () => import('@/components/storeManagement/settingsAdd.vue'),
    meta: {
      requireAuth: true,
      title: "店铺管理"
    },
    name: "settingsAdd"
  },
  {
    path: "/collection",
    component: () => import('@/components/collection/collection.vue'),
    meta: {
      requireAuth: true,
      title: "收款设置"
    },
    name: "collection"
  }, {
    path: "/templates",
    component: () => import('@/components/template/template.vue'),
    meta: {
      requireAuth: true,
      title: "收款模板"
    },
    name: "templates"
  }, {
    path: "/templateAdd",
    component: () => import('@/components/template/templateAdd.vue'),
    meta: {
      requireAuth: true,
      title: "新增收款模板"
    },
    name: "templateAdd"
  }, {
    path: "/machine",
    component: () => import('@/components/machineUniversal/machine.vue'),
    meta: {
      requireAuth: true,
      title: "收银机器"
    },
    name: "machine"
  }, {
    path: "/common",
    component: () => import('@/components/common/common.vue'),
    meta: {
      requireAuth: true,
      title: "通用设置"
    },
    name: "common"
  },
  {
    path: "/carousel",
    component: () => import('@/components/carousel/carousel.vue'),
    meta: {
      requireAuth: true,
      title: "轮播图"
    },
    name: "carousel"
  },
  {
    path: "/carouselEdit",
    component: () => import('@/components/carousel/carouselEdit.vue'),
    meta: {
      requireAuth: true,
      title: "轮播图管理"
    },
    name: "carouselEdit"
  }, {
    path: "/message",
    component: () => import('@/components/message/message.vue'),
    meta: {
      requireAuth: true,
      title: "短信管理"
    },
    name: "message"
  }, {
    path: "/messageList",
    component: () => import('@/components/message/messageList.vue'),
    meta: {
      requireAuth: true,
      title: "短信管理"
    },
    name: "messageList"
  }, {
    path: "/advertising",
    component: () => import('@/components/advertising/advertising.vue'),
    meta: {
      requireAuth: true,
      title: "广告管理"
    },
    name: "advertising"
  }, {
    path: "/advertisingEdit",
    component: () => import('@/components/advertising/advertisingEdit.vue'),
    meta: {
      requireAuth: true,
      title: "广告设置"
    },
    name: "advertisingEdit"
  }, {
    path: "/refund",
    component: () => import('@/components/refund/refund.vue'),
    meta: {
      requireAuth: true,
      title: "退款原因"
    },
    name: "refund"
  }, {
    path: "/refundAdd",
    component: () => import('@/components/refund/refundAdd.vue'),
    meta: {
      requireAuth: true,
      title: "新增退款"
    },
    name: "refundAdd"
  }
]
