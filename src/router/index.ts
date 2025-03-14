import { ElMessage } from 'element-plus'
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
          path: '/home/course',
          name: 'course',
          component: () => import('../components/Course/index.vue')
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
        {
          path: '/home/label',
          name: 'label',
          component: () => import('../components/Label/index.vue')
        },
        {
          path: '/home/classdetail/1',
          name: 'classdetail',
          component: () => import('../components/Class/ClassDetail.vue')
        },
        {
          path: '/home/questionpage/1',
          name: 'questionpage',
          component: () => import('../components/QuestionPage/index.vue')
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    }
  ]
})

// 登录检验
router.beforeEach((to, from, next) => {
  let isLogin = localStorage.getItem('isLogin')
  if (to.name !== 'login' && to.name !== 'homepage' && isLogin === 'false') {
    ElMessage.warning('请先登录')
    next({ name: from.name })
  } else {
    next()
  }
})

export default router
