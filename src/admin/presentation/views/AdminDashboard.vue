<template>
  <div class="admin-dashboard">
    <!-- Header con título y badge de salud -->
    <div class="header-section flex justify-content-between align-items-center mb-4">
      <h1 class="text-3xl font-bold text-primary">Panel de Administración</h1>
      <Tag
        :value="healthStatus.text"
        :severity="healthStatus.severity"
        :icon="healthStatus.icon"
        class="text-lg px-4 py-2"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-content-center align-items-center" style="min-height: 400px;">
      <ProgressSpinner />
    </div>

    <!-- Error State -->
    <Message v-else-if="error" severity="error" :closable="false" class="mb-4">
      {{ error }}
    </Message>

    <!-- Dashboard Content -->
    <template v-else>
      <!-- Fila de KPIs -->
      <div class="grid mb-4">
        <div class="col-12 md:col-4">
          <Card class="kpi-card">
            <template #content>
              <div class="flex align-items-center">
                <div class="kpi-icon bg-blue-100 text-blue-600">
                  <i class="pi pi-users text-4xl"></i>
                </div>
                <div class="ml-3">
                  <div class="text-500 text-sm">Total Usuarios</div>
                  <div class="text-3xl font-bold text-900">{{ dashboardData.totalUsers }}</div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-4">
          <Card class="kpi-card">
            <template #content>
              <div class="flex align-items-center">
                <div class="kpi-icon bg-green-100 text-green-600">
                  <i class="pi pi-power-off text-4xl"></i>
                </div>
                <div class="ml-3">
                  <div class="text-500 text-sm">Dispositivos Activos</div>
                  <div class="text-3xl font-bold text-900">{{ dashboardData.activeDevices }}</div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-4">
          <Card class="kpi-card">
            <template #content>
              <div class="flex align-items-center">
                <div class="kpi-icon bg-purple-100 text-purple-600">
                  <i class="pi pi-chart-line text-4xl"></i>
                </div>
                <div class="ml-3">
                  <div class="text-500 text-sm">Total Planes</div>
                  <div class="text-3xl font-bold text-900">{{ totalPlans }}</div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Fila de Gráficos -->
      <div class="grid mb-4">
        <!-- Gráfico de Distribución de Planes (Doughnut) -->
        <div class="col-12 md:col-6">
          <Card>
            <template #title>
              <div class="flex align-items-center">
                <i class="pi pi-chart-pie mr-2"></i>
                Distribución de Planes
              </div>
            </template>
            <template #content>
              <div class="chart-container">
                <canvas ref="planChartRef"></canvas>
              </div>
            </template>
          </Card>
        </div>

        <!-- Gráfico de Dispositivos Online vs Offline (Bar) -->
        <div class="col-12 md:col-6">
          <Card>
            <template #title>
              <div class="flex align-items-center">
                <i class="pi pi-chart-bar mr-2"></i>
                Estado de Dispositivos
              </div>
            </template>
            <template #content>
              <div class="chart-container">
                <canvas ref="deviceChartRef"></canvas>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Sección de Auditoría -->
      <Card>
        <template #title>
          <div class="flex align-items-center">
            <i class="pi pi-list mr-2"></i>
            Registro de Auditoría
          </div>
        </template>
        <template #content>
          <DataTable
            :value="auditLogs"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            responsiveLayout="scroll"
            stripedRows
            class="p-datatable-sm"
          >
            <Column field="date" header="Fecha/Hora" :sortable="true">
              <template #body="{ data }">
                <span class="text-600">
                  <i class="pi pi-clock mr-2"></i>
                  {{ formatDate(data.date) }}
                </span>
              </template>
            </Column>
            <Column field="message" header="Actividad">
              <template #body="{ data }">
                <span class="text-900">{{ data.message }}</span>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { AdminApi } from '@/admin/infrastructure/admin.endpoint.js';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import { Chart, registerables } from 'chart.js';

// Registrar componentes de Chart.js
Chart.register(...registerables);

// Estado reactivo
const loading = ref(true);
const error = ref(null);
const healthData = ref({ status: 'healthy' });
const dashboardData = ref({
  totalUsers: 0,
  activeDevices: 0,
  planDistribution: { basic: 0, family: 0 }
});
const auditLogs = ref([]);

// Referencias para los canvas de los gráficos
const planChartRef = ref(null);
const deviceChartRef = ref(null);

// Instancias de los gráficos
let planChart = null;
let deviceChart = null;

// Computed properties
const healthStatus = computed(() => {
  const isHealthy = healthData.value.status === 'healthy';
  return {
    text: isHealthy ? 'Sistema Operativo' : 'Sistema Inactivo',
    severity: isHealthy ? 'success' : 'danger',
    icon: isHealthy ? 'pi pi-check-circle' : 'pi pi-times-circle'
  };
});

const totalPlans = computed(() => {
  const dist = dashboardData.value.planDistribution || {};
  return (dist.basic || 0) + (dist.family || 0);
});

// Funciones para cargar datos
const loadHealthData = async () => {
  try {
    healthData.value = await AdminApi.getHealth();
  } catch (err) {
    console.error('Error loading health data:', err);
    healthData.value = { status: 'unhealthy' };
  }
};

const loadDashboardData = async () => {
  try {
    dashboardData.value = await AdminApi.getDashboard();
  } catch (err) {
    console.error('Error loading dashboard data:', err);
    throw err;
  }
};

const loadAuditLogs = async () => {
  try {
    auditLogs.value = await AdminApi.getAuditLogs();
  } catch (err) {
    console.error('Error loading audit logs:', err);
    auditLogs.value = [];
  }
};

const loadAllData = async () => {
  loading.value = true;
  error.value = null;

  try {
    await Promise.all([
      loadHealthData(),
      loadDashboardData(),
      loadAuditLogs()
    ]);
  } catch (err) {
    error.value = err.message || 'Error al cargar los datos del panel de administración';
  } finally {
    loading.value = false;
  }
};

// Crear gráfico de distribución de planes (Doughnut)
const createPlanChart = () => {
  if (!planChartRef.value) return;

  const dist = dashboardData.value.planDistribution || { basic: 0, family: 0 };

  const ctx = planChartRef.value.getContext('2d');
  planChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Plan Basic', 'Plan Family'],
      datasets: [{
        data: [dist.basic || 0, dist.family || 0],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',  // Blue
          'rgba(168, 85, 247, 0.8)'   // Purple
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
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
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

// Crear gráfico de dispositivos (Bar)
const createDeviceChart = () => {
  if (!deviceChartRef.value) return;

  const activeDevices = dashboardData.value.activeDevices || 0;
  // Simulamos dispositivos offline (en un caso real, vendría del backend)
  const offlineDevices = Math.max(0, Math.floor(activeDevices * 0.2));

  const ctx = deviceChartRef.value.getContext('2d');
  deviceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Online', 'Offline'],
      datasets: [{
        label: 'Dispositivos',
        data: [activeDevices, offlineDevices],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Green
          'rgba(239, 68, 68, 0.8)'     // Red
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed.y} dispositivos`;
            }
          }
        }
      }
    }
  });
};

// Formatear fecha
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

// Lifecycle hooks
onMounted(async () => {
  await loadAllData();

  // Crear gráficos después de cargar los datos
  if (!loading.value && !error.value) {
    setTimeout(() => {
      createPlanChart();
      createDeviceChart();
    }, 100);
  }
});

onUnmounted(() => {
  // Destruir gráficos al desmontar el componente
  if (planChart) {
    planChart.destroy();
  }
  if (deviceChart) {
    deviceChart.destroy();
  }
});
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: 2rem;
}

.kpi-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.kpi-icon {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chart-container {
  position: relative;
  height: 300px;
  padding: 1rem;
}

.chart-container canvas {
  max-height: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem;
  }

  .kpi-icon {
    width: 60px;
    height: 60px;
  }

  .kpi-icon i {
    font-size: 2rem !important;
  }
}
</style>

