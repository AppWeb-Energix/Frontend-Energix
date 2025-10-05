import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../utils/mockAuth.js'

// Eager load para rutas críticas de autenticación (mejor performance en First Contentful Paint)
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

// Lazy load para rutas privadas (code splitting)
const Dashboard = () => import('../pages/dashboard.vue')
const Usage = () => import('../pages/usage.vue')
const Alerts = () => import('../pages/alerts.vue')
const Reports = () => import('../pages/reports.vue')
const Configuration = () => import('../pages/configuration.vue')
const NotFound = () => import('../pages/notfound.vue')

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL || '/'),
    routes: [
        // Redirigir raíz según estado de autenticación
        {
            path: '/',
            redirect: () => {
                return isAuthenticated() ? '/dashboard' : '/login'
            }
        },

        // Rutas públicas (autenticación)
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { title: 'Sign In', public: true }
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
            meta: { title: 'Sign Up', public: true }
        },

        // Rutas privadas (requieren autenticación)
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            meta: { title: 'Dashboard', requiresAuth: true }
        },
        {
            path: '/profile',
            redirect: '/dashboard' // Alias para compatibilidad
        },
        {
            path: '/usage',
            name: 'usage',
            component: Usage,
            meta: { title: 'Usage', requiresAuth: true }
        },
        {
            path: '/alerts',
            name: 'alerts',
            component: Alerts,
            meta: { title: 'Alerts', requiresAuth: true }
        },
        {
            path: '/reports',
            name: 'reports',
            component: Reports,
            meta: { title: 'Reports', requiresAuth: true }
        },
        {
            path: '/configuration',
            name: 'configuration',
            component: Configuration,
            meta: { title: 'Configuration', requiresAuth: true }
        },

        // 404 - No encontrado
        {
            path: '/:pathMatch(.*)*',
            name: '404',
            component: NotFound,
            meta: { title: 'Not Found' }
        }
    ],
    scrollBehavior() {
        return { top: 0 }
    }
})

// Navigation Guard - Protección de rutas
router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta?.requiresAuth === true
    const isPublic = to.meta?.public === true
    const logged = isAuthenticated()

    console.log('🔍 Router Guard:', {
        to: to.name,
        requiresAuth,
        isPublic,
        logged
    })

    // 1. Proteger rutas privadas
    if (requiresAuth && !logged) {
        console.log('🔒 Ruta protegida sin autenticación, redirigiendo a login')
        return next({ name: 'login' })
    }

    // 2. Evitar que usuarios autenticados vean login/register
    if (isPublic && logged) {
        console.log('✅ Usuario autenticado, redirigiendo a dashboard')
        return next({ name: 'dashboard' })
    }

    // 3. Permitir navegación normal
    console.log('✅ Navegación permitida')
    next()
})

// Actualizar título de la pestaña
router.afterEach((to) => {
    document.title = `Energix · ${to.meta?.title || 'App'}`
})

export default router
