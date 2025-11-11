<template>
  <div class="configuration-container">
    <div class="configuration-content">
      <!-- Header -->
      <h2 class="main-title">{{ t('configuration.title') }}</h2>
      <p class="subtitle">
        {{ t('configuration.subtitle', {
          plan: planInfo.plan,
          history: planInfo.history,
          devices: planInfo.devices
        }) }}
      </p>

      <!-- Sección Perfil -->
      <div class="section-card">
        <h3 class="section-title">{{ t('configuration.profile.title') }}</h3>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">{{ t('configuration.profile.name') }}</label>
            <input v-model="profile.name" type="text" :placeholder="t('configuration.profile.namePlaceholder')" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('configuration.profile.lastName') }}</label>
            <input v-model="profile.lastName" type="text" :placeholder="t('configuration.profile.lastNamePlaceholder')" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('configuration.profile.email') }}</label>
            <input v-model="profile.email" type="email" :placeholder="t('configuration.profile.emailPlaceholder')" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('configuration.profile.dni') }}</label>
            <input v-model="profile.dni" type="text" :placeholder="t('configuration.profile.dniPlaceholder')" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('configuration.profile.district') }}</label>
            <input v-model="profile.district" type="text" :placeholder="t('configuration.profile.districtPlaceholder')" class="form-input" />
          </div>
        </div>

        <div class="button-group">
          <button @click="saveProfile" class="btn-primary">{{ t('configuration.buttons.save') }}</button>
          <button @click="cancelProfile" class="btn-secondary">{{ t('configuration.buttons.cancel') }}</button>
        </div>
      </div>

      <!-- Sección Personalización del panel -->
      <div class="section-card">
        <h3 class="section-title">{{ t('configuration.personalization.title') }}</h3>

        <div class="personalization-grid">
          <div class="checkbox-group">
            <input type="checkbox" id="kpiCurrent" v-model="kpiCurrent" class="form-checkbox" />
            <label for="kpiCurrent" class="checkbox-label">{{ t('configuration.personalization.kpiCurrent') }}</label>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="kpiCost" v-model="kpiCost" class="form-checkbox" />
            <label for="kpiCost" class="checkbox-label">{{ t('configuration.personalization.kpiCost') }}</label>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="kpiMonthly" v-model="kpiMonthly" class="form-checkbox" />
            <label for="kpiMonthly" class="checkbox-label">{{ t('configuration.personalization.kpiMonthly') }}</label>
          </div>

          <div class="checkbox-group">
            <input type="checkbox" id="chartHourly" v-model="chartHourly" class="form-checkbox" />
            <label for="chartHourly" class="checkbox-label">{{ t('configuration.personalization.chartHourly') }}</label>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="chartMonthly" v-model="chartMonthly" class="form-checkbox" />
            <label for="chartMonthly" class="checkbox-label">{{ t('configuration.personalization.chartMonthly') }}</label>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="chartDevice" v-model="chartDevice" class="form-checkbox" />
            <label for="chartDevice" class="checkbox-label">{{ t('configuration.personalization.chartDevice') }}</label>
          </div>
        </div>

        <div class="button-group">
          <button @click="savePersonalization" class="btn-primary">{{ t('configuration.buttons.save') }}</button>
          <button @click="resetPersonalization" class="btn-secondary">{{ t('configuration.buttons.reset') }}</button>
        </div>
      </div>

      <!-- Sección Seguridad -->
      <div class="section-card">
        <h3 class="section-title">{{ t('configuration.security.title') }}</h3>
        <div class="security-grid">
          <div class="form-group">
            <label class="form-label">{{ t('configuration.security.currentPassword') }}</label>
            <input v-model="security.currentPassword" type="password" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('configuration.security.newPassword') }}</label>
            <input v-model="security.newPassword" type="password" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('configuration.security.confirmPassword') }}</label>
            <input v-model="security.confirmPassword" type="password" class="form-input" />
          </div>
        </div>
        <div class="button-container">
          <button @click="updatePassword" class="btn-primary">{{ t('configuration.security.updatePassword') }}</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { usePersonalizationStore } from '../stores/personalization'
import { changePasswordService } from '@/modules/auth/auth.service'

const { t } = useI18n()

const personalizationStore = usePersonalizationStore()
const {
  kpiCurrent,
  kpiCost,
  kpiMonthly,
  chartHourly,
  chartMonthly,
  chartDevice
} = storeToRefs(personalizationStore)

function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('energix-user'))
    return user?.id || 1
  } catch {
    return 1
  }
}

// Cambia esto por la obtención real del userId si tienes auth
const userId = 1

// Estados locales para otras secciones (estos no están en Pinia)
const profile = reactive({
  name: '',
  lastName: '',
  email: '',
  dni: '',
  district: '',
  invoiceFileName: ''
})

const preferences = reactive({
  baseRate: 'S',
  dailyLimit: '8',
  enableDailySummary: false,
  dailySummary: false,
  limit80: false,
  unusualAlert: false
})

const security = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const fileInput = ref(null)

// Computed para el subtítulo con datos del plan
const userPlan = computed(() => {
  try {
    const user = JSON.parse(localStorage.getItem('energix-user'))
    return user?.plan || 'student'
  } catch {
    return 'student'
  }
})

const planInfo = computed(() => {
  const planName = t(`configuration.plans.${userPlan.value}`)
  const history = userPlan.value === 'basic' ? '7 días' : userPlan.value === 'student' ? '90 días' : '∞'
  const devices = userPlan.value === 'basic' ? '1' : userPlan.value === 'student' ? '2' : '∞'
  return { plan: planName, history, devices }
})

// Cargar datos del usuario autenticado
onMounted(() => {
  const user = JSON.parse(localStorage.getItem('energix-user'))
  if (user) {
    profile.name = user.name || ''
    profile.lastName = user.lastName || ''
    profile.email = user.email || ''
    profile.dni = user.dni || ''
    profile.district = user.district || ''
    // No se carga password ni plan aquí
  }
  personalizationStore.loadPersonalization() // Cargar personalización del usuario actual
})

// Funciones para perfil
const saveProfile = async () => {
  try {
    const userId = getUserId()
    // PATCH solo los campos editables
    const response = await fetch(`http://localhost:3001/api/v1/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: profile.name,
        lastName: profile.lastName,
        email: profile.email,
        dni: profile.dni,
        district: profile.district
      })
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || t('configuration.messages.profileError'))
    }
    // Actualizar localStorage
    const user = JSON.parse(localStorage.getItem('energix-user'))
    Object.assign(user, {
      name: profile.name,
      lastName: profile.lastName,
      email: profile.email,
      dni: profile.dni,
      district: profile.district
    })
    localStorage.setItem('energix-user', JSON.stringify(user))
    alert(t('configuration.messages.profileSaved'))
  } catch (err) {
    alert(err.message || t('configuration.messages.profileError'))
  }
}

const cancelProfile = () => {
  alert(t('configuration.messages.changesCancelled'))
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    profile.invoiceFileName = file.name
  }
}

// Funciones para personalización
const savePersonalization = () => {
  personalizationStore.savePersonalization()
  alert(t('configuration.messages.personalizationSaved'))
}
const resetPersonalization = () => {
  personalizationStore.resetToDefaults()
  alert(t('configuration.messages.personalizationReset'))
}

// Función para seguridad
const updatePassword = async () => {
  if (security.newPassword !== security.confirmPassword) {
    alert(t('configuration.messages.passwordMismatch'))
    return
  }
  try {
    const userId = getUserId()
    await changePasswordService(userId, security.currentPassword, security.newPassword)
    alert(t('configuration.messages.passwordUpdated'))
    security.currentPassword = ''
    security.newPassword = ''
    security.confirmPassword = ''
  } catch (err) {
    alert(err.message || t('configuration.messages.passwordError'))
  }
}
</script>

<style scoped>
/* ESTILOS EXACTOS BASADOS EN EL MOCKUP */

.configuration-container {
  flex: 1;
  padding: 32px;
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.configuration-content {
  max-width: 1024px;
  margin: 0 auto;
}

/* TIPOGRAFÍA */
.main-title {
  font-size: 28px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 32px;
}

.highlight {
  color: #374151;
  font-weight: 500;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 24px;
}

/* TARJETAS DE SECCIÓN */
.section-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* HEADER DE SECCIÓN CON BADGE */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.change-plan-badge {
  font-size: 12px;
  color: #2563eb;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.change-plan-badge:hover {
  background-color: #dbeafe;
}

/* FORMULARIOS */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-input, .form-select {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  color: #111827;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.15s ease;
  box-sizing: border-box;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-help {
  font-size: 12px;
  color: #6b7280;
  margin-top: 6px;
}

/* GRIDS */
.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.preferences-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.security-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
}

.personalization-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

/* CHECKBOXES */
.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  margin-top: 12px;
}

.form-checkbox {
  width: 16px;
  height: 16px;
  margin-right: 12px;
  accent-color: #0b2541;
}

.checkbox-label {
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

/* BOTONES */
.btn-primary {
  background-color: #0b2541;
  color: white;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-primary:hover {
  background-color: #0b2541;
}

.btn-primary:disabled {
  background-color: #0b2541;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 24px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.button-group {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.button-container {
  margin-top: 32px;
}

/* FILE UPLOAD */
.file-input-container {
  position: relative;
}

.hidden-file-input {
  display: none;
}

.file-display {
  padding-right: 100px;
}

.file-button {
  position: absolute;
  right: 4px;
  top: 4px;
  bottom: 4px;
  background-color: #f3f4f6;
  color: #374151;
  font-size: 12px;
  padding: 0 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.file-button:hover {
  background-color: #e5e7eb;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .form-grid-2,
  .plan-grid,
  .preferences-grid,
  .security-grid {
    grid-template-columns: 1fr;
  }

  .personalization-grid {
    grid-template-columns: 1fr;
  }
}
</style>
