import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // },
  // {
  //   path: '/register',
  //   component: () => import('@/views/register/index'),
  //   hidden: true
  // },

  {
    path: '/',
    component: () => import('@/views/organization/index'),
    redirect: '/home',
    hidden: true,
    children: [
      {
        path: 'home',
        component: () => import('@/views/organization/home')
      },
      {
        path: 'create',
        component: () => import('@/views/organization/create')
      },
      {
        path: 'list',
        component: () => import('@/views/organization/list')
      }
      // {
      //   path: 'search',
      //   component: () => import('@/views/organization/search')
      // }
    ]
  },
  // {
  //   path: '/dao',
  //   component: Layout,
  //   // redirect: '/dao',
  //   children: [{
  //     path: 'home',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: 'Home', icon: 'home' }
  //   }]
  // },
  {
    path: '/dao/info',
    component: Layout,
    children: [
      {
        path: '',
        name: 'dao-info',
        component: () => import('@/views/dao-info/index'),
        meta: { title: 'DAO Info', icon: 'info' }
      }
    ]
  },
  {
    path: '/dao/team-manager',
    component: Layout,
    children: [
      {
        path: '',
        name: 'team-manager',
        alwaysShow: true,
        component: () => import('@/views/team-manager/index'),
        meta: { title: 'Team Manager', icon: 'user' }
      }
    ]
  },
  {
    path: '/dao/token-manager',
    component: Layout,
    children: [
      {
        path: '',
        name: 'token-manager',
        component: () => import('@/views/token-manager/index'),
        meta: { title: 'Token Manager', icon: 'finance' }
      }
    ]
  },
  {
    path: '/dao/finance',
    component: Layout,
    children: [
      {
        path: '',
        name: 'finance',
        component: () => import('@/views/finance/index'),
        meta: { title: 'Finance', icon: 'finance' }
      }
    ]
  },
  {
    path: '/dao/profile',
    component: Layout,
    children: [
      {
        path: '',
        name: 'profile',
        hidden: true,
        component: () => import('@/views/profile/index'),
        meta: { title: 'Profile', icon: 'dashboard' }
      }
    ]
  },
  // {
  //   path: '/dao/voting',
  //   component: Layout,
  //   children: [{
  //     path: '',
  //     name: 'Voting',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: 'Voting', icon: 'vote' }
  //   }]
  // },
  // {
  //   path: '/dao/setting',
  //   component: Layout,
  //   children: [{
  //     path: '',
  //     name: 'Setting',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: 'Settings', icon: 'setting' }
  //   }]
  // },
  // {
  //   path: '/dao/discovery',
  //   component: Layout,
  //   name: 'Example',
  //   meta: { title: 'Discovery', icon: 'example' },
  //   children: [
  //     {
  //       path: 'new-organization',
  //       redirect: '/create',
  //       name: 'Table',
  //       meta: { title: 'New Organization', icon: 'info' }
  //     },
  //     {
  //       path: 'hot-organization',
  //       redirect: '/list',
  //       name: 'Tree',
  //       meta: { title: 'Hot Organization', icon: 'info' }
  //     }
  //   ]
  // },
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
