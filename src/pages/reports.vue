<template>
  <div class="flex-1 p-8 bg-gray-50 min-h-screen">

    <div class="grid grid-cols-5 gap-4 mb-8">

      <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col justify-center text-center">
        <p class="text-sm text-gray-500 mb-1">Consumo total</p>
        <p class="text-2xl font-bold text-gray-900">65 kWh</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col justify-center text-center">
        <p class="text-sm text-gray-500 mb-1">Costo total estimado</p>
        <p class="text-2xl font-bold text-gray-900">S/ 45.20</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col justify-center text-center">
        <p class="text-sm text-gray-500 mb-1">Meta cumplida</p>
        <p class="text-2xl font-bold text-green-600">33%</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col justify-center text-center">
        <p class="text-sm text-gray-500 mb-1">Ahorro comparado</p>
        <p class="text-2xl font-bold text-gray-900">10%</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col justify-center text-center">
        <p class="text-sm text-gray-500 mb-1">Promedio día/semana</p>
        <p class="text-2xl font-bold text-gray-900">7.5 kWh</p>
      </div>

    </div>

    <div class="flex space-x-2 justify-end mb-8">
      <button class="flex items-center space-x-2 px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150">
        <i data-feather="download" class="w-4 h-4"></i>
        <span>Exportar Consumo (CSV)</span>
      </button>
      <button class="flex items-center space-x-2 px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150">
        <i data-feather="bar-chart-2" class="w-4 h-4"></i>
        <span>Exportar Ranking (CSV)</span>
      </button>
      <button class="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition duration-150">
        <i data-feather="printer" class="w-4 h-4"></i>
        <span>Exportar PDF</span>
      </button>
    </div>

    <div class="grid grid-cols-3 gap-6 mb-8">

      <div class="col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Consumo esta semana (hasta hoy)</h3>
        <div class="chart-container h-64">
          <canvas ref="consumptionChartCanvas"></canvas>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Cumplimiento de metas (diario)</h3>
        <div class="chart-container h-64">
          <canvas ref="goalsChartCanvas"></canvas>
        </div>
        <p class="text-xs text-gray-500 mt-4">Días dentro de meta: 5 | Excedidos: 10</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6 mb-8">

      <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Ahorro acumulado (mes en curso)</h3>
        <div class="chart-container h-64">
          <canvas ref="savingsChartCanvas"></canvas>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Ranking de dispositivos</h3>

        <div class="space-y-4">
          <div class="text-sm font-medium text-gray-700">Laptop (60%)</div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div class="bg-blue-600 h-3 rounded-full" style="width: 60%"></div>
          </div>
          <div class="text-sm font-medium text-gray-700">Refrigerador (40%)</div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div class="bg-red-600 h-3 rounded-full" style="width: 40%"></div>
          </div>
        </div>

        <div class="mt-8">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="py-3 px-6">Dispositivo / Electrodoméstico</th>
              <th scope="col" class="py-3 px-6">Consumo (kWh)</th>
              <th scope="col" class="py-3 px-6">% del total</th>
              <th scope="col" class="py-3 px-6">Costo estimado</th>
            </tr>
            </thead>
            <tbody>
            <tr class="bg-white border-b">
              <td class="py-3 px-6 flex items-center"><span class="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>Laptop</td>
              <td class="py-3 px-6">120 kWh</td>
              <td class="py-3 px-6">60%</td>
              <td class="py-3 px-6">S/ 7.20</td>
            </tr>
            <tr class="bg-white">
              <td class="py-3 px-6 flex items-center"><span class="w-2 h-2 rounded-full bg-red-600 mr-2"></span>Refrigerador</td>
              <td class="py-3 px-6">80 kWh</td>
              <td class="py-3 px-6">40%</td>
              <td class="py-3 px-6">S/ 4.80</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="text-center mt-8">
      <button class="flex items-center space-x-2 px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm mx-auto hover:bg-gray-50 transition duration-150">
        <i data-feather="download" class="w-4 h-4"></i>
        <span>Exportar Consumo (CSV)</span>
      </button>
      <p class="text-xs text-gray-400 mt-2">El reporte incluye: consumo total, costo estimado, ahorro comparado, promedio diario/semanal y ranking de dispositivos.</p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Referencias a los elementos canvas
const consumptionChartCanvas = ref(null);
const savingsChartCanvas = ref(null);
const goalsChartCanvas = ref(null);

// Inicializa los 3 gráficos
const initializeCharts = () => {
  // --- GRÁFICO 1: Consumo esta semana (Barra Horizontal) ---
  if (consumptionChartCanvas.value) {
    new Chart(consumptionChartCanvas.value.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['0 kWh', '2 kWh', '4 kWh', '6 kWh', '8 kWh'], // Eje X simulado
        datasets: [{
          label: 'Consumo Semanal',
          data: [8, 8, 8, 8, 8], // Solo un valor que ocupa todo el espacio
          backgroundColor: 'rgba(59, 130, 246, 0.8)', // Azul
          borderRadius: 0,
          barPercentage: 1, // Para que la barra sea gruesa
          categoryPercentage: 1,
        }]
      },
      options: {
        indexAxis: 'y', // Hace la barra horizontal
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: false, // Ocultar números del eje X
            max: 8,
            min: 0,
          },
          y: {
            grid: { display: false },
            ticks: { display: false } // Ocultar ticks del eje Y
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        elements: {
          bar: {
            borderWidth: 0,
            barThickness: 'flex'
          }
        }
      }
    });
  }

  // --- GRÁFICO 2: Ahorro acumulado (Línea) ---
  if (savingsChartCanvas.value) {
    new Chart(savingsChartCanvas.value.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3'],
        datasets: [{
          label: 'Ahorro (S/)',
          data: [1, 2.5, 4],
          borderColor: 'rgb(59, 130, 246)', // Azul
          tension: 0.4,
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: 'rgb(59, 130, 246)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 4,
            ticks: { stepSize: 1 }
          },
          x: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
        }
      }
    });
  }

  // --- GRÁFICO 3: Cumplimiento de metas (Barra Vertical) ---
  if (goalsChartCanvas.value) {
    new Chart(goalsChartCanvas.value.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Cumplidos', 'Excedidos'],
        datasets: [{
          label: 'Días',
          data: [12, 6],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)', // Verde
            'rgba(239, 68, 68, 0.8)'   // Rojo
          ],
          borderRadius: 4,
          barPercentage: 0.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 12,
            ticks: { stepSize: 3 }
          },
          x: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
        }
      }
    });
  }
};

onMounted(() => {
  // Llama a la inicialización de los gráficos cuando el componente esté montado
  nextTick(() => {
    initializeCharts();

    // Si estás usando Feather Icons para los botones de exportación:
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  });
});
</script>