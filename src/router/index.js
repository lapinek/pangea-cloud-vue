import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { isAuthenticated } from '../composables/auth'
import { store } from '../store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/action',
      name: 'action',
      component: () => import('../views/Action.vue'),
      meta: {
        requiresAuth: true
      },
      /**
       * Add a handler for entering the route event.
       * @param {object} to - The target route location in a normalized format being navigated to.
       * @param {object} from - The current route location in a normalized format being navigated away from.
       * @return {boolean|string|undefined} A true or undefined will allow to proceed.
       */
      // beforeEnter: (to, from ) => {
      // }
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: () => import('../views/Redirect.vue')
    },
    {
      path: '/signOut',
      name: 'signOut',
      component: () => import('../views/SignOut.vue')
    },
    {
      path: '/:catchAll(.*)',
      component: import('../views/NotFound.vue')
    }
  ]
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    await isAuthenticated()
    if (!store.pangeaSession) {
      return { name: 'home' }
    }
  }
})

export default router
