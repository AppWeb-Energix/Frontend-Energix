<template>
  <div class="flex-1 p-8 bg-gray-50 min-h-screen">
    <div class="flex space-x-6">

      <section class="flex-2 w-2/3 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Consumo</h2>
          <div id="time-buttons" class="flex space-x-2 text-sm p-1 rounded-lg bg-gray-50">
            <button
                v-for="time in timePeriods"
                :key="time.key"
                @click="selectTimePeriod(time.key)"
                :class="{'bg-blue-700 text-white shadow-md': selectedTime === time.key, 'text-gray-700 hover:bg-white': selectedTime !== time.key}"
                class="px-3 py-1 rounded-lg transition duration-150"
            >
              {{ time.label }}
            </button>
          </div>
        </div>

        <h3 class="text-lg font-medium text-gray-800 mb-1">Consumo ({{ selectedTimeLabel }}) - {{ selectedDeviceLabel }}</h3>
        <p class="text-xs text-gray-500 mb-6">Simulado • se actualiza cada minuto</p>

        <div class="chart-container">
          <canvas ref="consumptionChartCanvas"></canvas>
        </div>

      </section>

      <aside class="flex-1 w-1/3 space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">Resumen</h2>
          <div id="device-buttons" class="flex space-x-1 text-xs p-1 rounded-lg bg-gray-50">
            <button
                v-for="device in devices"
                :key="device.key"
                @click="selectDevice(device.key)"
                :class="{'bg-blue-700 text-white shadow-md': selectedDevice === device.key, 'text-gray-700 hover:bg-white': selectedDevice !== device.key}"
                class="px-3 py-1 rounded-lg transition duration-150"
            >
              {{ device.label }}
            </button>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <p class="text-sm text-gray-500 mb-1">Total período</p>
          <p class="text-2xl font-bold text-gray-900">{{ summary.total.value }} kWh</p>
          <p class="text-sm text-gray-500">{{ summary.cost.value }}</p>
        </div>

        <div class="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <p class="text-sm text-gray-500 mb-1">Promedio diario</p>
          <p class="text-2xl font-bold text-gray-900">{{ summary.average.value }} kWh</p>
        </div>

        <div class="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <p class="text-sm text-gray-500 mb-1">Plan</p>
          <p class="text-2xl font-bold text-gray-900">Plan Estudiantil</p>
          <p class="text-xs text-gray-500">Historial permitido: 90 días</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

// Referencia al elemento canvas
const consumptionChartCanvas = ref(null);
let consumptionChartInstance = null;

// --- Estado Reactivo ---
const selectedTime = ref('7days');
const selectedDevice = ref('all');

// Datos fijos para los botones
const timePeriods = [
  { key: 'today', label: 'Hoy' },
  { key: '7days', label: 'Últimos 7 días' },
  { key: '30days', label: 'Últimos 30 días' },
  { key: '90days', label: 'Últimos 90 días' },
];
const devices = [
  { key: 'all', label: 'Todos' },
  { key: 'laptop', label: 'Laptop' },
  { key: 'fridge', label: 'Refrigerador' },
];

// Datos simulados (deberían venir de una API real)
const mockData = {
  '7days': [7.8, 5.9, 4.8, 6.2, 6.8, 6.1, 6.5],
  '30days': Array.from({ length: 7 }, () => Math.floor(Math.random() * 5) + 3), // Simulación
  'laptop_7days': [1.2, 0.8, 1.5, 1.1, 1.3, 0.9, 1.0],
  'all_summary': { total: '47.3', cost: 's/ 28.38', average: '6.76' },
  'laptop_summary': { total: '7.8', cost: 's/ 4.68', average: '1.11' },
};

// --- Computed Properties para la UI ---
const selectedTimeLabel = computed(() => {
  return timePeriods.find(t => t.key === selectedTime.value)?.label;
});
const selectedDeviceLabel = computed(() => {
  return devices.find(d => d.key === selectedDevice.value)?.label;
});
const summary = computed(() => {
  // Lógica simple para cambiar el resumen
  if (selectedDevice.value === 'laptop') {
    return mockData.laptop_summary;
  }
  return mockData.all_summary;
});


// --- Lógica del Gráfico ---
const getChartData = () => {
  const dataKey = selectedTime.value.includes('7days') && selectedDevice.value === 'laptop'
      ? 'laptop_7days'
      : selectedTime.value;

  const labels = selectedTime.value === '7days' || selectedDevice.value === 'laptop'
      ? ['1', '2', '3', '4', '5', '6', '7'] // Días
      : ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']; // Semanas

  return {
    labels: labels,
    data: mockData[dataKey] || mockData['7days']
  };
};

const initializeChart = () => {
  if (consumptionChartInstance) {
    consumptionChartInstance.destroy();
  }

  const { labels, data } = getChartData();

  consumptionChartInstance = new Chart(consumptionChartCanvas.value, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Consumo (kWh)',
        data: data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 8,
          title: {
            display: true,
            text: '8 kWh',
            position: 'top',
            align: 'start',
            padding: 0
          },
          grid: { display: true }
        },
        x: { grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      }
    }
  });
};

// Función para actualizar el gráfico
const updateChart = () => {
  if (consumptionChartInstance) {
    const { labels, data } = getChartData();
    consumptionChartInstance.data.labels = labels;
    consumptionChartInstance.data.datasets[0].data = data;
    consumptionChartInstance.update();
  }
};

// --- Handlers de Interfaz ---
const selectTimePeriod = (key) => {
  selectedTime.value = key;
};

const selectDevice = (key) => {
  selectedDevice.value = key;
};

// --- Ciclo de Vida y Watchers ---

// Inicializa el gráfico cuando el componente se monta
onMounted(() => {
  initializeChart();
});

// Observa cambios en el tiempo y dispositivo para actualizar el gráfico
watch([selectedTime, selectedDevice], () => {
  updateChart();
});

</script>

<style scoped>
.chart-container {
  /* Define un alto fijo para que el gráfico se muestre correctamente */
  height: 250px;
  width: 100%;
}

/* Puedes añadir estilos específicos de los botones si Tailwind no lo permite directamente */
</style>