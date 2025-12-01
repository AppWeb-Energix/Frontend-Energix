<template>
  <div class="p-4">
    <Card>
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <div class="flex align-items-center">
            <i class="pi pi-list mr-2" style="color: var(--color-primary)"></i>
            <span>Registros de Auditoría</span>
          </div>
          <Button
            icon="pi pi-refresh"
            label="Actualizar"
            class="p-button-outlined p-button-sm"
            @click="loadLogs"
            :loading="loading"
          />
        </div>
      </template>

      <template #content>
        <div v-if="loading && logs.length === 0" class="text-center p-4">
          <ProgressSpinner style="width: 50px; height: 50px" />
          <p class="mt-3 text-500">Cargando registros...</p>
        </div>

        <DataTable
          v-else-if="logs.length > 0"
          :value="logs"
          :rows="10"
          :paginator="logs.length > 10"
          responsiveLayout="scroll"
          class="p-datatable-sm"
          stripedRows
          :rowHover="true"
          sortField="timestamp"
          :sortOrder="-1"
          filterDisplay="row"
          v-model:filters="filters"
        >
          <template #empty>
            <div class="text-center p-4 text-500">
              <i class="pi pi-inbox text-4xl mb-3 block"></i>
              <p>No hay registros de auditoría disponibles.</p>
            </div>
          </template>

          <Column field="timestamp" header="Fecha y Hora" :sortable="true" :style="{ width: '200px' }">
            <template #body="slotProps">
              <div class="flex align-items-center">
                <i class="pi pi-calendar mr-2 text-primary"></i>
                <span class="font-semibold">{{ formatDate(slotProps.data.timestamp) }}</span>
              </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                v-model="filterModel.value"
                @input="filterCallback()"
                placeholder="Buscar por fecha"
                class="p-column-filter"
              />
            </template>
          </Column>

          <Column field="action" header="Tipo de Acción" :sortable="true" :style="{ width: '150px' }" v-if="hasActionField">
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.action || 'INFO'"
                :severity="getActionSeverity(slotProps.data.action)"
              />
            </template>
          </Column>

          <Column field="message" header="Acción / Mensaje" :sortable="true">
            <template #body="slotProps">
              <div class="flex align-items-start">
                <i :class="getMessageIcon(slotProps.data.message)" class="mr-2 mt-1"></i>
                <span>{{ slotProps.data.message }}</span>
              </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                v-model="filterModel.value"
                @input="filterCallback()"
                placeholder="Buscar mensaje"
                class="p-column-filter"
              />
            </template>
          </Column>

          <Column field="user" header="Usuario" :sortable="true" :style="{ width: '150px' }" v-if="hasUserField">
            <template #body="slotProps">
              <div class="flex align-items-center" v-if="slotProps.data.user">
                <i class="pi pi-user mr-2 text-primary"></i>
                <span>{{ slotProps.data.user }}</span>
              </div>
              <span v-else class="text-400">Sistema</span>
            </template>
          </Column>
        </DataTable>

        <div v-else class="text-center p-6">
          <i class="pi pi-info-circle text-6xl mb-4 block" style="color: var(--color-warning)"></i>
          <h3 class="mb-2">No hay registros recientes</h3>
          <p class="text-500 mb-4">
            No se encontraron registros de auditoría en el sistema.
          </p>
          <Button
            label="Intentar de nuevo"
            icon="pi pi-refresh"
            @click="loadLogs"
            class="p-button-outlined"
          />
        </div>

        <!-- Estadísticas rápidas -->
        <div v-if="logs.length > 0" class="mt-4 p-3 surface-100 border-round">
          <div class="grid">
            <div class="col-12 md:col-4 text-center">
              <div class="text-500 text-sm mb-1">Total Registros</div>
              <div class="text-xl font-bold text-primary">{{ logs.length }}</div>
            </div>
            <div class="col-12 md:col-4 text-center">
              <div class="text-500 text-sm mb-1">Último Registro</div>
              <div class="text-xl font-bold text-primary">
                {{ logs.length > 0 ? formatDate(logs[0].timestamp) : 'N/A' }}
              </div>
            </div>
            <div class="col-12 md:col-4 text-center">
              <div class="text-500 text-sm mb-1">Estado</div>
              <div class="text-xl font-bold" style="color: var(--color-success)">
                <i class="pi pi-check-circle mr-1"></i>
                Activo
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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'

const logs = ref([])
const loading = ref(false)

// Definir FilterMatchMode localmente en lugar de importarlo
const FilterMatchMode = {
  CONTAINS: 'contains',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
  EQUALS: 'equals',
  NOT_EQUALS: 'notEquals',
  GREATER_THAN: 'gt',
  GREATER_THAN_OR_EQUAL_TO: 'gte',
  LESS_THAN: 'lt',
  LESS_THAN_OR_EQUAL_TO: 'lte'
}

const filters = ref({
  timestamp: { value: null, matchMode: FilterMatchMode.CONTAINS },
  message: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

// Detectar si los logs tienen campos adicionales
const hasActionField = computed(() => logs.value.some(log => log.action))
const hasUserField = computed(() => logs.value.some(log => log.user))

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'

  try {
    const date = new Date(timestamp)
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return timestamp
  }
}

const getActionSeverity = (action) => {
  if (!action) return 'info'

  const actionLower = action.toLowerCase()
  if (actionLower.includes('error') || actionLower.includes('fail')) return 'danger'
  if (actionLower.includes('warning') || actionLower.includes('warn')) return 'warning'
  if (actionLower.includes('success') || actionLower.includes('create')) return 'success'
  return 'info'
}

const getMessageIcon = (message) => {
  if (!message) return 'pi pi-info-circle text-500'

  const msgLower = message.toLowerCase()
  if (msgLower.includes('error') || msgLower.includes('fail')) return 'pi pi-times-circle text-red-500'
  if (msgLower.includes('warning') || msgLower.includes('warn')) return 'pi pi-exclamation-triangle text-orange-500'
  if (msgLower.includes('success') || msgLower.includes('crear') || msgLower.includes('create')) return 'pi pi-check-circle text-green-500'
  if (msgLower.includes('login') || msgLower.includes('ingreso')) return 'pi pi-sign-in text-blue-500'
  if (msgLower.includes('logout') || msgLower.includes('salida')) return 'pi pi-sign-out text-purple-500'
  if (msgLower.includes('update') || msgLower.includes('actualizar')) return 'pi pi-refresh text-cyan-500'
  if (msgLower.includes('delete') || msgLower.includes('eliminar')) return 'pi pi-trash text-red-500'

  return 'pi pi-info-circle text-primary'
}

const loadLogs = async () => {
  loading.value = true
  try {
    const response = await AdminApi.getAuditLogs()
    // Se espera un array de { timestamp, message, action?, user? }
    logs.value = Array.isArray(response) ? response : []

    // Ordenar por timestamp descendente (más recientes primero)
    logs.value.sort((a, b) => {
      const dateA = new Date(a.timestamp || 0)
      const dateB = new Date(b.timestamp || 0)
      return dateB - dateA
    })
  } catch (error) {
    console.error('Error cargando registros de auditoría:', error)
    logs.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLogs()
})
</script>

<style scoped>
:deep(.p-card-title) {
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: rgba(0, 35, 73, 0.05);
}

:deep(.p-column-filter) {
  width: 100%;
}

:deep(.p-tag) {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
}
</style>

