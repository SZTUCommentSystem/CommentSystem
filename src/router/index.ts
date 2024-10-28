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
          path: '/home/task/taskcondition',
          name: 'taskcondition',
          component: () => import('../components/TaskCondition/index.vue')
        },
        {
          path: '/home/task/taskdetail',
          name: 'taskdetail',
          component: () => import('../components/TaskDetail/index.vue')
        },
        {
          path: '/home/task/taskcreate',
          name: 'taskcreate',
          component: () => import('../components/TaskCreate/index.vue')
        },
        {
          path: '/home/question',
          name: 'question',
          component: () => import('../components/Question/index.vue')
        },
        {
          path: '/home/question/questiondetail',
          name: 'questiondetail',
          component: () => import('../components/QuestionDetail/index.vue')
        },
        {
          path: '/home/question/questioncreate',
          name: 'questioncreate',
          component: () => import('../components/QuestionCreate/index.vue')
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
          path: '/home/corret',
          name: 'corret',
          component: () => import('../components/Corret/index.vue')
        },
      ]
    },
  ]
})

export default router
