import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { isAuthenticated } from './composables/auth'
const app = createApp(App)

app.use(router)

const init = async () => {
  await isAuthenticated()
  app.mount('#app')
}

init()
