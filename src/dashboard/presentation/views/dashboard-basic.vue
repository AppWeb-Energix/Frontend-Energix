<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Title } from 'chart.js'
import { Doughnut, Bar, Line } from 'vue-chartjs'
import { DevicesApi, onDeviceChange } from '@/device/infrastructure/devices.endpoint.js'
import { useAuth } from '@/identity/application/composables/useAuth.js'
import Card from 'primevue/card'
import Dropdown from 'primevue/dropdown'

ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Title)

const { currentUser, getCurrentUser } = useAuth()
const loading = ref(true)
const devices = ref([])
const hasDevices = ref(false)

const timeFrame = ref('days')
const timeOptions = [
  { label: 'Días', value: 'days' },
  { label: 'Semanas', value: 'weeks' },
  { label: 'Meses', value: 'months' }
]

const deviceColors = ['#002349', '#0066CC', '#4A90E2', '#7FB3D5', '#B0D4F1', '#5E9ED6', '#1E5A8E', '#87CEEB', '#4682B4']

function generateEstimatedData() {
  if (!devices.value.length) return null

  // Consumo mensual real o estimado por dispositivo
  const deviceDistribution = {
    labels: devices.value.map(d => d.name || `Dispositivo ${d.id}`),
    data: devices.value.map(d => parseFloat(d.metrics?.monthly || (Math.random() * 250 + 50).toFixed(1)))
  }

  // Consumo temporal separado por dispositivo
  const today = new Date()
  const daysLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return d.toLocaleDateString('es-ES', { weekday: 'short' })
  })

  const weeksLabels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
  const monthsLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']

  // Generar datasets por dispositivo
  const consumptionByDevice = {
    days: {
      labels: daysLabels,
      datasets: devices.value.map((d, idx) => ({
        label: d.name || `Dispositivo ${d.id}`,
        data: Array.from({ length: 7 }, () => (Math.random() * 5 + 2).toFixed(1)),
        backgroundColor: deviceColors[idx % deviceColors.length]
      }))
    },
    weeks: {
      labels: weeksLabels,
      datasets: devices.value.map((d, idx) => ({
        label: d.name || `Dispositivo ${d.id}`,
        data: Array.from({ length: 4 }, () => (Math.random() * 30 + 20).toFixed(1)),
        backgroundColor: deviceColors[idx % deviceColors.length]
      }))
    },
    months: {
      labels: monthsLabels,
      datasets: devices.value.map((d, idx) => ({
        label: d.name || `Dispositivo ${d.id}`,
        data: Array.from({ length: 6 }, () => (Math.random() * 150 + 100).toFixed(1)),
        backgroundColor: deviceColors[idx % deviceColors.length]
      }))
    }
  }

  // Consumo por horas del día (patrón típico de hogar)
  const hourlyLabels = ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM', '10 PM']
  const hourlyValues = [0.8, 1.2, 2.5, 5.2, 3.8, 6.1, 4.3]

  return {
    deviceDistribution,
    consumption: consumptionByDevice,
    hourlyConsumption: { labels: hourlyLabels, values: hourlyValues }
  }
}

// 1. Gráfico circular - Dispositivos con kWh
const deviceChartData = computed(() => {
  const data = generateEstimatedData()
  if (!data) return { labels: [], datasets: [] }

  return {
    labels: data.deviceDistribution.labels.map((label, i) =>
        `${label}: ${data.deviceDistribution.data[i]} kWh`
    ),
    datasets: [{
      data: data.deviceDistribution.data,
      backgroundColor: deviceColors
    }]
  }
})

const deviceChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 15,
        font: { size: 12 }
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed} kWh`
      }
    }
  }
}

// 2. Histograma - Consumo por dispositivo
const histogramData = computed(() => {
  const data = generateEstimatedData()
  if (!data) return { labels: [], datasets: [] }

  const consumptionData = data.consumption[timeFrame.value]
  return {
    labels: consumptionData.labels,
    datasets: consumptionData.datasets
  }
})

const histogramOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        padding: 10,
        font: { size: 11 },
        usePointStyle: true,
        pointStyle: 'rectRounded'
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.parsed.y} kWh`
      }
    }
  },
  scales: {
    x: {
      stacked: false,
      grid: { display: false }
    },
    y: {
      beginAtZero: true,
      stacked: false,
      title: {
        display: true,
        text: 'Consumo (kWh)',
        font: { size: 13, weight: 'bold' }
      },
      ticks: {
        callback: (value) => `${value} kWh`
      }
    }
  }
}))

// 3. Gráfico de líneas - Consumo por horas (más claro)
const hourlyChartData = computed(() => {
  const data = generateEstimatedData()
  if (!data) return { labels: [], datasets: [] }

  return {
    labels: data.hourlyConsumption.labels,
    datasets: [{
      label: 'Consumo por Hora',
      data: data.hourlyConsumption.values,
      borderColor: '#002349',
      backgroundColor: 'rgba(0, 35, 73, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 7,
      pointHoverRadius: 9,
      pointStyle: 'circle',
      pointBackgroundColor: '#002349',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 3,
      borderWidth: 3
    }]
  }
})

const hourlyChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: { font: { size: 12 } }
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.y} kWh`
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: { font: { size: 11 } }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Consumo (kWh)',
        font: { size: 13, weight: 'bold' }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: {
        callback: (value) => `${value} kWh`,
        font: { size: 11 }
      }
    }
  }
}

async function loadDashboard() {
  loading.value = true
  try {
    await getCurrentUser()
    if (!currentUser.value?.id) {
      console.warn('⚠️ No hay usuario autenticado')
      loading.value = false
      return
    }
    devices.value = await DevicesApi.getByUserId(currentUser.value.id)
    hasDevices.value = devices.value.length > 0
    console.log('📊 Dispositivos cargados:', devices.value.length)
  } catch (err) {
    console.error('❌ Error loading dashboard:', err)
  } finally {
    loading.value = false
  }
}

let stopListening

onMounted(async () => {
  await loadDashboard()
  stopListening = onDeviceChange(async () => {
    console.log('📡 Cambio en dispositivos → recargando dashboard...')
    await loadDashboard()
  })
})

onBeforeUnmount(() => {
  stopListening?.()
})

</script>

<template>
  <div class="dashboard-wrap">
    <h2 class="dashboard-title">Dashboard de Consumo</h2>

    <div v-if="loading" class="loading-state">
      <p>Cargando datos...</p>
    </div>

    <div v-else-if="!hasDevices" class="empty-state">
      <p>🔌 No tienes dispositivos vinculados todavía.</p>
      <small>Agrega un dispositivo para visualizar tus métricas.</small>
    </div>

    <div v-else class="charts-grid">
      <Card class="chart-card">
        <template #content>
          <h3 class="chart-title">Distribución por Dispositivos</h3>
          <Doughnut :data="deviceChartData" :options="deviceChartOptions" />
        </template>
      </Card>

      <Card class="chart-card">
        <template #content>
          <div class="histogram-header">
            <h3 class="chart-title">Consumo por Periodo</h3>
            <Dropdown
                v-model="timeFrame"
                :options="timeOptions"
                optionLabel="label"
                optionValue="value"
                class="time-selector"
            />
          </div>
          <Bar :data="histogramData" :options="histogramOptions" />
        </template>
      </Card>

      <Card class="chart-card full-width">
        <template #content>
          <h3 class="chart-title">Consumo por Horas del Día</h3>
          <Line :data="hourlyChartData" :options="hourlyChartOptions" />
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrap {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-title {
  color: #002349;
  margin-bottom: 24px;
  font-size: 1.8rem;
  font-weight: 600;
}

.loading-state, .empty-state {
  background: #fff;
  padding: 3rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.empty-state p { font-size: 1.1rem; margin-bottom: 0.5rem; }
.empty-state small { color: #555; }

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.chart-card {
  min-height: 400px;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.chart-title {
  color: #002349;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.full-width {
  grid-column: 1 / -1;
}

.histogram-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.time-selector {
  width: 140px;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
