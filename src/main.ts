import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './core/router'
import { registerSW } from './core/registerSW'
import './style.css'
import App from './App.vue'

registerSW()

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
