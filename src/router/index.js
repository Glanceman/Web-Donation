import { createRouter, createWebHistory } from 'vue-router'
import PostView from '@/views/PostView.vue'
import CreateView from '@/views/CreateView.vue'
import HistoryView from '@/views/HistoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'postView',
      component: PostView
    },
    {
      path: '/create',
      name: 'createView',
      component: CreateView
    },
    {
      path: '/history',
      name: 'historyView',
      component: HistoryView
    }
  ]
})

export default router
