<template>
  <div class="flex align-items-center justify-content-center h-full p-6">
    <Card class="health-card text-center p-6">
      <template #content>
        <div class="mb-4">
          <i
            :class="iconClass"
            :style="{ fontSize: '6rem', color: iconColor }"
            class="health-icon"
          ></i>
        </div>

        <h2 class="mb-3 text-3xl font-bold" :style="{ color: iconColor }">
          {{ statusText }}
        </h2>

        <p class="text-600 mb-4 text-lg">
          {{ details }}
        </p>

        <div class="mb-4" v-if="lastChecked">
          <span class="text-500 text-sm">
            <i class="pi pi-clock mr-2"></i>
            Última verificación: {{ lastChecked }}
          </span>
        </div>

        <Button
          label="Verificar Conexión"
          icon="pi pi-refresh"
          @click="check"
          :loading="loading"
          class="p-button-lg"
          :style="{
            backgroundColor: 'var(--color-primary)',
            borderColor: 'var(--color-primary)'
          }"
        />

        <!-- Información adicional del sistema -->
        <div v-if="systemInfo" class="mt-5 pt-4 border-top-1 surface-border">
          <div class="grid text-left">
            <div class="col-12 md:col-6 mb-3">
              <div class="flex align-items-center">
                <i class="pi pi-server mr-2 text-primary"></i>
                <div>
                  <div class="text-500 text-xs">Servidor</div>
                  <div class="font-semibold">{{ systemInfo.server || 'N/A' }}</div>
                </div>
              </div>
            </div>

            <div class="col-12 md:col-6 mb-3">
              <div class="flex align-items-center">
                <i class="pi pi-database mr-2 text-primary"></i>
                <div>
                  <div class="text-500 text-xs">Base de Datos</div>
                  <div class="font-semibold">{{ systemInfo.database || 'N/A' }}</div>
                </div>
              </div>
            </div>

            <div class="col-12 md:col-6 mb-3">
              <div class="flex align-items-center">
                <i class="pi pi-bolt mr-2 text-primary"></i>
                <div>
                  <div class="text-500 text-xs">Tiempo de Respuesta</div>
                  <div class="font-semibold">{{ systemInfo.responseTime || 'N/A' }}</div>
                </div>
              </div>
            </div>

            <div class="col-12 md:col-6 mb-3">
              <div class="flex align-items-center">
                <i class="pi pi-chart-line mr-2 text-primary"></i>
                <div>
                  <div class="text-500 text-xs">Uptime</div>
                  <div class="font-semibold">{{ systemInfo.uptime || 'N/A' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { AdminApi } from '@/admin/infrastructure/admin.endpoint.js'

// Importaciones de PrimeVue
import Card from 'primevue/card'
import Button from 'primevue/button'

const healthy = ref(false)
const details = ref('')
const loading = ref(false)
const lastChecked = ref('')
const systemInfo = ref(null)

const iconClass = computed(() =>
  healthy.value ? 'pi pi-check-circle' : 'pi pi-times-circle'
)

const iconColor = computed(() =>
  healthy.value ? 'var(--color-success)' : 'var(--color-error)'
)

const statusText = computed(() =>
  healthy.value ? 'Sistema Saludable' : 'Error de Conexión'
)

const formatTime = () => {
  const now = new Date()
  return now.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const check = async () => {
  loading.value = true
  try {
    const startTime = Date.now()
    const response = await AdminApi.getHealth()
    const responseTime = Date.now() - startTime

    // Estructura esperada del backend: { healthy: boolean, details: string, server?: string, database?: string, uptime?: string }
    healthy.value = !!response.healthy
    details.value = response.details || (healthy.value
      ? 'Todos los servicios operando correctamente.'
      : 'No se pudo conectar al backend.')

    // Información adicional del sistema si está disponible
    if (response.server || response.database || response.uptime) {
      systemInfo.value = {
        server: response.server || 'Activo',
        database: response.database || 'Conectada',
        responseTime: `${responseTime}ms`,
        uptime: response.uptime || 'Desconocido'
      }
    }

    lastChecked.value = formatTime()
  } catch (error) {
    console.error('Error al verificar el estado del sistema:', error)
    healthy.value = false
    details.value = 'No se pudo conectar al backend. Verifica que el servidor esté en ejecución.'
    systemInfo.value = null
    lastChecked.value = formatTime()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  check()
})
</script>

<style scoped>
.health-card {
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 35, 73, 0.15);
  border-radius: 12px;
}

.health-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

:deep(.p-card-content) {
  padding: 2rem;
}

:deep(.p-button) {
  padding: 0.75rem 2rem;
  font-weight: 600;
}

:deep(.p-button:hover) {
  background-color: var(--color-primary-dark) !important;
  border-color: var(--color-primary-dark) !important;
}
</style>

