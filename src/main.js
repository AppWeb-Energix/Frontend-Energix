import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import * as feather from 'feather-icons'

// estilos globales
import './styles/tokens.css'
import './styles/auth.css'

createApp(App)
    .use(router)
    .mount('#app')

setTimeout(() => feather.replace(), 100)