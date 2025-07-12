import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'


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
          component: () => import('../components/Task/list.vue')
        },
        {
          path: '/home/task/taskcondition',
          name: 'taskcondition',
          component: () => import('../components/TaskCondition/index.vue')
        },
        {
          path: '/home/task/taskcondition/detail',
          name: 'taskconditionDetail',
          component: () => import('../components/TaskCondition/detail.vue')
        },
        {
          path: '/home/task/taskdetail',
          name: 'taskdetail',
          component: () => import('../components/Task/detail.vue')
        },
        {
          path: '/home/task/taskcreate',
          name: 'taskcreate',
          component: () => import('../components/Task/create.vue')
        },
        {
          path: '/home/question',
          name: 'question',
          component: () => import('../components/Question/list.vue')
        },
        {
          path: '/home/question/questiondetail',
          name: 'questiondetail',
          component: () => import('../components/Question/detail.vue')
        },
        {
          path: '/home/question/questioncreate',
          name: 'questioncreate',
          component: () => import('../components/Question/create.vue')
        },
        {
          path: '/home/course',
          name: 'course',
          component: () => import('../components/Course/index.vue')
        },
        {
          path: '/home/class',
          name: 'class',
          component: () => import('../components/Class/list.vue')
        },
        {
          path: '/home/classdetail',
          name: 'classdetail',
          component: () => import('../components/Class/detail.vue')
        },
        {
          path: '/home/library',
          name: 'library',
          component: () => import('../components/Library/index.vue')
        },
        {
          path: '/home/corret',
          name: 'corret',
          component: () => import('../components/Corret/index.vue'),
        },
        {
          path: '/home/label',
          name: 'label',
          component: () => import('../components/Label/index.vue')
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
  const useStore = useUserStore();
  // 只允许未登录访问登录页
  if (!useStore.token || !useStore.userInfo) {
    if (to.name !== 'login') {
      ElMessage.warning('请先登录');
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    // 已登录不允许再访问登录页
    if (to.name === 'login') {
      next({ name: 'homepage' });
    } else {
      next();
    }
  }
});

export default router
