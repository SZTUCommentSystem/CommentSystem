import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView/index.vue'),
      children: [
        {
          path: '/home/chapter',
          name: 'chapter',
          component: () => import('../views/Chapter/index.vue'),
        },
        {
          path: '/home/task',
          name: 'task',
          component: () => import('../views/Task/index.vue')
        }
      ]
    },

  ]
})

export default router
