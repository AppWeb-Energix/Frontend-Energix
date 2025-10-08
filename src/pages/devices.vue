<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'
import InputSwitch from 'primevue/inputswitch'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { DevicesApi } from '@/shared/infrastructure/endpoints/devices.endpoint'
import { AlertsApi } from '@/shared/infrastructure/endpoints/alerts.endpoint'
import { getCurrentUser, getPlan } from '@/modules/auth/plan.util'

const toast = useToast()
const confirm = useConfirm()

const user  = ref(getCurrentUser())
const plan  = ref(getPlan())
const devices = ref([])
const loading = ref(false)

const deviceTypeByPlan = computed(() => {
  if (plan.value === 'student') return 'plug'
  if (plan.value === 'family')  return 'sensor'
  return 'manual'
})
const limitByPlan = computed(() => {
  if (plan.value === 'student') return 2
  if (plan.value === 'family')  return Infinity
  return 2
})
const canAdd = computed(() => devices.value.length < limitByPlan.value)


const search = ref('')
const selected = ref(null)

const deviceCatalog = [
  { label: 'Refrigeradora', value: 'refrigerator' },
  { label: 'Lavadora',      value: 'washer' },
  { label: 'Televisor',     value: 'tv' },
  { label: 'Computadora',   value: 'pc' },
  { label: 'Iluminación',   value: 'lights' },
  { label: 'Otro',          value: 'other' },
]

const showManualDialog = ref(false)
const manualForm = ref({
  deviceKind: null,
  metrics: { monthly:'', estimatedCost:'', tariff:'' }
})
const autoManualName = computed(() => {
  const n = devices.value.filter(d => d.type === 'manual').length + 1
  return `Dispositivo ${n}`
})

const planBadge = computed(() => {
  const name = plan.value === 'student' ? 'Plan Estudiantil' : plan.value === 'family' ? 'Plan Familiar' : 'Plan Básico'
  const cap  = limitByPlan.value === Infinity ? '∞' : `${devices.value.length}/${limitByPlan.value}`
  return `${name} · ${cap}`
})

async function load(){
  if (!user.value) return
  loading.value = true
  try { devices.value = await DevicesApi.getByUserId(user.value.id) }
  finally { loading.value = false }
}
onMounted(load)

const tableData = computed(() =>
    devices.value
        .filter(d => d.type === deviceTypeByPlan.value)
        .filter(d => d.name?.toLowerCase().includes(search.value.toLowerCase()))
)

async function addDevice(){
  if (!canAdd.value) return toast.add({ severity:'warn', summary:'Límite alcanzado', life:1500 })

  if (plan.value === 'student' || plan.value === 'family'){
    const index = devices.value.filter(d => d.type === deviceTypeByPlan.value).length + 1
    const created = await DevicesApi.create(user.value.id, { name:`Dispositivo ${index}`, type:deviceTypeByPlan.value })
    devices.value.push(created)
    await AlertsApi.generateSystemAlert(user.value.id, 'new_device', {
        deviceType: deviceTypeByPlan.value
    })
    toast.add({ severity:'success', summary:'Dispositivo agregado', life:1400 })
    return
  }

  manualForm.value = { deviceKind:null, metrics:{ monthly:'', estimatedCost:'', tariff:'' } }
  showManualDialog.value = true
}

async function createManualDevice(){
  const m = manualForm.value.metrics
  if (!manualForm.value.deviceKind)
    return toast.add({ severity:'warn', summary:'Selecciona el tipo de dispositivo', life:1500 })
  if (!m.monthly || !m.estimatedCost)
    return toast.add({ severity:'warn', summary:'Completa consumo mensual y costo estimado', life:1500 })

  const monthly = Number(m.monthly)
  const estimatedCost = Number(m.estimatedCost)
  const tariff = m.tariff ? Number(m.tariff) : null
  const dailyAvg = monthly / 30

  const created = await DevicesApi.create(user.value.id, {
    name: autoManualName.value,              // no personalizable en básico
    type: 'manual',
    deviceKind: manualForm.value.deviceKind, // guardamos categoría
    metrics: { monthly, estimatedCost, tariff, dailyAvg }
  })

  devices.value.push(created)
  showManualDialog.value = false
  toast.add({ severity:'success', summary:'Dispositivo manual agregado', life:1400 })
}

async function unlink(){
  if (!selected.value) return
  const toRemove = { ...selected.value }
  confirm.require({
    header:'Confirmación',
    message:`¿Desvincular "${selected.value.name}"?`,
    icon:'pi pi-exclamation-triangle',
    acceptLabel:'Desvincular',
    rejectLabel:'Cancelar',
    acceptClass:'p-button-danger',
    accept: async () => {
      await DevicesApi.remove(selected.value.id)
      devices.value = devices.value.filter(x => x.id !== selected.value.id)
      selected.value = null
      if (plan.value !== 'basic') {
        await AlertsApi.generateSystemAlert(user.value.id, 'device_unlinked', {
          deviceName: toRemove.name,
          deviceType: toRemove.type || deviceTypeByPlan.value
        })
      }
      toast.add({ severity:'success', summary:'Dispositivo desvinculado', life:1400 })
    }
  })
}

function severityForStatus(s){ return s === 'on' ? 'success' : 'danger' }
const deviceTypeByPlanLabel = computed(() =>
    deviceTypeByPlan.value === 'plug' ? 'Enchufe' : deviceTypeByPlan.value === 'sensor' ? 'Sensor' : 'Manual'
)
</script>

<template>
  <Toast />
  <ConfirmDialog />

  <div class="devices-wrap">
    <div class="header">
      <h2>Mis Dispositivos</h2>
      <Tag :value="planBadge" severity="info" />
    </div>

    <!-- Agregar -->
    <Card class="mb-3">
      <template #title>Agregar dispositivo</template>
      <template #content>
        <div class="actions">
          <Button class="btn-oxford"
                  :label="plan === 'basic' ? 'Agregar Manual' : deviceTypeByPlan === 'plug' ? 'Agregar Enchufe' : 'Agregar Sensor'"
                  :disabled="!canAdd"
                  @click="addDevice" />
          <Tag v-if="!canAdd" value="Límite alcanzado" severity="danger" />
        </div>
        <small class="hint">
          Plan: <b>{{ plan === 'basic' ? 'Básico' : plan === 'student' ? 'Estudiantil' : 'Familiar' }}</b>.
          Tipo permitido: <b>{{ deviceTypeByPlanLabel }}</b>.
        </small>
      </template>
    </Card>

    <!-- Lista -->
    <Card class="mb-3">
      <template #title>Lista de dispositivos</template>
      <template #content>
        <div class="filters">
          <IconField iconPosition="left" class="search-field w-20rem">
            <InputIcon class="pi pi-search" />
            <InputText v-model="search" placeholder="Buscar por nombre..." />
          </IconField>
        </div>

        <DataTable :value="tableData" :loading="loading" dataKey="id" selectionMode="single" v-model:selection="selected">
          <Column field="name" header="Nombre" />
          <Column field="deviceKind" header="Tipo (cat.)">
            <template #body="{ data }">
              {{
                ([
                  { label: 'Refrigeradora', value: 'refrigerator' },
                  { label: 'Lavadora', value: 'washer' },
                  { label: 'Televisor', value: 'tv' },
                  { label: 'Computadora', value: 'pc' },
                  { label: 'Iluminación', value: 'lights' },
                  { label: 'Otro', value: 'other' }
                ].find(x => x.value === data.deviceKind) || {}).label || '-'
              }}
            </template>
          </Column>
          <!-- Ocultar Power para plan básico -->
          <Column v-if="plan !== 'basic'" header="Power">
            <template #body="{ data }">
              <InputSwitch :modelValue="data.status === 'on'"
                           @update:modelValue="() => (async () => {
                             const next = data.status === 'on' ? 'off' : 'on'
                             const patched = await DevicesApi.update(data.id, { status: next, online: next === 'on' })
                             data.status = patched.status
                             data.online = patched.online
                             await AlertsApi.generateSystemAlert(user.value.id, 'power_changed', {
                             deviceName: data.name,
                             status: data.status
                             })
                           })()" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Desvincular -->
    <Card>
      <template #title>Desvincular</template>
      <template #content>
        <div class="edit-row">
          <Dropdown
              v-model="selected"
              :options="tableData"
              optionLabel="name"
              placeholder="Selecciona"
              class="w-20rem drop-right dropdown-oxford"
              appendTo="self"
          />
          <Button label="Desvincular" severity="danger" :disabled="!selected" @click="unlink" class="btn-h31" />
        </div>
      </template>
    </Card>

    <!-- Modal Manual -->
    <Dialog v-model:visible="showManualDialog" modal header="Nuevo dispositivo manual" :style="{ width:'520px' }">
      <div class="form-grid">
        <label>Nombre</label>
        <div class="auto-name">{{ autoManualName }}</div>

        <label>Tipo de dispositivo</label>
        <Dropdown
            v-model="manualForm.deviceKind"
            :options="deviceCatalog"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecciona"
            class="dropdown-oxford"
            appendTo="body"
            :scrollHeight="'240px'"
        />

        <label>Consumo mensual (kWh)</label>
        <InputText v-model="manualForm.metrics.monthly" type="number" inputmode="decimal" class="input-oxford" />

        <label>Costo estimado mensual (S/)</label>
        <InputText v-model="manualForm.metrics.estimatedCost" type="number" inputmode="decimal" class="input-oxford" />

        <label>Tarifa por kWh (S/)</label>
        <InputText v-model="manualForm.metrics.tariff" type="number" inputmode="decimal" class="input-oxford" />
      </div>

      <small class="hint">
        Calcularemos el <b>promedio diario</b> ≈ consumo mensual / 30. Con la <b>tarifa</b> puedes contrastar costo ≈ kWh × tarifa.
      </small>

      <template #footer>
        <Button label="Cancelar" severity="secondary" text class="btn-h31" @click="showManualDialog=false" />
        <Button label="Guardar" class="btn-oxford" @click="createManualDevice" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
:root {
  --oxford: #002349;
}

.devices-wrap {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 12px;
}

.header h2 {
  margin: 0;
  color: var(--oxford);
}

.mb-3 {
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
}

.hint {
  color: #64748b;
}

.btn-oxford {
  background: #002349 !important;
  border-color: #002349 !important;
  color: #fff !important;
  height: 31px;
  border-radius: 8px;
  font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-size: 13px;
  font-weight: 400;
}

.btn-h31 {
  height: 31px;
  border-radius: 8px;
  font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-size: 13px;
  font-weight: 400;
}

.w-20rem {
  width: 20rem;
}

.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.edit-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
}

.form-grid label {
  align-self: center;
  font-weight: 600;
  color: var(--oxford);
}

.auto-name {
  align-self: center;
  font-weight: 600;
}

:deep(::placeholder) {
  color: #4a4a4a !important;
  opacity: 1 !important;
}

:deep(.drop-right) .p-dropdown-panel {
  left: auto !important;
  right: 0 !important;
  transform-origin: top right;
}

</style>

