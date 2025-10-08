import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import * as feather from 'feather-icons'

// PrimeVue
import PrimeVue from 'primevue/config'

// ESTILOS GLOBAL PrimeVue/PrimeFlex/PrimeIcons

import 'primeflex/primeflex.css'          // Grid y utilidades
import 'primeicons/primeicons.css'        // Iconos para pi pi-*

// Tus estilos globales
import './styles/tokens.css'
import './styles/auth.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(PrimeVue)
app.use(router)
app.mount('#app')

setTimeout(() => feather.replace(), 100)

