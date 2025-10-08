<template>
  <div class="dashboard">
    <!-- Sidebar fija a la izquierda -->
    <aside class="sidebar">
      <nav class="menu">
        <ul>
          <li>Dashboard</li>
          <li>Consumo</li>
          <li>Alertas</li>
          <li>Reportes</li>
          <li>Configuración</li>
        </ul>
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

      <main class="main">
        <section aria-labelledby="ov-title">
          <h2 id="ov-title" class="section-title">Overview</h2>
          <div class="kpi-group">
            <article v-if="personalization.kpiCurrent" class="kpi">
              <h3 class="kpi-title">Consumo actual</h3>
              <div class="kpi-value">2.3 kWh</div>
              <div class="kpi-sub">+10% ahorrado vs ayer</div>
            </article>
            <article class="kpi">
              <h3 class="kpi-title">Consumo de hoy</h3>
              <div class="kpi-value">3.2 kWh</div>
              <div class="kpi-sub">Hasta ahora / 8.5 kWh proyectado</div>
            </article>
            <article v-if="personalization.kpiMonthly" class="kpi">
              <h3 class="kpi-title">Consumo mensual</h3>
              <div class="kpi-value">200 kWh</div>
              <div class="kpi-sub">-80% de una meta de 250 kWh</div>
            </article>
            <article v-if="personalization.kpiCost" class="kpi">
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
          <figure v-if="personalization.chartHourly" class="card chart-box col-span-8">
            <h3>Consumo de energía hoy (por hora)</h3>
            <select v-model="habitacionHora" @change="actualizarHora" style="margin-bottom: 1rem;">
              <option value="baño">Baño</option>
              <option value="cocina">Cocina</option>
              <option value="sala">Sala</option>
              <option value="habitacion">Habitación</option>
            </select>
            <canvas id="consumoPorHora"></canvas>
          </figure>

          <figure v-if="personalization.chartDevice" class="card chart-box col-span-4">
            <h3>Consumo por dispositivo</h3>
            <select v-model="habitacionSeleccionada" @change="actualizarDispositivo" style="margin-bottom: 1rem;">
              <option value="baño">Baño</option>
              <option value="cocina">Cocina</option>
              <option value="sala">Sala</option>
              <option value="habitacion">Habitación</option>
            </select>
            <canvas id="consumoPorDispositivo"></canvas>
          </figure>

          <figure v-if="personalization.chartMonthly" class="card chart-box col-span-12">
            <h3>Consumo este mes (diario)</h3>
            <select v-model="habitacionMes" @change="actualizarMes" style="margin-bottom: 1rem;">
              <option value="baño">Baño</option>
              <option value="cocina">Cocina</option>
              <option value="sala">Sala</option>
              <option value="habitacion">Habitación</option>
            </select>
            <canvas id="consumoPorMes"></canvas>
          </figure>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
import { usePersonalizationStore } from '../stores/personalization'

const personalization = usePersonalizationStore()

Chart.register(...registerables)

let charts = { hora: null, mes: null, dispositivo: null }

const habitacionHora = ref('baño')
const habitacionMes = ref('baño')
const habitacionSeleccionada = ref('baño')

const datosPorHora = {
  bano: [1, 2, 1.5, 3, 2.5, 1.8],
  cocina: [0.5, 1, 0.8, 1.2, 1.5, 1.1],
  sala: [0.7, 1.3, 1.1, 1.8, 1.6, 1.2],
  habitacion: [0.6, 1.1, 0.9, 1.4, 1.3, 1]
}

const datosPorMes = {
  bano: [5, 6, 7, 5, 6, 7, 6],
  cocina: [3, 4, 5, 4, 5, 6, 5],
  sala: [4, 5, 6, 5, 6, 7, 6],
  habitacion: [2, 3, 4, 3, 4, 5, 4]
}

const dispositivosPorHabitacion = {
  bano: { labels: ['Ducha', 'Terma'], data: [30, 70] },
  cocina: { labels: ['Microondas', 'Horno', 'Refrigeradora'], data: [20, 30, 50] },
  sala: { labels: ['Lámpara', 'Televisor'], data: [40, 60] },
  habitacion: { labels: ['Laptop', 'Lámpara'], data: [55, 45] }
}

function crearGraficoHora() {
  const cHora = document.getElementById('consumoPorHora')
  if (cHora) {
    charts.hora?.destroy()
    charts.hora = new Chart(cHora.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['12 AM','4 AM','8 AM','12 PM','4 PM','8 PM'],
        datasets: [{
          label: 'Consumo (kWh)',
          data: datosPorHora[habitacionHora.value],
          borderColor: '#0b2541',
          backgroundColor: 'rgba(11,37,65,0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    })
  }
}

function crearGraficoMes() {
  const cMes = document.getElementById('consumoPorMes')
  if (cMes) {
    charts.mes?.destroy()
    charts.mes = new Chart(cMes.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['1','2','3','4','5','6','7'],
        datasets: [{
          label: 'Consumo por día (kWh)',
          data: datosPorMes[habitacionMes.value],
          backgroundColor: '#0b2541'
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    })
  }
}

function crearGraficoDispositivo() {
  const cDisp = document.getElementById('consumoPorDispositivo')
  if (cDisp) {
    charts.dispositivo?.destroy()
    const { labels, data } = dispositivosPorHabitacion[habitacionSeleccionada.value]
    charts.dispositivo = new Chart(cDisp.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#0b2541','#f46161ff','#ffd700','#4caf50'],
          hoverOffset: 4
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    })
  }
}

function actualizarHora() {
  crearGraficoHora()
}

function actualizarMes() {
  crearGraficoMes()
}

function actualizarDispositivo() {
  crearGraficoDispositivo()
}

onMounted(() => {
  crearGraficoHora()
  crearGraficoMes()
  crearGraficoDispositivo()
})

onBeforeUnmount(() => {
  Object.values(charts).forEach(ch => ch && ch.destroy())
})
</script>

<style scoped>

.dashboard {
  display: flex;
  height: 100vh;
  background: #f6f8fa;
}

</style>
