<script setup>
// Componente de layout vacío para rutas públicas
</script>

<template>
  <div class="empty-layout">
    <slot />
  </div>
</template>

<style scoped>
.empty-layout {
  display: contents; /* No afecta al layout, renderiza hijos directamente */
}
</style>

