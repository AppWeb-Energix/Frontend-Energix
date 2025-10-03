<template>
  <div class="flex flex-col min-h-screen bg-gray-50 font-sans">

    <header class="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100 flex-shrink-0">
      <div class="text-sm text-gray-700">
        Lunes · 15 set. · <strong class="text-gray-900">18:18 p. m.</strong>
      </div>
      <div class="flex items-center space-x-2 text-gray-900 font-medium">
        Hola, JORGE <span>💡</span>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">

      <aside class="w-64 bg-white p-6 flex flex-col justify-between border-r border-gray-100 flex-shrink-0">
        <div>
          <h1 class="text-2xl font-bold mb-10 text-gray-900">Energix</h1>
          <nav class="space-y-2">
            <router-link to="/dashboard" :class="getLinkClass('/dashboard')">
              <i data-feather="grid" class="w-5 h-5"></i>
              <span>Dashboard</span>
            </router-link>

            <router-link to="/usage" :class="getLinkClass('/usage')">
              <i data-feather="zap" class="w-5 h-5"></i>
              <span>Consumo</span>
            </router-link>

            <router-link to="/alerts" :class="getLinkClass('/alerts')">
              <i data-feather="alert-triangle" class="w-5 h-5"></i>
              <span>Alertas</span>
            </router-link>

            <router-link to="/reports" :class="getLinkClass('/reports')">
              <i data-feather="folder" class="w-5 h-5"></i>
              <span>Reportes</span>
            </router-link>

            <router-link to="/configuration" :class="getLinkClass('/configuration')">
              <i data-feather="settings" class="w-5 h-5"></i>
              <span>Configuración</span>
            </router-link>
          </nav>
        </div>
        <div class="pt-8">
          <a href="#" class="flex items-center space-x-3 p-3 text-gray-600 hover:text-red-500 rounded-lg transition duration-150">
            <i data-feather="log-out" class="w-5 h-5"></i>
            <span>Log out</span>
          </a>
        </div>
      </aside>

      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { onMounted, nextTick } from 'vue';

const route = useRoute();

// Función para aplicar las clases de activo/inactivo al Sidebar
const getLinkClass = (path) => {
  const baseClass = "flex items-center space-x-3 p-3 rounded-lg transition duration-150";

  // Verifica si la ruta actual comienza con la ruta del enlace
  if (route.path.startsWith(path)) {
    // Estilo Activo (Azul)
    return `${baseClass} bg-blue-700 text-white font-medium shadow-md`;
  } else {
    // Estilo Inactivo (Gris)
    return `${baseClass} text-gray-600 hover:bg-gray-50`;
  }
};

// Inicialización de Feather Icons (asegúrate de que esté instalado en tu main.js o index.html)
onMounted(() => {
  if (typeof feather !== 'undefined') {
    nextTick(() => {
      feather.replace();
    });
  }
});
</script>

<style scoped>
/* No se requiere CSS adicional si Tailwind está configurado correctamente */
</style>