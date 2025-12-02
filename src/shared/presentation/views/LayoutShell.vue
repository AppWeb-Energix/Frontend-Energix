<template>
  <!-- Overlay para cerrar el menú en móvil -->
  <div v-if="isMobileMenuOpen" class="mobile-overlay" @click="toggleMobileMenu"></div>

  <aside class="sidebar" :class="{ 'sidebar-open': isMobileMenuOpen }">
    <div class="container-logo">
      <img src="@/assets/logo.png" alt="logo" class="logo-img" />
    </div>
    <Menu :model="items" :pt="menuPt" class="p-menu-custom" />
    <Button
        :label="t('nav.logout')"
        icon="pi pi-sign-out"
        class="logout-btn"
        @click="handleLogout"
        outlined
        severity="danger"
    />
  </aside>

  <div class="content">
    <header class="topbar">
      <!-- Botón hamburguesa para móvil -->
      <Button
          icon="pi pi-bars"
          class="mobile-menu-btn"
          @click="toggleMobileMenu"
          text
          rounded
      />

      <div class="header-left">
        <LanguageSwitcher class="ml-3" />
        <span class="date-text">{{ day }} · <b>{{ date }} de {{ month }}</b> · {{hour}}</span>
      </div>
      <div class="header-right">
        <span class="greeting-text">{{ t('header.greeting') }}, <b>{{userName}}</b></span>
        <avatar icon="pi pi-user" class="ml-2" size="large" style="background-color: #dee9fc; color: #1a2551" shape="circle" />
      </div>
    </header>
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Menu from 'primevue/menu'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'
import { usePersonalizationStore } from '@/personalization/application/personalization.js'
import { useAuth } from '@/identity/application/composables/useAuth.js'
import { useDateTime } from '@/shared/presentation/composables/useDateTime.js'

const router = useRouter()
const personalizationStore = usePersonalizationStore()
const { userId, userName, logout } = useAuth()
const { day, date, month, hour } = useDateTime()
const { t } = useI18n()

// Estado del menú móvil
const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function handleLogout() {
  personalizationStore.clearStore()
  logout()
  router.push({ name: 'login' })
}

// ✅ Usa computed para que las traducciones sean reactivas
const items = computed(() => [
  {
    label: t('nav.dashboard'),
    icon: 'pi pi-objects-column',
    command: () => {
      router.push({ name: 'dashboard' })
      isMobileMenuOpen.value = false
    }
  },
  {
    label: t('nav.alerts'),
    icon: 'pi pi-bell',
    command: () => {
      router.push({ name: 'alerts' })
      isMobileMenuOpen.value = false
    }
  },
  {
    label: t('nav.devices'),
    icon: 'pi pi-clipboard',
    command: () => {
      router.push({ name: 'devices' })
      isMobileMenuOpen.value = false
    }
  },
  {
    label: t('nav.subscriptions'),
    icon: 'pi pi-credit-card',
    command: () => {
      router.push({ name: 'subscriptions' })
      isMobileMenuOpen.value = false
    }
  },
  {
    label: t('nav.rewards'),
    icon: 'pi pi-gift',
    command: () => {
      router.push({ name: 'rewards' })
      isMobileMenuOpen.value = false
    }
  },
  {
    label: t('nav.configuration'),
    icon: 'pi pi-cog',
    command: () => {
      router.push('/configuration')
      isMobileMenuOpen.value = false
    }
  }
])

const menuPt = {
  root: { class: 'my-menu-root' },
  list: { class: 'my-menu-list' }
}
</script>


<style scoped>
/* Overlay oscuro para móvil */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

.sidebar {
  width: 15rem;
  background: #fff;
  min-height: 100vh;
  box-shadow: 2px 0 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  font-weight: 500;
  transition: transform 0.3s ease;
}

.container-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.8em;
}

.logo-img {
  max-height: 5em;
  max-width: 5em;
  display: block;
}

/* Botón hamburguesa - oculto por defecto */
.mobile-menu-btn {
  display: none;
}

:deep(.p-menu-item-icon) {
  color: #000 !important;
}

:deep(.my-menu-root) { border: none; }
:deep(.my-menu-list) { gap: 1em !important; }
:deep(.p-menu-custom .p-menu-item:not(.p-disabled) .p-menu-item-content:hover) {
  background: #002349;
  color: #ffffff;
}
:deep(.p-menu-custom .p-menu-item:not(.p-disabled) .p-menu-item-content:hover .p-menu-item-icon),
:deep(.p-menu-custom .p-menu-item:not(.p-disabled) .p-menu-item-content:hover a) {
  color: inherit !important;
  fill: currentColor !important;
}

.logout-btn {
  margin-top: auto;
  border: none !important;
}
.logout-btn:hover {
  background: none !important;
  box-shadow: none !important;
  text-decoration: underline;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 56px;
  background: #f5f5f5;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.main {
  flex: 1;
  padding: 2rem;
  background: #fafbfc;
}

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .mobile-overlay {
    display: block;
  }

  .mobile-menu-btn {
    display: block !important;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 999;
    transform: translateX(-100%);
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .topbar {
    padding: 0 1rem;
  }

  .date-text {
    display: none;
  }

  .greeting-text {
    display: none;
  }

  .main {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .header-left {
    gap: 0.5rem;
  }

  .ml-3 {
    margin-left: 0.5rem !important;
  }
}
</style>
