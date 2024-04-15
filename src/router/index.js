import { createRouter, createWebHistory } from 'vue-router'
import PostView from '@/views/PostView.vue'
import CreateView from '@/views/CreateView.vue'
import HistoryView from '@/views/HistoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Post',
      component: PostView,
      props: true
    },
    {
      path: '/create',
      name: 'Create',
      component: CreateView
    },
    {
      path: '/history',
      name: 'History',
      component: HistoryView
    }
  ]
})

export default router
