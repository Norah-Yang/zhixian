// 这是公众号设置
export default [
    {
        path: '/setwechat',
        component: () => import('@/views/weChart/setwechat/setwechat/setwechat.vue'),
        meta: {
          requireAuth: true,
          title: '公众号设置'
        },
        name: 'setwechat'
      },    {
        path: '/custom',
        component: () => import('@/views/weChart/setwechat/custom/custom.vue'),
        meta: {
          requireAuth: true,
          title: '自定义菜单'
        },
        name: 'custom'
      } ,{
        path: '/replyList',
        component:  () => import('@/views/weChart/setwechat/replyList/replyList.vue'),
        meta: {
          requireAuth: true,
          title: '关键词回复'
        },
        name: 'replyList'
      },  {
        path: '/source',
        component: () => import('@/views/weChart/setwechat/source/source.vue'),
        meta: {
          requireAuth: true,
          title: '素材管理'
        },
        name: 'source'
      },     {
        path: '/template',
        component:  () => import('@/views/weChart/setwechat/template/template.vue'),
        meta: {
          requireAuth: true,
          title: '模板消息'
        },
        name: 'template'
      },
]   