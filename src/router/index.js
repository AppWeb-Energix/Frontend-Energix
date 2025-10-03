import { createRouter, createWebHistory } from 'vue-router'
const Usage       = () => import('../pages/usage.vue')
const Alerts       = () => import('../pages/alerts.vue')
const Reports      = () => import('../pages/reports.vue')
const Configuration = () => import('../pages/configuration.vue')
const NotFound      = () => import('../pages/notfound.vue')
const Home          = () => import('../pages/home.vue')
const Profile = () => import('../pages/profile.vue')

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL || '/'),
    routes: [
        { path: '/',                  name: 'profile',                 component: Profile,     meta: { title: 'profile' } },
        { path: '/usage',             name: 'usage',                component: Usage,       meta: { title: 'usage' } },
        { path: '/alerts',            name: 'alerts',               component: Alerts,       meta: { title: 'Alerts' } },
        { path: '/reports',           name: 'reports',              component: Reports,      meta: { title: 'Reports' } },
        { path: '/configuration',     name: 'configuration',        component: Configuration, meta: { title: 'Configuratión' } },
        { path: '/:pathMatch(.*)*',   name: '404',                  component: NotFound }
    ],
    scrollBehavior() { return { top: 0 } }
})

// (opcional) actualizar título de la pestaña
router.afterEach((to) => { document.title = `Energix · ${to.meta?.title || 'App'}` })

export default router
