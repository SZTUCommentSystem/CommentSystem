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
        // {
        //   path: '/home/chapter',
        //   name: 'chapter',
        //   component: () => import('../views/Chapter.vue'),
        // },
        {
          path: '/home/task',
          name: 'task',
          component: () => import('../views/Task.vue')
        },
        {
          path: '/home/question',
          name: 'question',
          component: () => import('../components/Question/index.vue')
        },
        {
          path: '/home/work',
          name: 'work',
          component: () => import('../components/Work/index.vue')
        },
        {
          path: '/home/class',
          name: 'class',
          component: () => import('../components/Class/index.vue')
        },
      ]
    },
  ]
})

export default router
