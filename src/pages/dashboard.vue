<template>
  <div class="content">
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
            <div class="kpi-value">{{ currentPowerKwh.toFixed(2) }} kWh</div>
            <div class="kpi-sub">+10% ahorrado vs ayer</div>
          </article>
          <article class="kpi">
            <h3 class="kpi-title">Consumo de hoy</h3>
            <div class="kpi-value">{{ todayTotalKwh.toFixed(2) }} kWh</div>
            <div class="kpi-sub">Hasta ahora / {{ projectedTodayKwh.toFixed(2) }} kWh proyectado</div>
          </article>
          <article v-if="personalization.kpiMonthly" class="kpi">
            <h3 class="kpi-title">Consumo mensual</h3>
            <div class="kpi-value">{{ monthTotalKwh.toFixed(0) }} kWh</div>
            <div class="kpi-sub">-80% de una meta de 250 kWh</div>
          </article>
          <article v-if="personalization.kpiCost" class="kpi">
            <h3 class="kpi-title">Costo estimado</h3>
            <div class="kpi-value">S/{{ estimatedCost.toFixed(2) }}</div>
            <div class="kpi-sub">vs S/48 el mes pasado</div>
          </article>
          <article class="kpi">
            <h3 class="kpi-title">Promedio diario</h3>
            <div class="kpi-value">{{ dailyAvgKwh.toFixed(1) }} kWh</div>
            <div class="kpi-sub">Historial últimos 3 meses</div>
          </article>
        </div>
      </section>

      <section class="grid-12">
        <figure v-if="personalization.chartHourly" class="card chart-box col-span-8">
          <h3>Consumo de energía hoy (por hora)</h3>
          <select :value="selectedZoneIdHora" @change="onZoneChangeHora" style="margin-bottom: 1rem;">
            <option v-for="z in zones" :key="z.id" :value="z.id">{{ z.name }}</option>
          </select>
          <select :value="selectedDeviceId" @change="onDeviceChange" style="margin-left: .5rem; margin-bottom: 1rem;">
            <option v-for="d in devicesHora" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>
          <canvas id="consumoPorHora"></canvas>
        </figure>

        <figure v-if="personalization.chartDevice" class="card chart-box col-span-4">
          <h3>Consumo por dispositivo</h3>
          <select :value="selectedZoneIdDispositivo" @change="onZoneChangeDispositivo" style="margin-bottom: 1rem;">
            <option v-for="z in zones" :key="z.id" :value="z.id">{{ z.name }}</option>
          </select>
          <canvas id="consumoPorDispositivo"></canvas>
        </figure>

        <figure v-if="personalization.chartMonthly" class="card chart-box col-span-12">
          <h3>Consumo este mes (diario)</h3>
          <select :value="selectedZoneIdMes" @change="onZoneChangeMes" style="margin-bottom: 1rem;">
            <option v-for="z in zones" :key="z.id" :value="z.id">{{ z.name }}</option>
          </select>
          <canvas id="consumoPorMes"></canvas>
        </figure>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import { http } from '@/shared/infrastructure/base-api'
import { usePersonalizationStore } from '@/stores/personalization'

const personalization = usePersonalizationStore()

Chart.register(...registerables)

// Estado
const userId = 2
const zones = ref([])
const devicesHora = ref([])
const devicesShareCache = ref([])

const selectedZoneIdHora = ref(null)
const selectedZoneIdMes = ref(null)
const selectedZoneIdDispositivo = ref(null)
const selectedDeviceId = ref(null)
let charts = { hora: null, mes: null, dispositivo: null }

// API helpers (tu json-server mapea /api/v1/* a /$1)
async function loadZones() {
  zones.value = await http.get(`/api/v1/zones?userId=${userId}`)
}
async function loadDevicesFor(zoneId) {
  return await http.get(`/api/v1/devices?zoneId=${zoneId}`)
}

// Generadores determinísticos (placeholder de consumo)
function seedRand(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}
function genHourlyFromDeviceId(deviceId) {
  const rand = seedRand(deviceId * 9301 + 49297)
  return Array.from({ length: 24 }, (_, h) => {
    const base = 0.05 + (h >= 18 && h <= 22 ? 0.2 : h >= 6 && h <= 9 ? 0.12 : 0.08)
    const noise = (rand() - 0.5) * 0.04
    return Number((base + noise).toFixed(3))
  })
}
function genWeekFromZoneId(zoneId) {
  const rand = seedRand(zoneId * 14071 + 7)
  return Array.from({ length: 7 }, (_, d) => {
    const base = 0.9 + 0.4 * Math.sin((d / 7) * Math.PI * 2)
    const noise = (rand() - 0.5) * 0.2
    return Number(Math.max(0.2, base + noise).toFixed(2))
  })
}
function genShareFromDevices(devices) {
  if (!devices?.length) return { labels: [], data: [] }
  const weights = devices.map(d => {
    const r = seedRand(d.id * 101)
    return 0.5 + r() * 2
  })
  const total = weights.reduce((a, b) => a + b, 0)
  const data = weights.map(w => Number(((w / total) * 100).toFixed(2)))
  const labels = devices.map(d => d.name || `Device ${d.id}`)
  return { labels, data }
}

// Charts
const horaLabels6 = ['12 AM','4 AM','8 AM','12 PM','4 PM','8 PM']
function sampleTo6(arr24) { return [arr24[0], arr24[4], arr24[8], arr24[12], arr24[16], arr24[20]] }

async function renderHora() {
  if (!selectedZoneIdHora.value) return
  devicesHora.value = await loadDevicesFor(selectedZoneIdHora.value)
  if (!selectedDeviceId.value) selectedDeviceId.value = devicesHora.value[0]?.id ?? null
  if (!selectedDeviceId.value) return

  const buckets24 = genHourlyFromDeviceId(selectedDeviceId.value)
  const data6 = sampleTo6(buckets24)
  const ctx = document.getElementById('consumoPorHora')?.getContext('2d')
  if (!ctx) return
  charts.hora?.destroy()
  charts.hora = new Chart(ctx, {
    type: 'line',
    data: {
      labels: horaLabels6,
      datasets: [{
        label: 'Consumo (kWh)',
        data: data6,
        borderColor: '#0b2541',
        backgroundColor: 'rgba(11,37,65,0.2)',
        fill: true,
        tension: 0.3
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  })
}

async function renderMes() {
  if (!selectedZoneIdMes.value) return
  const buckets7 = genWeekFromZoneId(selectedZoneIdMes.value)
  const ctx = document.getElementById('consumoPorMes')?.getContext('2d')
  if (!ctx) return
  charts.mes?.destroy()
  charts.mes = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1','2','3','4','5','6','7'],
      datasets: [{ label: 'Consumo por día (kWh)', data: buckets7, backgroundColor: '#0b2541' }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  })
}

async function renderDispositivo() {
  if (!selectedZoneIdDispositivo.value) return
  devicesShareCache.value = await loadDevicesFor(selectedZoneIdDispositivo.value)
  const { labels, data } = genShareFromDevices(devicesShareCache.value)
  const ctx = document.getElementById('consumoPorDispositivo')?.getContext('2d')
  if (!ctx) return
  charts.dispositivo?.destroy()
  charts.dispositivo = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: ['#0b2541','#f46161ff','#ffd700','#4caf50'] }] },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  })
}

// Handlers
async function onZoneChangeHora(e) {
  selectedZoneIdHora.value = Number(e.target.value)
  selectedDeviceId.value = null
  await renderHora()
}
async function onDeviceChange(e) {
  selectedDeviceId.value = Number(e.target.value)
  await renderHora()
}
async function onZoneChangeMes(e) {
  selectedZoneIdMes.value = Number(e.target.value)
  await renderMes()
}
async function onZoneChangeDispositivo(e) {
  selectedZoneIdDispositivo.value = Number(e.target.value)
  await renderDispositivo()
}

// KPIs
const todayTotalKwh = computed(() => {
  const data = charts.hora?.data?.datasets?.[0]?.data ?? []
  return data.reduce((a, v) => a + Number(v || 0), 0)
})
const currentPowerKwh = computed(() => {
  const data = charts.hora?.data?.datasets?.[0]?.data ?? []
  return data[data.length - 1] ?? 0
})
const monthTotalKwh = computed(() => {
  const data = charts.mes?.data?.datasets?.[0]?.data ?? []
  return data.reduce((a, v) => a + Number(v || 0), 0)
})
const dailyAvgKwh = computed(() => {
  const data = charts.mes?.data?.datasets?.[0]?.data ?? []
  return data.length ? (monthTotalKwh.value / data.length) : 0
})
const estimatedCost = computed(() => {
  const tarifa = 0.7
  return monthTotalKwh.value * tarifa
})
const projectedTodayKwh = computed(() => {
  const data = charts.hora?.data?.datasets?.[0]?.data ?? []
  if (!data.length) return 0
  const acum = data.reduce((a, b) => a + Number(b || 0), 0)
  const prom = acum / data.length
  return prom * 24 / 4
})

// Mount
onMounted(async () => {
  await loadZones()
  if (zones.value.length) {
    selectedZoneIdHora.value = zones.value[0].id
    selectedZoneIdMes.value = zones.value[0].id
    selectedZoneIdDispositivo.value = zones.value[0].id
  }
  await renderHora()
  await renderMes()
  await renderDispositivo()
})

onBeforeUnmount(() => {
  Object.values(charts).forEach(ch => ch && ch.destroy())
})
</script>

<style scoped>
.chart-box canvas { min-height: 320px; width: 100%; }
.grid-12 { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 1rem; }
.col-span-8 { grid-column: span 8 / span 8; }
.col-span-4 { grid-column: span 4 / span 4; }
.col-span-12 { grid-column: span 12 / span 12; }
</style>
