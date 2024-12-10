import { createRouter, createWebHashHistory } from 'vue-router'
import BatchProcess from '@renderer/view/BatchProcess.vue'
import Setting from '@renderer/view/Setting.vue'
import AICommand from '@renderer/view/AICommand.vue'

const routes = [
  { name: 'batchprocess', path: '/', component: BatchProcess },
  { name: 'setting', path: '/setting', component: Setting },
  { name: 'AICommand', path: '/ai-command', component: AICommand }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
