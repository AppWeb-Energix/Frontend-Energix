<template>
  <div class="flex-1 p-8 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Configuración</h2>
      <p class="text-sm text-gray-500 mb-8">
        Plan actual: <span class="text-gray-700">Plan Estudiantil</span> | Historial: <span class="text-gray-700">90 días</span> | Dispositivos: <span class="text-gray-700">2</span>
      </p>

      <section class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Perfil</h3>
        <div class="grid grid-cols-2 gap-x-6 gap-y-4">
          <InputGroup label="Nombre" v-model="profile.name" placeholder="Jorge" />
          <InputGroup label="Apellido" v-model="profile.lastName" placeholder="Benavides" />
          <InputGroup label="Correo" v-model="profile.email" placeholder="jorge@gmail.com" />
          <InputGroup label="DNI" v-model="profile.dni" placeholder="99999999" />
          <InputGroup label="Distrito" v-model="profile.district" placeholder="Miraflores" />
          <div class="col-span-1">
            <InputGroup label="Adjuntar recibo de luz (PDF/JPG)" v-model="profile.invoice" type="text" placeholder="Recibo cargado.pdf" />
          </div>
        </div>
        <div class="flex space-x-4 mt-6">
          <button class="px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition duration-150">Guardar Cambios</button>
          <button class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150">Cancelar</button>
        </div>
      </section>

      <section class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <div class="flex justify-between items-start mb-6">
          <h3 class="text-xl font-semibold text-gray-800 border-b pb-2">Plan</h3>
          <span class="text-xs text-blue-600 border border-blue-200 bg-blue-50 px-2 py-0.5 rounded-full cursor-pointer hover:bg-blue-100">Cambiar Plan</span>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <label for="plan-select" class="block text-sm font-medium text-gray-700 mb-1">Tipo de plan</label>
            <select id="plan-select" v-model="plan.type" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900">
              <option value="estudiantil">Plan Estudiantil</option>
              <option value="familiar">Plan Familiar</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Tu plan permite 2 dispositivo(s). Tienes 2/2.</p>
          </div>

          <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800 space-y-1">
            <h4 class="font-semibold mb-2">Plan Estudiantil (Activo)</h4>
            <ul class="list-disc list-inside space-y-1">
              <li>Historial ampliado (últimos 3 meses)</li>
              <li>Soporte Técnico (24/7)</li>
              <li>Integración con hasta 3 dispositivos inteligentes</li>
              <li>Registro diario de kWh y costos</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Preferencias</h3>
        <div class="grid grid-cols-2 gap-x-6 gap-y-6">

          <div class="space-y-4">
            <InputGroup label="Meta costo (S/ kWh)" v-model="preferences.costGoal" type="number" placeholder="0.5" suffix="S/ kWh" />
            <InputGroup label="Meta ahorro (kWh) / Límite" v-model="preferences.savingsGoal" type="number" placeholder="8" suffix="kWh" />
            <p class="text-xs text-gray-500 mt-1">Activa las alertas para recibir notificaciones.</p>
          </div>

          <div class="space-y-4 pt-4">
            <CheckboxGroup label="Resumen diario por correo" v-model="preferences.dailySummary" />
            <CheckboxGroup label="Aviso al 50% del límite mensual" v-model="preferences.limit50" />
            <CheckboxGroup label="Alerta de consumo inusual" v-model="preferences.unusualAlert" />
            <CheckboxGroup label="Enviar resumen diario (diario)" v-model="preferences.sendDailySummary" />
          </div>

        </div>
      </section>

      <section class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Dispositivos</h3>

        <div class="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded mb-6">
          <p class="font-medium">Alcanzaste el límite de tu plan (2/2). <a href="#" class="text-blue-700 font-semibold underline">Aumentar límite</a></p>
        </div>

        <div class="space-y-4 mb-8">
          <DeviceItem name="Refrigerador" status="Activo y monitoreando" date="15/9/2025, 6:00:08 p. m." />
          <DeviceItem name="Laptop" status="Activo y monitoreando" date="15/9/2025, 6:00:08 p. m." />
        </div>

        <h4 class="text-lg font-medium text-gray-800 mb-3">Nuevo dispositivo</h4>
        <div class="grid grid-cols-3 gap-x-6">
          <InputGroup label="Tipo de dispositivo" v-model="newDevice.type" placeholder="El plan permite 2 dispositivo(s). Tienes 2/2." />
          <InputGroup label="Marca/Modelo (opcional)" v-model="newDevice.model" />
          <div class="pt-6">
            <button class="w-full px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition duration-150 mt-1">Añadir</button>
          </div>
        </div>
      </section>

      <section class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Personalización del panel</h3>

        <div class="space-y-4 mb-6">
          <h4 class="text-md font-medium text-gray-700">KPIs a mostrar:</h4>
          <div class="flex space-x-6">
            <CheckboxGroup label="KPI Consumo actual" v-model="personalization.kpiCurrent" />
            <CheckboxGroup label="KPI Costo estimado" v-model="personalization.kpiCost" />
            <CheckboxGroup label="KPI Consumo mensual" v-model="personalization.kpiMonthly" />
          </div>

          <h4 class="text-md font-medium text-gray-700 mt-4">Gráficos en Dashboard:</h4>
          <div class="flex space-x-6">
            <CheckboxGroup label="Gráfico: Consumo por hora (hoy)" v-model="personalization.chartHourly" />
            <CheckboxGroup label="Gráfico: Consumo este mes (ahorro)" v-model="personalization.chartMonthly" />
            <CheckboxGroup label="Gráfico: Consumo por dispositivo (Status)" v-model="personalization.chartDevice" />
          </div>
        </div>

        <div class="flex space-x-4">
          <button class="px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition duration-150">Guardar Configuración</button>
          <button class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150">Restablecer</button>
        </div>
      </section>

      <section class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Seguridad</h3>
        <div class="grid grid-cols-3 gap-x-6 gap-y-4">
          <InputGroup label="Contraseña actual" v-model="security.currentPassword" type="password" />
          <InputGroup label="Nueva contraseña" v-model="security.newPassword" type="password" />
          <InputGroup label="Confirmar contraseña" v-model="security.confirmPassword" type="password" />
        </div>
        <div class="mt-6">
          <button class="px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition duration-150">Actualizar Contraseña</button>
        </div>
      </section>

      <section class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Integración con factura</h3>
        <p class="text-sm text-gray-500 mb-4">Cargar archivos de recibo de luz para calcular con precisión el consumo real y el margen estimado.</p>

        <div class="flex items-center space-x-4">
          <button class="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition duration-150">
            Seleccionar archivos
          </button>
          <p class="text-sm text-gray-600">5/10 archivos seleccionados</p>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

// --- Componentes Reutilizables (Para una app real, estos irían en una carpeta /components) ---

// Componente: Campo de Entrada con Label
const InputGroup = ({ label, modelValue, placeholder = '', type = 'text', suffix = '' }) => `
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">${label}</label>
    <div class="mt-1 flex rounded-md shadow-sm">
        <input type="${type}" value="${modelValue}" placeholder="${placeholder}" class="flex-1 block w-full border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-gray-900" />
        ${suffix ? `<span class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">${suffix}</span>` : ''}
    </div>
  </div>
`;

// Componente: Checkbox
const CheckboxGroup = ({ label, modelValue }) => `
  <div class="flex items-center">
    <input id="${label.replace(/\s/g, '-')}" type="checkbox" ${modelValue ? 'checked' : ''} class="h-4 w-4 text-blue-700 border-gray-300 rounded focus:ring-blue-500">
    <label for="${label.replace(/\s/g, '-')}" class="ml-2 block text-sm text-gray-900">${label}</label>
  </div>
`;

// Componente: Item de Dispositivo
const DeviceItem = ({ name, status, date }) => `
  <div class="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
    <div>
        <h4 class="text-base font-medium text-gray-900">${name} <span class="text-xs text-blue-600 ml-2">(${status.split(' ')[0]})</span></h4>
        <p class="text-sm text-gray-500">${status}</p>
    </div>
    <div class="text-xs text-gray-500">${date}</div>
  </div>
`;


// --- Estado Reactivo del Formulario ---
const profile = reactive({
  name: 'Jorge',
  lastName: 'Benavides',
  email: 'jorge@gmail.com',
  dni: '99999999',
  district: 'Miraflores',
  invoice: 'Recibo cargado.pdf',
});

const plan = reactive({
  type: 'estudiantil',
});

const preferences = reactive({
  costGoal: 0.5,
  savingsGoal: 8,
  dailySummary: true,
  limit50: false,
  unusualAlert: true,
  sendDailySummary: false,
});

const newDevice = reactive({
  type: '',
  model: '',
});

const personalization = reactive({
  kpiCurrent: true,
  kpiCost: true,
  kpiMonthly: true,
  chartHourly: true,
  chartMonthly: false,
  chartDevice: true,
});

const security = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// Nota: En una aplicación real, se usaría v-model directamente con los campos de formulario
// y no estos componentes funcionales simulados, pero funcionan para el mockup.

</script>