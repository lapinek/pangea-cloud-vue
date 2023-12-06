import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/action',
      name: 'action',
      // route level code-splitting
      // this generates a separate chunk (Action.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Action.vue'),
      /**
       * Add a handler for entering the route event.
       * @param {object} to - The target route location in a normalized format being navigated to.
       * @param {object} from - The current route location in a normalized format being navigated away from.
       * @return {boolean|string|undefined} A true or undefined will allow to proceed.
       */
      beforeEnter: (to) => {
        fetch('/api/audit-log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            actor: 'User',
            action: to.href,
            message: 'User\'s SSN changed.',
            old: '',
            new: '543-21-6789'
          })
        }).catch((e) => {
          console.log(`${to.path} failed to log.`, e)
        })
      }
    }
  ]
})

export default router
