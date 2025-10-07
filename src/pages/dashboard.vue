<template>
  <!-- Sidebar fija a la izquierda -->
  <aside class="sidebar">
    <div class="brand">Energix</div>
    <nav class="sidenav">
      <a class="active" href="#">
        <img :src="Dashboard" alt="" aria-hidden="true">
        <span>Dashboard</span></a>
     <a  href="#">
       <img :src="Consumo" alt="" aria-hidden="true">
       <span>Consumo</span></a>

      <a  href="#">
        <img :src="Alertas" alt="" aria-hidden="true">
        <span>Alertas</span></a>

      <a  href="#">
        <img :src="Reportes" alt="" aria-hidden="true">
        <span>Reportes</span></a>

      <a  href="#">
        <img :src="Configu" alt="" aria-hidden="true">
        <span>Configuración</span></a>
    </nav>
  </aside>

  <!-- Contenido principal -->
  <div class="content">
    <!-- Header -->
    <header class="topbar">
      <div class="greeting">
        <h1>Bienvenido de vuelta, <strong>Jorge</strong>.</h1>
      </div>
      <div class="top-meta">
        <div class="datetime">
          <div>Jueves 25 - Set</div>
          <div>11:00 am</div>
        </div>
        <button class="icon-btn" aria-label="Notificaciones"></button>
        <div class="user">
          <img class="avatar" src="" alt="Foto de Jorge Ramírez" />
          <div class="user-meta">
            <div class="name">Jorge Ramírez</div>
            <div class="plan">Plan Estudiantil</div>
          </div>
        </div>
      </div>
    </header>

    <!-- 👇 OJO: main con apertura y CIERRE, nada de <main /> -->
    <main class="main">
      <section aria-labelledby="ov-title">
        <h2 id="ov-title" class="section-title">Overview</h2>
        <div class="kpi-group">
          <article class="kpi">
            <h3 class="kpi-title">Consumo actual</h3>
            <div class="kpi-value">2.3 kWh</div>
            <div class="kpi-sub">+10% ahorrado vs ayer</div>
          </article>
          <article class="kpi">
            <h3 class="kpi-title">Consumo de hoy</h3>
            <div class="kpi-value">3.2 kWh</div>
            <div class="kpi-sub">Hasta ahora / 8.5 kWh proyectado</div>
          </article>
          <article class="kpi">
            <h3 class="kpi-title">Consumo mensual</h3>
            <div class="kpi-value">200 kWh</div>
            <div class="kpi-sub">-80% de una meta de 250 kWh</div>
          </article>
          <article class="kpi">
            <h3 class="kpi-title">Costo estimado</h3>
            <div class="kpi-value">S/45.20</div>
            <div class="kpi-sub">vs S/48 el mes pasado</div>
          </article>
          <article class="kpi">
            <h3 class="kpi-title">Promedio diario</h3>
            <div class="kpi-value">7.5 kWh</div>
            <div class="kpi-sub">Historial últimos 3 meses</div>
          </article>
        </div>
      </section>

      <section class="grid-12">
        <figure class="card chart-box col-span-8">
          <h3>Consumo de energía hoy (por hora)</h3>
          <canvas id="consumoPorHora"></canvas>
        </figure>

        <figure class="card chart-box col-span-4">
          <h3>Consumo por dispositivo</h3>
          <canvas id="consumoPorDispositivo"></canvas>
        </figure>

        <figure class="card chart-box col-span-12">
          <h3>Consumo este mes (diario)</h3>
          <canvas id="consumoPorMes"></canvas>
        </figure>
      </section>
    </main>
  </div>
</template>
<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
import Dashboard from '../assets/Dashboard.png'
import Consumo from '../assets/Consumo.png'
import Alertas from '../assets/Alertas.png'
import Reportes from '../assets/Reportes.png'
import Configu from '../assets/Configu.png'
import Cons from '../assets/Cons.png'
Chart.register(...registerables) // <-- importante

// Para limpiar en HMR / cambios
let charts = { hora: null, mes: null, dispositivo: null }

onMounted(() => {
  // 1) Línea (por hora)
  const cHora = document.getElementById('consumoPorHora')
  if (cHora) {
    charts.hora?.destroy()
    charts.hora = new Chart(cHora.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['12 AM','4 AM','8 AM','12 PM','4 PM','8 PM'],
        datasets: [{
          label: 'Consumo (kWh)',
          data: [1,2,1.5,3,2.5,1.8],
          borderColor: '#0b2541',
          backgroundColor: 'rgba(11,37,65,0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    })
  }

  // 2) Barras (por día del mes)
  const cMes = document.getElementById('consumoPorMes')
  if (cMes) {
    charts.mes?.destroy()
    charts.mes = new Chart(cMes.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['1','2','3','4','5','6','7'],
        datasets: [{
          label: 'Consumo por día (kWh)',
          data: [20,18,22,19,24,21,23],
          backgroundColor: '#0b2541'
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    })
  }

  // 3) Dona (por dispositivo)
  const cDisp = document.getElementById('consumoPorDispositivo')
  if (cDisp) {
    charts.dispositivo?.destroy()
    charts.dispositivo = new Chart(cDisp.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Refrigerador','Laptop'],
        datasets: [{
          data: [60,40],
          backgroundColor: ['#0b2541','#f46161ff'],
          hoverOffset: 4
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    })
  }
})

onBeforeUnmount(() => {
  Object.values(charts).forEach(ch => ch && ch.destroy())
})
</script>
