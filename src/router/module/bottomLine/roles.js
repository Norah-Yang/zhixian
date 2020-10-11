// 这是权限管理
export default [
    {
        path: '/rights',
        component: () => import('@/components/rights/staffmanage/Rights.vue'),
        meta: {
          requireAuth: true,
          title:'员工管理'
        },
        name: 'rights'
      },  {
        path: '/aestaff',
        component: () => import('@/components/rights/staffmanage/AEStaff.vue'),
        meta: { requireAuth: true, title: '员工新增' },
        name: 'AEStaff'
      }, {
        path: '/staffrecycle',
        component:  () => import('@/components/rights/staffmanage/StaffRecycle.vue'),
        meta: { requireAuth: true, title: '回收站' },
        name: 'StaffRecycle'
      }, {
        path: '/roles',
        component:  () => import('@/components/rights/rolesmanage/Roles.vue'),
        meta: {
          requireAuth: true,
          title:'角色管理'
        },
        name: 'roles'
      },
      {
        path: '/rolesedit',
        component:  () => import('@/components/rights/rolesmanage/RolesEdit.vue'),
        meta: {
          requireAuth: true,
          title:"新增角色"
        },
        name: 'rolesedit'
      },
     
]