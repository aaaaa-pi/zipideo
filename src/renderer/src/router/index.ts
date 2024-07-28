import { createRouter, createWebHistory } from 'vue-router'
import Home from '@renderer/view/Home.vue'
import Setting from '@renderer/view/Setting.vue'

const routes = [
  { name: 'home', path: '/', component: Home },
  { name: 'setting', path: '/setting', component: Setting }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
