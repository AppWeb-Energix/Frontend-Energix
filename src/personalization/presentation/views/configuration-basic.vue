<template>
  <div class="configuration-container">
    <div class="configuration-content">
      <!-- Modal de Alertas -->
      <ModalAlert ref="modalAlert" />

      <!-- Header -->
      <h2 class="main-title">{{ t('configuration.title') }}</h2>
      <p class="subtitle" v-if="userFullName">
        {{ t('configuration.greeting', { name: userFullName }) }}
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
            <input v-model="profile.dni" type="text" :placeholder="t('configuration.profile.dniPlaceholder')" class="form-input" readonly />
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
import { useI18n } from 'vue-i18n'
import { http } from '@/shared/infrastructure/base-api.js'
import { ProfileApi } from '../../infrastructure/profile.endpoint.js'
import { ProfileDomainService } from '../../domain/profile.service.js'
import ModalAlert from '../components/ModalAlert.vue'
//import { changePasswordService } from '@/identity/domain/auth/auth.service.js'

const { t } = useI18n()

// Referencia al modal
const modalAlert = ref(null)

// Obtener el ID del usuario
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

const security = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const fileInput = ref(null)

// Cargar datos del usuario autenticado
onMounted(() => {
  const user = JSON.parse(localStorage.getItem('energix-user'))
  if (user) {
    profile.name = user.firstName || user.name || user.first_name || ''
    profile.lastName = user.lastName || user.apellido || user.last_name || ''
    profile.email = user.email || ''
    profile.dni = user.dni || user.document || ''
    profile.district = user.district || user.ciudad || user.city || ''
    // No se carga password ni plan aquí
  }
})


// Computed para el nombre completo del usuario
const userFullName = computed(() => {
  const firstName = profile.name || ''
  const lastName = profile.lastName || ''
  return `${firstName} ${lastName}`.trim() || 'Usuario'
})

// Funciones para perfil
const saveProfile = async () => {
  try {
    const userId = getUserId()

    // Validar datos del perfil
    const validation = ProfileDomainService.validateProfileData({
      firstName: profile.name,
      lastName: profile.lastName,
      email: profile.email,
      dni: profile.dni,
      district: profile.district
    })

    if (!validation.isValid) {
      const errors = Object.values(validation.errors).join(', ')
      modalAlert.value?.show('Configuración', errors)
      return
    }

    // Llamar al API de perfil usando ProfileApi (endpoint /Profile)
    const updatedProfile = await ProfileApi.updateUserProfile(userId, {
      firstName: profile.name,
      lastName: profile.lastName,
      email: profile.email,
      dni: profile.dni,
      district: profile.district
    })

    // Actualizar localStorage
    const user = JSON.parse(localStorage.getItem('energix-user'))
    Object.assign(user, {
      firstName: updatedProfile.firstName,
      name: updatedProfile.firstName,
      lastName: updatedProfile.lastName,
      email: updatedProfile.email,
      dni: updatedProfile.dni,
      district: updatedProfile.district
    })
    localStorage.setItem('energix-user', JSON.stringify(user))
    modalAlert.value?.show('Configuración', 'Perfil guardado correctamente')
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message || 'Error al guardar el perfil'
    modalAlert.value?.show('Configuración', errorMsg)
  }
}

const cancelProfile = () => {
  modalAlert.value?.show('Configuración', 'Cambios cancelados')
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    profile.invoiceFileName = file.name
  }
}

// Función para cambio de contraseña
const updatePassword = async () => {
  // Validación 1: Verificar que todos los campos estén llenos
  if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
    modalAlert.value?.show(t('configuration.title'), t('configuration.messages.passwordFieldsRequired') || 'Todos los campos son requeridos')
    return
  }

  // Validación 2: Verificar que la nueva contraseña y la confirmación coincidan
  if (security.newPassword !== security.confirmPassword) {
    modalAlert.value?.show(t('configuration.title'), t('configuration.messages.passwordMismatch') || 'Las contraseñas no coinciden')
    return
  }

  // Validación 3: Verificar que la nueva contraseña sea diferente a la actual
  if (security.currentPassword === security.newPassword) {
    modalAlert.value?.show(t('configuration.title'), t('configuration.messages.passwordSameAsCurrent') || 'La nueva contraseña debe ser diferente a la actual')
    return
  }

  // Validación 4: Validar fortaleza de la contraseña
  const passwordValidation = ProfileDomainService.validatePasswordStrength(security.newPassword)
  if (!passwordValidation.isValid) {
    const errors = passwordValidation.errors.join(', ')
    modalAlert.value?.show(t('configuration.title'), errors)
    return
  }

  try {
    const userId = getUserId()

    // Llamar al API de perfil para cambiar contraseña
    await ProfileApi.changePassword(
      userId,
      security.currentPassword,
      security.newPassword
    )

    // Limpiar los campos después de éxito
    security.currentPassword = ''
    security.newPassword = ''
    security.confirmPassword = ''

    modalAlert.value?.show(t('configuration.title'), t('configuration.messages.passwordUpdated') || 'Contraseña actualizada correctamente')
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message || t('configuration.messages.passwordError') || 'Error al actualizar la contraseña'
    modalAlert.value?.show(t('configuration.title'), errorMsg)
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
}
</style>
