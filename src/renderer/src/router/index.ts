import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@renderer/view/Home.vue'
import Setting from '@renderer/view/Setting.vue'
import AICommand from '@renderer/view/AICommand.vue'

const routes = [
  { name: 'home', path: '/', component: Home },
  { name: 'setting', path: '/setting', component: Setting },
  { name: 'AICommand', path: '/ai-command', component: AICommand }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
