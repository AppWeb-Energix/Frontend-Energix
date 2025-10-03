import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import * as feather from 'feather-icons'
createApp(App)
    .use(router)
    .mount('#app')

setTimeout(() => feather.replace(), 100)