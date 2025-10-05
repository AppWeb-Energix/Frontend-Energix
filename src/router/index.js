import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../utils/mockAuth.js'

// Eager load para rutas críticas de autenticación (mejor performance en First Contentful Paint)
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

// Lazy load para rutas privadas (code splitting)
const Usage = () => import('../pages/usage.vue')
const Alerts = () => import('../pages/alerts.vue')
const Reports = () => import('../pages/reports.vue')
const Configuration = () => import('../pages/configuration.vue')
const NotFound = () => import('../pages/notfound.vue')
const Home = () => import('../pages/home.vue')
const Profile = () => import('../pages/profile.vue')

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL || '/'),
    routes: [
        { path: '/', redirect: '/login' },

        // auth (públicas)
        { path: '/login',    name: 'login',    component: Login,    meta: { title: 'Sign In', public: true } },
        { path: '/register', name: 'register', component: Register, meta: { title: 'Sign Up', public: true } },

        { path: '/profile',                  name: 'profile',                 component: Profile,     meta: { title: 'profile', requiresAuth: true } },
        { path: '/usage',             name: 'usage',                component: Usage,       meta: { title: 'usage', requiresAuth: true } },
        { path: '/alerts',            name: 'alerts',               component: Alerts,       meta: { title: 'Alerts', requiresAuth: true } },
        { path: '/reports',           name: 'reports',              component: Reports,      meta: { title: 'Reports', requiresAuth: true } },
        { path: '/configuration',     name: 'configuration',        component: Configuration, meta: { title: 'Configuratión', requiresAuth: true } },
        { path: '/:pathMatch(.*)*',   name: '404',                  component: NotFound }
    ],
    scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta?.requiresAuth === true
    const logged = isAuthenticated()

    if (requiresAuth && !logged) {
        // intentar acceder a ruta privada sin estar autenticado -> ir a login
        return next({ name: 'login' })
    }

    if ((to.name === 'login' || to.name === 'register') && logged) {
        // usuario ya "logueado" => evitar ver login/register, redirigir a profile (dashboard)
        return next({ name: 'profile' })
    }

    next()
})

// (opcional) actualizar título de la pestaña
router.afterEach((to) => { document.title = `Energix · ${to.meta?.title || 'App'}` })

export default router
