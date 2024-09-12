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
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: '/home/chapter',
          name: 'chapter',
          component: () => import('../views/Chapter.vue'),
        },
        {
          path: '/home/chapter/task',
          name: 'task',
          component: () => import('../views/Task.vue')
        },
      ]
    },
  ]
})

export default router
