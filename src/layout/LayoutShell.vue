<template>

  <aside class="sidebar">
    <div class="brand">Energix</div>
    <nav class="sidenav">
      <Router-link :to="{name:'profile'}" class="nav" active-class="active"><span>Dashboard</span></Router-link>
      <Router-link :to="{name:'usage'}" class="nav" active-class="active"><span>Consumo</span></Router-link>
      <Router-link :to="{name:'alerts'}" class="nav" active-class="active"><span>Alertas</span></Router-link>
      <Router-link :to="{name:'reports'}" class="nav" active-class="active"><span>Reportes</span></Router-link>
      <Router-link :to="{name:'configuration'}" class="nav" active-class="active"><span>Configuración</span></Router-link>
    </nav>
  </aside>
    <div class="content">
      <header class="topbar"></header>
    <main class="main">
      <slot />
    </main>
    </div>

</template>
<script setup>import {RouterLink} from 'vue-router'
</script>