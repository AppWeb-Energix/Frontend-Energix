<template>
  <div class="content">
    <header class="topbar">
      <div class="greeting">
        <h1>Bienvenido de vuelta, <strong>{{ userName }}</strong>.</h1>
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
            <div class="name">{{ userName }}</div>
            <div class="plan">{{ userPlan }}</div>
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
import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { http } from '@/shared/infrastructure/base-api'
import { usePersonalizationStore } from '@/stores/personalization'
import { useAuth } from '@/composables/useAuth'

const personalization = usePersonalizationStore()
const { userId, userName, userPlan, getCurrentUser } = useAuth()

onMounted(() => {
  personalization.loadPersonalization()
})

Chart.register(...registerables)

// Estado
const zones = ref([])
const devicesHora = ref([])
const devicesShareCache = ref([])

// Datos de los gráficos (reactivos)
const chartData = ref({
  hourly: [],
  monthly: [],
  deviceShare: { labels: [], data: [] }
})

const selectedZoneIdHora = ref(null)
const selectedZoneIdMes = ref(null)
const selectedZoneIdDispositivo = ref(null)
const selectedDeviceId = ref(null)
let charts = { hora: null, mes: null, dispositivo: null }

// Estado separado para evitar reactividad
const isChartsReady = ref(false)

// API helpers (tu json-server mapea /api/v1/* a /$1)
async function loadZones() {
  if (!userId.value) {
    console.warn('UserId not available yet')
    return []
  }
  try {
    const zones = await http.get(`/api/v1/zones?userId=${userId.value}`)
    console.log('Zones loaded:', zones)
    return zones
  } catch (error) {
    console.error('Error loading zones:', error)
    return []
  }
}

async function loadDevicesFor(zoneId) {
  if (!zoneId) {
    console.warn('ZoneId not provided')
    return []
  }
  try {
    const devices = await http.get(`/api/v1/devices?zoneId=${zoneId}`)
    console.log('Devices loaded for zone', zoneId, ':', devices)
    return devices
  } catch (error) {
    console.error('Error loading devices for zone', zoneId, ':', error)
    return []
  }
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
  console.log('renderHora called, selectedZoneIdHora:', selectedZoneIdHora.value)
  if (!selectedZoneIdHora.value) {
    console.warn('No zone selected for hora chart')
    return
  }

  devicesHora.value = await loadDevicesFor(selectedZoneIdHora.value)
  console.log('Devices for hora chart:', devicesHora.value)

  if (!selectedDeviceId.value) selectedDeviceId.value = devicesHora.value[0]?.id ?? null
  if (!selectedDeviceId.value) {
    console.warn('No device selected for hora chart')
    return
  }

  const buckets24 = genHourlyFromDeviceId(selectedDeviceId.value)
  const data6 = sampleTo6(buckets24)
  console.log('Generated hourly data:', data6)

  // Guardar datos en reactive ref
  chartData.value.hourly = data6

  const ctx = document.getElementById('consumoPorHora')?.getContext('2d')
  if (!ctx) {
    console.error('Canvas context not found for consumoPorHora')
    return
  }

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
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  })
  console.log('Hora chart rendered successfully')
}

async function renderMes() {
  console.log('renderMes called, selectedZoneIdMes:', selectedZoneIdMes.value)
  if (!selectedZoneIdMes.value) {
    console.warn('No zone selected for mes chart')
    return
  }

  const buckets7 = genWeekFromZoneId(selectedZoneIdMes.value)
  console.log('Generated monthly data:', buckets7)

  // Guardar datos en reactive ref
  chartData.value.monthly = buckets7

  const ctx = document.getElementById('consumoPorMes')?.getContext('2d')
  if (!ctx) {
    console.error('Canvas context not found for consumoPorMes')
    return
  }

  charts.mes?.destroy()
  charts.mes = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1','2','3','4','5','6','7'],
      datasets: [{
        label: 'Consumo por día (kWh)',
        data: buckets7,
        backgroundColor: '#0b2541'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  })
  console.log('Mes chart rendered successfully')
}

async function renderDispositivo() {
  console.log('renderDispositivo called, selectedZoneIdDispositivo:', selectedZoneIdDispositivo.value)
  if (!selectedZoneIdDispositivo.value) {
    console.warn('No zone selected for dispositivo chart')
    return
  }

  devicesShareCache.value = await loadDevicesFor(selectedZoneIdDispositivo.value)
  console.log('Devices for dispositivo chart:', devicesShareCache.value)

  const { labels, data } = genShareFromDevices(devicesShareCache.value)
  console.log('Generated device share data:', { labels, data })

  // Guardar datos en reactive ref
  chartData.value.deviceShare = { labels, data }

  const ctx = document.getElementById('consumoPorDispositivo')?.getContext('2d')
  if (!ctx) {
    console.error('Canvas context not found for consumoPorDispositivo')
    return
  }

  charts.dispositivo?.destroy()
  charts.dispositivo = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#0b2541','#f46161ff','#ffd700','#4caf50']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  })
  console.log('Dispositivo chart rendered successfully')
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

// KPIs - Ahora usando chartData ref en lugar de acceder directamente a los objetos Chart
const todayTotalKwh = computed(() => {
  return chartData.value.hourly.reduce((a, v) => a + Number(v || 0), 0)
})

const currentPowerKwh = computed(() => {
  const data = chartData.value.hourly
  return data[data.length - 1] ?? 0
})

const monthTotalKwh = computed(() => {
  return chartData.value.monthly.reduce((a, v) => a + Number(v || 0), 0)
})

const dailyAvgKwh = computed(() => {
  const data = chartData.value.monthly
  return data.length ? (monthTotalKwh.value / data.length) : 0
})

const estimatedCost = computed(() => {
  const tarifa = 0.7
  return monthTotalKwh.value * tarifa
})

const projectedTodayKwh = computed(() => {
  const data = chartData.value.hourly
  if (!data.length) return 0
  const acum = data.reduce((a, b) => a + Number(b || 0), 0)
  const prom = acum / data.length
  return prom * 24 / 4
})

// Mount
onMounted(async () => {
  console.log('Dashboard mounting...')
  await getCurrentUser()
  console.log('Current user loaded, userId:', userId.value)

  zones.value = await loadZones()
  console.log('Zones loaded:', zones.value)

  if (zones.value.length) {
    selectedZoneIdHora.value = zones.value[0].id
    selectedZoneIdMes.value = zones.value[0].id
    selectedZoneIdDispositivo.value = zones.value[0].id
    console.log('Selected zone IDs set')

    // Usar nextTick para asegurar DOM listo y evitar loops
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 200))

    try {
      await renderHora()
      await renderMes()
      await renderDispositivo()
      isChartsReady.value = true
      console.log('All charts rendered successfully')
    } catch (error) {
      console.error('Error rendering charts:', error)
    }
  } else {
    console.warn('No zones found for user', userId.value)
  }
})

// Watcher para cambio de usuario
watch(userId, async (newUserId, oldUserId) => {
  if (newUserId !== oldUserId) {
    // Destruir charts existentes
    Object.values(charts).forEach(ch => ch && ch.destroy())
    charts = { hora: null, mes: null, dispositivo: null }
    // Limpiar datos reactivos
    chartData.value = { hourly: [], monthly: [], deviceShare: { labels: [], data: [] } }
    zones.value = []
    devicesHora.value = []
    devicesShareCache.value = []
    selectedZoneIdHora.value = null
    selectedZoneIdMes.value = null
    selectedZoneIdDispositivo.value = null
    selectedDeviceId.value = null
    isChartsReady.value = false
    // Recargar zonas y renderizar charts solo si hay usuario
    if (newUserId) {
      zones.value = await loadZones()
      if (zones.value.length) {
        selectedZoneIdHora.value = zones.value[0].id
        selectedZoneIdMes.value = zones.value[0].id
        selectedZoneIdDispositivo.value = zones.value[0].id
        await nextTick()
        await new Promise(resolve => setTimeout(resolve, 200))
        try {
          await renderHora()
          await renderMes()
          await renderDispositivo()
          isChartsReady.value = true
        } catch (error) {
          console.error('Error rendering charts after user change:', error)
        }
      }
    }
  }
})

onBeforeUnmount(() => {
  Object.values(charts).forEach(ch => ch && ch.destroy())
})
</script>

<style scoped>
.chart-box {
  max-height: 400px;
  overflow: hidden;
  position: relative;
}
.chart-box canvas {
  min-height: 320px;
  max-height: 360px;
  height: 320px !important;
  width: 100% !important;
  display: block;
}
.grid-12 { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 1rem; }
.col-span-8 { grid-column: span 8 / span 8; }
.col-span-4 { grid-column: span 4 / span 4; }
.col-span-12 { grid-column: span 12 / span 12; }
</style>
