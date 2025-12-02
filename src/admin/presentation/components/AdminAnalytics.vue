<template>
  <div class="p-4">
    <h2 class="text-3xl font-bold mb-4" style="color: var(--color-primary)">Analíticas del Sistema</h2>

    <!-- Fila 1: KPIs -->
    <div class="grid mb-4">
      <div class="col-12 md:col-3">
        <Card class="kpi-card">
          <template #content>
            <div class="flex flex-column align-items-center text-center">
              <i class="pi pi-users text-5xl mb-3" style="color: var(--color-primary)"></i>
              <span class="text-500 text-sm mb-2">Total Usuarios</span>
              <span class="text-4xl font-bold" style="color: var(--color-primary)">
                {{ stats.totalUsers ?? '-' }}
              </span>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-3">
        <Card class="kpi-card">
          <template #content>
            <div class="flex flex-column align-items-center text-center">
              <i class="pi pi-check-circle text-5xl mb-3" style="color: var(--color-success)"></i>
              <span class="text-500 text-sm mb-2">Suscripciones Activas</span>
              <span class="text-4xl font-bold" style="color: var(--color-success)">
                {{ stats.activeSubscriptions ?? '-' }}
              </span>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-3">
        <Card class="kpi-card">
          <template #content>
            <div class="flex flex-column align-items-center text-center">
              <i class="pi pi-wifi text-5xl mb-3" style="color: var(--color-warning)"></i>
              <span class="text-500 text-sm mb-2">Dispositivos Activos</span>
              <span class="text-4xl font-bold" style="color: var(--color-warning)">
                {{ stats.activeDevices ?? '-' }}
              </span>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-3">
        <Card class="kpi-card">
          <template #content>
            <div class="flex flex-column align-items-center text-center">
              <i class="pi pi-dollar text-5xl mb-3" style="color: #D4AF37"></i>
              <span class="text-500 text-sm mb-2">Ingresos Totales (S/)</span>
              <span class="text-4xl font-bold" style="color: #D4AF37">
                S/ {{ formatRevenue(stats.totalRevenue) }}
              </span>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Fila 2: Gráficos -->
    <div class="grid mb-4">
      <div class="col-12 md:col-8">
        <Card>
          <template #title>
            <div class="flex align-items-center">
              <i class="pi pi-chart-bar mr-2" style="color: var(--color-primary)"></i>
              Ingresos por Plan
            </div>
          </template>
          <template #content>
            <div class="chart-container">
              <canvas ref="barCanvas" height="280"></canvas>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-4">
        <Card>
          <template #title>
            <div class="flex align-items-center">
              <i class="pi pi-chart-pie mr-2" style="color: var(--color-primary)"></i>
              Distribución de Planes
            </div>
          </template>
          <template #content>
            <div class="chart-container">
              <canvas ref="doughnutCanvas" height="280"></canvas>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Fila 3: Top Distritos -->
    <div class="grid">
      <div class="col-12">
        <Card>
          <template #title>
            <div class="flex align-items-center">
              <i class="pi pi-map-marker mr-2" style="color: var(--color-primary)"></i>
              Top Distritos por Usuarios
            </div>
          </template>
          <template #content>
            <DataTable
              v-if="(stats.topDistricts || []).length"
              :value="stats.topDistricts"
              :rows="5"
              :paginator="(stats.topDistricts || []).length > 5"
              responsiveLayout="scroll"
              class="p-datatable-sm"
            >
              <Column field="district" header="Distrito" sortable>
                <template #body="slotProps">
                  <div class="flex align-items-center">
                    <i class="pi pi-map-marker mr-2" style="color: var(--color-primary)"></i>
                    <span class="font-semibold">{{ slotProps.data.district }}</span>
                  </div>
                </template>
              </Column>
              <Column field="users" header="Usuarios" sortable>
                <template #body="slotProps">
                  <span class="font-bold" style="color: var(--color-primary)">
                    {{ slotProps.data.users }}
                  </span>
                </template>
              </Column>
            </DataTable>
            <div v-else class="text-center p-4 text-500">
              <i class="pi pi-info-circle mr-2"></i>
              No hay datos de distritos disponibles.
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { AdminApi } from '@/admin/infrastructure/admin.endpoint.js'
import Chart from 'chart.js/auto'

// Importaciones de PrimeVue
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const stats = ref({})
const barCanvas = ref(null)
const doughnutCanvas = ref(null)
let barChart = null
let doughnutChart = null

const formatRevenue = (value) => {
  if (!value) return '0.00'
  return parseFloat(value).toFixed(2)
}

const buildBarChart = (data) => {
  if (!barCanvas.value || !data.plans || data.plans.length === 0) return

  if (barChart) barChart.destroy()

  const labels = data.plans.map(p => p.name || 'Sin nombre')
  const values = data.plans.map(p => parseFloat(p.revenue || 0))

  const ctx = barCanvas.value.getContext('2d')
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Ingresos (S/)',
        data: values,
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Verde
          'rgba(212, 175, 55, 0.8)',  // Dorado
          'rgba(16, 185, 129, 0.8)',  // Verde claro
          'rgba(245, 158, 11, 0.8)'   // Ámbar
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(212, 175, 55, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `S/ ${context.parsed.y.toFixed(2)}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `S/ ${value}`
          }
        }
      }
    }
  })
}

const buildDoughnutChart = (data) => {
  if (!doughnutCanvas.value || !data.plans || data.plans.length === 0) return

  if (doughnutChart) doughnutChart.destroy()

  const labels = data.plans.map(p => p.name || 'Sin nombre')
  const counts = data.plans.map(p => parseInt(p.count || 0))

  const ctx = doughnutCanvas.value.getContext('2d')
  doughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: [
          '#D4AF37',  // Dorado
          '#8CC152',  // Verde lima
          '#A3E635',  // Verde brillante
          '#F59E0B',  // Ámbar
          '#60A5FA'   // Azul
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.parsed} usuarios`
          }
        }
      }
    }
  })
}

const loadData = async () => {
  try {
    console.log('🔄 Cargando datos de admin dashboard...')
    console.log('🔑 Token disponible:', !!localStorage.getItem('token'))
    console.log('🌐 URL backend:', import.meta.env.VITE_API_BASE_URL)

    const response = await AdminApi.getDashboardStats()
    console.log('✅ Respuesta del backend:', response)
    stats.value = response

    // Esperar al siguiente tick para asegurar que los canvas están renderizados
    await new Promise(resolve => setTimeout(resolve, 100))
    buildBarChart(response)
    buildDoughnutChart(response)
  } catch (error) {
    console.error('❌ Error cargando estadísticas:', error)
    console.error('📊 Status HTTP:', error.status)
    console.error('💬 Mensaje:', error.message)

    // Datos de fallback
    stats.value = {
      totalUsers: 0,
      activeSubscriptions: 0,
      activeDevices: 0,
      totalRevenue: 0,
      plans: [],
      topDistricts: []
    }

    // Información específica del error
    if (error.status === 401) {
      console.warn('🔐 Error 401: Token de autorización inválido o expirado')
    } else if (error.status === 404) {
      console.warn('🔍 Error 404: Endpoint /admin/dashboard no encontrado')
    } else if (error.status === 500) {
      console.warn('🔥 Error 500: Error interno del servidor backend')
    } else {
      console.warn('🌐 Error de red o conexión con el backend')
    }
  }
}

onMounted(() => {
  loadData()
})

onUnmounted(() => {
  if (barChart) barChart.destroy()
  if (doughnutChart) doughnutChart.destroy()
})
</script>

<style scoped>
.kpi-card {
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 35, 73, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 35, 73, 0.15);
}

.chart-container {
  position: relative;
  height: 280px;
  width: 100%;
}

:deep(.p-card-title) {
  color: var(--color-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
}
</style>

