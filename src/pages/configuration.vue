<template>
  <div class="configuration-container">
    <div class="configuration-content">
      <!-- Header -->
      <h2 class="main-title">Configuración</h2>
      <p class="subtitle">
        Plan actual: <span class="highlight">Plan Estudiantil</span> | Historial: <span class="highlight">90 días</span> | Dispositivos: <span class="highlight">2</span>
      </p>

      <!-- Sección Perfil -->
      <div class="section-card">
        <h3 class="section-title">Perfil</h3>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Nombre</label>
            <input v-model="profile.name" type="text" placeholder="Jorge" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Apellido</label>
            <input v-model="profile.lastName" type="text" placeholder="Benavides" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Correo</label>
            <input v-model="profile.email" type="email" placeholder="jorge12@gmail.com" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">DNI</label>
            <input v-model="profile.dni" type="text" placeholder="99999999" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Distrito</label>
            <input v-model="profile.district" type="text" placeholder="Miraflores" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Adjuntar recibo de luz (PDF/JPG)</label>
            <div class="file-input-container">
              <input type="file" ref="fileInput" @change="handleFileUpload" accept=".pdf,.jpg,.jpeg" class="hidden-file-input" />
              <input type="text" :value="profile.invoiceFileName" readonly class="form-input file-display" />
              <button @click="$refs.fileInput.click()" class="file-button">Examinar</button>
            </div>
          </div>
        </div>

        <div class="button-group">
          <button @click="saveProfile" class="btn-primary">Guardar cambios</button>
          <button @click="cancelProfile" class="btn-secondary">Cancelar</button>
        </div>
      </div>

      <!-- Sección Plan -->
      <div class="section-card">
        <div class="section-header">
          <h3 class="section-title">Plan</h3>
          <Router-link :to="{ name: 'subscriptions' }" class="change-plan-badge">Cambiar Plan</Router-link>
        </div>

        <div class="plan-grid">
          <div class="plan-selector">
            <label class="form-label">Tipo de plan</label>
            <select v-model="plan.type" class="form-select">
              <option value="estudiantil">Estudiantil</option>
              <option value="familiar">Familiar</option>
              <option value="empresarial">Empresarial</option>
            </select>
            <p class="form-help">Historial 90 días | Dispositivos: 2</p>
          </div>

          <div class="plan-info">
            <h4 class="plan-title">Plan Estudiantil</h4>
            <ul class="plan-features">
              <li>• Todo del plan básico</li>
              <li>• Historial ampliado (últimos 3 meses)</li>
              <li>• Recomendaciones personalizadas</li>
              <li>• Monitoreo en tiempo real (hasta 5 usos simultáneos)</li>
              <li>• Integración con hasta 2 dispositivos inteligentes</li>
              <li>• Soporte básico por chat o correo</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Sección Preferencias -->
      <div class="section-card">
        <h3 class="section-title">Preferencias</h3>
        <div class="preferences-grid">
          <div class="preferences-left">
            <div class="form-group">
              <label class="form-label">Techo base (S/ kWh)</label>
              <select v-model="preferences.baseRate" class="form-select">
                <option value="S">S</option>
                <option value="1.0">1.0</option>
                <option value="1.5">1.5</option>
              </select>
              <p class="form-help">Se calcula su meta mensuales en base a su consumo histórico</p>
            </div>

            <div class="form-group">
              <label class="form-label">Meta diario (kWh) / Límite</label>
              <select v-model="preferences.dailyLimit" class="form-select">
                <option value="8">8</option>
                <option value="10">10</option>
                <option value="12">12</option>
              </select>
              <div class="checkbox-wrapper">
                <input type="checkbox" id="enableSummary" v-model="preferences.enableDailySummary" class="form-checkbox" />
                <label for="enableSummary" class="checkbox-label">Enviar resumen diario (ahorro)</label>
              </div>
            </div>
          </div>

          <div class="preferences-right">
            <div class="checkbox-group">
              <input type="checkbox" id="dailySummary" v-model="preferences.dailySummary" class="form-checkbox" />
              <label for="dailySummary" class="checkbox-label">Resumen diario por correo</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="limit80" v-model="preferences.limit80" class="form-checkbox" />
              <label for="limit80" class="checkbox-label">Aviso al 80% del límite mensual</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="unusualAlert" v-model="preferences.unusualAlert" class="form-checkbox" />
              <label for="unusualAlert" class="checkbox-label">Alerta de consumo inusual</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección Dispositivos -->
      <div class="section-card">
        <h3 class="section-title">Dispositivos</h3>

        <div class="device-alert">
          <p>
            Alcanzaste el límite de tu plan (2/2).
            <a href="#" class="alert-link">Aumentar límite</a>
          </p>
        </div>

        <div class="devices-list">
          <div class="device-item">
            <div class="device-info">
              <div class="status-indicator status-online"></div>
              <div class="device-details">
                <h4 class="device-name">Refrigerador <span class="device-status">online</span></h4>
                <p class="device-description">Activo y monitoreando</p>
              </div>
            </div>
            <div class="device-timestamp">15/9/2025, 6:00:08 p. m.</div>
          </div>

          <div class="device-item">
            <div class="device-info">
              <div class="status-indicator status-online"></div>
              <div class="device-details">
                <h4 class="device-name">Laptop <span class="device-status">online</span></h4>
                <p class="device-description">Activo y monitoreando</p>
              </div>
            </div>
            <div class="device-timestamp">15/9/2025, 6:00:08 p. m.</div>
          </div>
        </div>

        <h4 class="subsection-title">Nuevo dispositivo</h4>
        <div class="add-device-grid">
          <div class="form-group">
            <label class="form-label">Nuevo dispositivo</label>
            <input v-model="newDevice.type" placeholder="Ej. Foca solar" class="form-input" />
            <p class="form-help">Tu plan permite máximo 2 dispositivos. Tienes 2/2.</p>
          </div>
          <div class="form-group">
            <label class="form-label">Marca/Modelo (opcional)</label>
            <input v-model="newDevice.model" placeholder="Ej. Philips Hue" class="form-input" />
          </div>
          <div class="add-device-button-container">
            <button @click="addDevice" :disabled="devices.length >= 2" class="btn-primary full-width">Añadir</button>
          </div>
        </div>
      </div>

      <!-- Sección Personalización del panel -->
      <div class="section-card">
        <h3 class="section-title">Personalización del panel</h3>

        <div class="personalization-grid">
          <div class="checkbox-group">
            <input type="checkbox" id="kpiCurrent" v-model="personalization.kpiCurrent" class="form-checkbox" />
            <label for="kpiCurrent" class="checkbox-label">KPI Consumo actual</label>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="kpiCost" v-model="personalization.kpiCost" class="form-checkbox" />
            <label for="kpiCost" class="checkbox-label">KPI Costo estimado</label>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="kpiMonthly" v-model="personalization.kpiMonthly" class="form-checkbox" />
            <label for="kpiMonthly" class="checkbox-label">KPI Consumo mensual</label>
          </div>

          <div class="checkbox-group">
            <input type="checkbox" id="chartHourly" v-model="personalization.chartHourly" class="form-checkbox" />
            <label for="chartHourly" class="checkbox-label">Gráfico: Consumo por hora (hoy)</label>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="chartMonthly" v-model="personalization.chartMonthly" class="form-checkbox" />
            <label for="chartMonthly" class="checkbox-label">Gráfico: Consumo este mes (ahorro)</label>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="chartDevice" v-model="personalization.chartDevice" class="form-checkbox" />
            <label for="chartDevice" class="checkbox-label">Gráfico: Consumo por dispositivo (Status)</label>
          </div>
        </div>

        <div class="button-group">
          <button @click="savePersonalization" class="btn-primary">Guardar cambios</button>
          <button @click="resetPersonalization" class="btn-secondary">Restablecer</button>
        </div>
      </div>

      <!-- Sección Seguridad -->
      <div class="section-card">
        <h3 class="section-title">Seguridad</h3>
        <div class="security-grid">
          <div class="form-group">
            <label class="form-label">Contraseña actual</label>
            <input v-model="security.currentPassword" type="password" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Nueva contraseña</label>
            <input v-model="security.newPassword" type="password" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Confirmar contraseña</label>
            <input v-model="security.confirmPassword" type="password" class="form-input" />
          </div>
        </div>
        <div class="button-container">
          <button @click="updatePassword" class="btn-primary">Actualizar contraseña</button>
        </div>
      </div>

      <!-- Sección Integración con factura -->
      <div class="section-card">
        <h3 class="section-title">Integración con factura</h3>
        <p class="section-description">
          Sube tu CV con recuerdos; cuando tenemos datos históricos, compartimos el consumo real y el margen estimado.
        </p>

        <div class="file-upload-section">
          <button @click="selectInvoiceFiles" class="btn-file-upload">
            📄 Seleccionar archivos
          </button>
          <p class="file-status">Sin archivos seleccionados</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

// Referencias reactivas
const fileInput = ref(null)

// Estado reactivo del formulario
const profile = reactive({
  name: 'Jorge',
  lastName: 'Benavides',
  email: 'jorge12@gmail.com',
  dni: '99999999',
  district: 'Miraflores',
  invoiceFileName: ''
})

const plan = reactive({
  type: 'estudiantil'
})

const preferences = reactive({
  baseRate: 'S',
  dailyLimit: '8',
  enableDailySummary: false,
  dailySummary: true,
  limit80: true,
  unusualAlert: true
})

const newDevice = reactive({
  type: '',
  model: ''
})

const devices = reactive([
  {
    id: 1,
    name: 'Refrigerador',
    status: 'Activo y monitoreando',
    date: '15/9/2025, 6:00:08 p. m.',
    isOnline: true
  },
  {
    id: 2,
    name: 'Laptop',
    status: 'Activo y monitoreando',
    date: '15/9/2025, 6:00:08 p. m.',
    isOnline: true
  }
])

const personalization = reactive({
  kpiCurrent: true,
  kpiCost: true,
  kpiMonthly: true,
  chartHourly: true,
  chartMonthly: false,
  chartDevice: true
})

const security = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Métodos
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    profile.invoiceFileName = file.name
  }
}

const saveProfile = () => {
  alert('Perfil guardado correctamente')
}

const cancelProfile = () => {
  // Lógica de cancelación sin log
}

const addDevice = () => {
  if (devices.length >= 2) {
    alert('Has alcanzado el límite de dispositivos para tu plan')
    return
  }

  if (!newDevice.type || !newDevice.model) {
    alert('Por favor completa todos los campos del dispositivo')
    return
  }

  const device = {
    id: Date.now(),
    type: newDevice.type,
    model: newDevice.model,
    name: newDevice.type,
    status: 'Configurando...',
    date: new Date().toLocaleString('es-PE'),
    isOnline: false
  }

  devices.push(device)
  newDevice.type = ''
  newDevice.model = ''

  alert('Dispositivo agregado correctamente')
}

const savePersonalization = () => {
  alert('Personalización guardada correctamente')
}

const resetPersonalization = () => {
  personalization.kpiCurrent = true
  personalization.kpiCost = true
  personalization.kpiMonthly = true
  personalization.chartHourly = true
  personalization.chartMonthly = false
  personalization.chartDevice = true

  alert('Personalización restablecida')
}

const updatePassword = () => {
  if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
    alert('Por favor complete todos los campos de contraseña')
    return
  }

  if (security.newPassword !== security.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }

  if (security.newPassword.length < 8) {
    alert('La contraseña debe tener al menos 8 caracteres')
    return
  }

  security.currentPassword = ''
  security.newPassword = ''
  security.confirmPassword = ''

  alert('Contraseña actualizada correctamente')
}

const selectInvoiceFiles = () => {
  alert('Funcionalidad de selección de archivos de factura')
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

.subsection-title {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 16px;
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

.plan-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
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

.add-device-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: end;
}

.personalization-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

/* PLAN INFO */
.plan-info {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 16px;
}

.plan-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 12px;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-features li {
  font-size: 12px;
  color: #1d4ed8;
  margin-bottom: 4px;
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

/* DISPOSITIVOS */
.device-alert {
  background-color: #eff6ff;
  border-left: 4px solid #60a5fa;
  padding: 16px;
  margin-bottom: 24px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.device-alert p {
  font-size: 14px;
  color: #1e40af;
  margin: 0;
}

.alert-link {
  color: #1d4ed8;
  font-weight: 600;
  text-decoration: underline;
}

.alert-link:hover {
  color: #1e40af;
}

.devices-list {
  margin-bottom: 32px;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #f9fafb;
  margin-bottom: 12px;
}

.device-info {
  display: flex;
  align-items: center;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 12px;
}

.status-online {
  background-color: #10b981;
}

.device-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin: 0 0 4px 0;
}

.device-status {
  font-size: 12px;
  color: #6b7280;
  font-weight: 400;
}

.device-description {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.device-timestamp {
  font-size: 12px;
  color: #6b7280;
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

.btn-file-upload {
  background-color: #4b5563;
  color: white;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-file-upload:hover {
  background-color: #374151;
}

.button-group {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.button-container {
  margin-top: 32px;
}

.full-width {
  width: 100%;
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

.add-device-button-container {
  padding-top: 28px;
}

/* OTRAS SECCIONES */
.section-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.5;
}

.file-upload-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.file-status {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .form-grid-2,
  .plan-grid,
  .preferences-grid,
  .security-grid {
    grid-template-columns: 1fr;
  }

  .add-device-grid {
    grid-template-columns: 1fr;
  }

  .personalization-grid {
    grid-template-columns: 1fr;
  }

  .add-device-button-container {
    padding-top: 0;
  }
}
</style>