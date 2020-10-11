// 这是客户管理
export default [
    {
        path: '/client',
        component:  () => import('@/components/client/ClientList.vue'),
        meta: {
          requireAuth: true,
          title: '客户列表'
        },
        name: 'client'
      },  {
        path: '/addclient',
        component:  () => import('@/components/client/AddClient.vue'),
        meta: {
          requireAuth: true,
          title: '添加客户'
        },
        name: 'addclient'
      }, {
        path: '/clientrecycle',
        component:  () => import('@/components/client/ClientRecycle.vue'),
        meta: {
          requireAuth: true,
          title: '客户回收站'
        },
        name: 'clientrecycle'
      },
]