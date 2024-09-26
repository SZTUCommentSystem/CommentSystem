import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home/homepage'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: '/home/homepage',
          name: 'homepage',
          component: () => import('../components/Home/HomePage.vue')
        },
        {
          path: '/home/task',
          name: 'task',
          component: () => import('../components/Task/index.vue')
        },
        {
          path: '/home/task/taskdetail',
          name: 'taskdetail',
          component: () => import('../components/TaskDetail/index.vue')
        },
        {
          path: '/home/createtask',
          name: 'createtask',
          component: () => import('../components/CreateTask/index.vue')
        },
        {
          path: '/home/question',
          name: 'question',
          component: () => import('../components/Question/index.vue')
        },
        {
          path: '/home/class',
          name: 'class',
          component: () => import('../components/Class/index.vue')
        },
        {
          path: '/home/library',
          name: 'library',
          component: () => import('../components/Library/index.vue')
        },
        {
          path: '/home/question/:questionId',
          name: 'questionDetail',
          component: () => import('../components/QuestionDetail/index.vue')
        },
      ]
    },
  ]
})

export default router
