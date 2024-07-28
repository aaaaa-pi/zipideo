import '@renderer/assets/tailwind.css'
import '@renderer/assets/main.scss'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from '@renderer/router'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.mount('#app')
