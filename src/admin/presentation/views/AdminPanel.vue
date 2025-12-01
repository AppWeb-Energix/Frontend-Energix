<template>
  <div class="flex h-screen admin-panel">
    <!-- Sidebar del Panel Admin -->
    <aside class="admin-sidebar" :style="sidebarStyle">
      <div class="sidebar-header">
        <div class="flex align-items-center mb-2">
          <i class="pi pi-shield text-4xl mr-3"></i>
          <div>
            <h2 class="text-2xl font-bold m-0">Panel Admin</h2>
            <span class="text-sm opacity-80">Energix Control</span>
          </div>
        </div>
      </div>

      <div class="sidebar-divider"></div>

      <nav class="sidebar-nav">
        <Button
          :class="['sidebar-button', { 'active': currentView === 'analytics' }]"
          @click="currentView = 'analytics'"
        >
          <i class="pi pi-chart-bar mr-3 text-xl"></i>
          <span class="font-semibold">Analíticas</span>
        </Button>

        <Button
          :class="['sidebar-button', { 'active': currentView === 'health' }]"
          @click="currentView = 'health'"
        >
          <i class="pi pi-heart mr-3 text-xl"></i>
          <span class="font-semibold">Estado del Sistema</span>
        </Button>

        <Button
          :class="['sidebar-button', { 'active': currentView === 'audit' }]"
          @click="currentView = 'audit'"
        >
          <i class="pi pi-list mr-3 text-xl"></i>
          <span class="font-semibold">Auditoría</span>
        </Button>
      </nav>

      <div class="sidebar-footer">
        <div class="text-xs opacity-70 mb-2">
          <i class="pi pi-user mr-2"></i>
          {{ adminUser }}
        </div>
        <Button
          class="sidebar-button w-full"
          @click="handleLogout"
          outlined
        >
          <i class="pi pi-sign-out mr-2"></i>
          <span>Salir</span>
        </Button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="admin-content">
      <!-- Header con breadcrumb -->
      <header class="content-header">
        <div class="flex align-items-center justify-content-between">
          <div>
            <h1 class="text-2xl font-bold m-0" style="color: var(--color-primary)">
              {{ currentViewTitle }}
            </h1>
            <div class="text-sm text-500 mt-1">
              <i class="pi pi-home mr-1"></i>
              Admin / {{ currentViewTitle }}
            </div>
          </div>

          <div class="flex align-items-center gap-3">
            <span class="text-sm text-500">
              <i class="pi pi-clock mr-2"></i>
              {{ currentTime }}
            </span>
            <Button
              icon="pi pi-bell"
              class="p-button-rounded p-button-text"
              badge="3"
              badgeClass="p-badge-danger"
            />
          </div>
        </div>
      </header>

      <!-- Contenido dinámico -->
      <div class="content-body">
        <Transition name="fade" mode="out-in">
          <component :is="activeComponent" :key="currentView" />
        </Transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

// Importaciones de PrimeVue
import Button from 'primevue/button'

const router = useRouter()
const currentView = ref('analytics')
const currentTime = ref('')
const adminUser = ref('Administrador')
let timeInterval = null

// Componentes cargados de forma asíncrona
const componentsMap = {
  analytics: defineAsyncComponent(() => import('@/admin/presentation/components/AdminAnalytics.vue')),
  health: defineAsyncComponent(() => import('@/admin/presentation/components/AdminHealth.vue')),
  audit: defineAsyncComponent(() => import('@/admin/presentation/components/AdminAudit.vue'))
}

const sidebarStyle = computed(() => ({
  background: `linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)`,
  color: 'white'
}))

const activeComponent = computed(() => {
  return componentsMap[currentView.value] || componentsMap.analytics
})

const currentViewTitle = computed(() => {
  const titles = {
    analytics: 'Analíticas',
    health: 'Estado del Sistema',
    audit: 'Auditoría'
  }
  return titles[currentView.value] || 'Panel Admin'
})

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleLogout = () => {
  // Limpiar el flag de admin
  localStorage.removeItem('energix-mode')
  localStorage.removeItem('energix-admin-token')

  // Redirigir al login de admin
  router.push('/admin/login')
}

onMounted(() => {
  // Obtener nombre del administrador si está disponible
  try {
    const userStr = localStorage.getItem('energix-user')
    if (userStr) {
      const user = JSON.parse(userStr)
      adminUser.value = user.name || user.email || 'Administrador'
    }
  } catch (e) {
    console.error('Error al obtener usuario admin:', e)
  }

  // Actualizar reloj cada minuto
  updateTime()
  timeInterval = setInterval(updateTime, 60000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.admin-panel {
  background: var(--color-background);
  overflow: hidden;
}

.admin-sidebar {
  width: 16rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.sidebar-header {
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.sidebar-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 1rem 0;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-button {
  width: 100%;
  justify-content: flex-start;
  padding: 0.875rem 1rem;
  border: none;
  background: transparent;
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  text-align: left;
}

.sidebar-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(4px);
}

.sidebar-button.active {
  background: rgba(255, 255, 255, 0.25);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.admin-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.content-body {
  flex: 1;
  overflow-y: auto;
  background: var(--color-background);
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .admin-sidebar {
    width: 12rem;
    padding: 1rem 0.5rem;
  }

  .sidebar-button {
    font-size: 0.875rem;
    padding: 0.75rem 0.75rem;
  }

  .sidebar-button i {
    font-size: 1rem !important;
  }

  .content-header {
    padding: 1rem 1.5rem;
  }

  .content-header h1 {
    font-size: 1.5rem;
  }
}

/* Scrollbar personalizado */
.content-body::-webkit-scrollbar {
  width: 8px;
}

.content-body::-webkit-scrollbar-track {
  background: var(--color-background);
}

.content-body::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 4px;
}

.content-body::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-dark);
}
</style>

