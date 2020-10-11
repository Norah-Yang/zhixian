import setting from "@/router/module/bottomLine/setting"
import goods from "@/router/module/bottomLine/goods"
import order from "@/router/module/bottomLine/order"
import retail from "@/router/module/bottomLine/retail"
import data from "@/router/module/bottomLine/data"
import finance from "@/router/module/bottomLine/finance"
import roles from "@/router/module/bottomLine/roles"
import customer from "@/router/module/bottomLine/customer"
import warehouses from "@/router/module/bottomLine/warehouses"
import purchase from "@/router/module/bottomLine/purchase"
import membership from "@/router/module/bottomLine/membership"
import statistics from "@/router/module/bottomLine/statistics"
import shopping from "@/router/module/bottomLine/shopping"
import journal from "@/router/module/bottomLine/journal"
import comon from "@/router/module/topLine/comon"
import settings from "@/router/module/topLine/setting"
import account from "@/router/module/topLine/account"
import applets from "@/router/module/topLine/applets"
import good from "@/router/module/topLine/goods"
import oders from "@/router/module/topLine/oders"
import sale from "@/router/module/topLine/sale"
import news from "@/router/module/topLine/news"
import member from "@/router/module/topLine/member"
import card from "@/router/module/topLine/card"
import marketing from "@/router/module/topLine/marketing"
export const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/components/Login.vue'),
    name: 'login',
    meta: {
      title: '智鲜云后台管理系统'
    },
  },
  
  {
    path: '/home',
    component: () => import('@/components/Home.vue'),
    redirect: '/welcome',
    name: 'home',
    meta: {
      title: '智鲜云后台管理系统',
      requireAuth: true
    },
    children: [
      {
        path: '/welcome',
        component: () => import('@/components/Welcome.vue'),
        name: 'welcome',
        meta: {
          title: '智鲜云后台管理系统'
        },
      },
      ...setting,
      ...goods,
      ...order,
      ...retail,
      ...data,
      ...finance,
      ...roles,
      ...customer,
      ...warehouses,
      ...purchase,
      ...membership,
      ...statistics,
      ...shopping,
      ...journal,
      // 线上
      ...settings,
      ...account,
      ...applets,
      ...good,
      ...oders,
      ...sale,
      ...news,
      ...member,
      ...card,
      ...marketing,
      ...comon,
    ]
  }
]
