import { createRouter, createWebHistory } from 'vue-router'
/*import { isAuthenticated } from '../utils/mockAuth.js'*/

import { isAuthenticated } from '@/modules/auth/auth.service'

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
        {
            path: '/',
            redirect: () => {
                return isAuthenticated() ? '/dashboard' : '/login'
            }
        },

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

        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            meta: { title: 'Dashboard', requiresAuth: true }
        },
        {
            path: '/profile',
            redirect: '/dashboard'
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
            path: '/devices',
            name: 'devices',
            component: () => import('@/pages/devices.vue'),
            meta: { title: 'Mis Dispositivos', requiresAuth: true }
        },
        {
            path: '/configuration',
            name: 'configuration',
            component: Configuration,
            meta: { title: 'Configuration', requiresAuth: true }
        },

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

router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta?.requiresAuth === true
    const isPublic = to.meta?.public === true
    const logged = isAuthenticated()

    if (requiresAuth && !logged) {
        return next({ name: 'login' })
    }

    if (isPublic && logged) {
        return next({ name: 'dashboard' })
    }

    next()
})

router.afterEach((to) => {
    document.title = `Energix · ${to.meta?.title || 'App'}`
})

export default router
