<template>

  <aside class="sidebar">
    <div class="brand">Energix</div>
    <nav class="sidenav">
      <Router-link :to="{name:'dashboard'}" class="nav" active-class="active"><span>Dashboard</span></Router-link>
      <!-- Eliminado enlace a Consumo (usage) -->
      <!-- <Router-link :to="{name:'usage'}" class="nav" active-class="active"><span>Consumo</span></Router-link> -->
      <Router-link :to="{name:'alerts'}" class="nav" active-class="active"><span>Alertas</span></Router-link>
      <!-- Eliminado enlace a Reportes (reports) -->
      <!-- <Router-link :to="{name:'reports'}" class="nav" active-class="active"><span>Reportes</span></Router-link> -->
      <Router-link :to="{name:'devices'}" class="nav" active-class="active"><span>Mis Dispositivos</span></Router-link>
      <Router-link :to="{name:'subscriptions'}" class="nav" active-class="active"><span>Suscripciones</span></Router-link>
      <Router-link :to="{name:'rewards'}" class="nav" active-class="active"><span>Recompensas</span></Router-link>
      <Router-link to="/configuration" class="nav" active-class="active"><span>Configuración</span></Router-link>

      <button @click="handleLogout" class="logout-button">
        Cerrar Sesión
      </button>
    </nav>
  </aside>
    <div class="content">
      <header class="topbar"></header>
    <main class="main">
      <slot />
    </main>
    </div>

</template>
<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { logout } from '../utils/mockAuth.js'
import { usePersonalizationStore } from '../stores/personalization.js'

const router = useRouter()
const personalizationStore = usePersonalizationStore()

function handleLogout() {
  personalizationStore.resetPersonalization() // Limpia la personalización en memoria
  logout() // Borra localStorage
  router.push({ name: 'login' })
}
</script>

<style scoped>
.logout-button {
  margin-top: auto;
  padding: 12px;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>