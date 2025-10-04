<template>
  <div class="alerts-container">
    <div class="alerts-content">
      <!-- Header -->
      <div class="alerts-header">
        <h2 class="alerts-title">Alertas</h2>
        <div class="alerts-actions">
          <button class="btn-outline">
            <span class="checkbox-icon">☑</span>
            Marcar detectadas
          </button>
          <button class="btn-outline">
            <span class="mark-icon">✓</span>
            Marcar todas como leídas
          </button>
        </div>
      </div>

      <!-- Lista de Alertas -->
      <div class="alerts-list">
        <!-- Alerta Advertencia 1 -->
        <div class="alert-item alert-warning">
          <div class="alert-content">
            <div class="alert-header-row">
              <div class="alert-badge">Advertencia</div>
              <div class="alert-timestamp">15/9/2025, 6:00:08 p. m.</div>
            </div>
            <div class="alert-message">Alcanzaste el 80% del límite mensual</div>
            <div class="alert-details">Consumo: 240.8 / 300 kWh</div>
          </div>
        </div>

        <!-- Alerta Advertencia 2 -->
        <div class="alert-item alert-warning">
          <div class="alert-content">
            <div class="alert-header-row">
              <div class="alert-badge">Advertencia</div>
              <div class="alert-timestamp">15/9/2025, 6:17:08 p. m.</div>
            </div>
            <div class="alert-message">Alcanzaste el 80% del límite mensual</div>
            <div class="alert-details">Consumo: 240.8 / 300 kWh</div>
          </div>
        </div>

        <!-- Alerta Advertencia 3 -->
        <div class="alert-item alert-warning">
          <div class="alert-content">
            <div class="alert-header-row">
              <div class="alert-badge">Advertencia</div>
              <div class="alert-timestamp">15/9/2025, 6:25:46 p. m.</div>
            </div>
            <div class="alert-message">Alcanzaste el 80% del límite mensual</div>
            <div class="alert-details">Consumo: 240.8 / 300 kWh</div>
          </div>
        </div>

        <!-- Alerta Advertencia 4 -->
        <div class="alert-item alert-warning">
          <div class="alert-content">
            <div class="alert-header-row">
              <div class="alert-badge">Advertencia</div>
              <div class="alert-timestamp">15/9/2025, 6:40:08 p. m.</div>
            </div>
            <div class="alert-message">Alcanzaste el 80% del límite mensual</div>
            <div class="alert-details">Consumo: 240.8 / 300 kWh</div>
          </div>
        </div>

        <!-- Alerta Advertencia 5 -->
        <div class="alert-item alert-warning">
          <div class="alert-content">
            <div class="alert-header-row">
              <div class="alert-badge">Advertencia</div>
              <div class="alert-timestamp">15/9/2025, 9:30:00 p. m.</div>
            </div>
            <div class="alert-message">Alcanzaste el 80% del límite mensual</div>
            <div class="alert-details">Consumo: 240.8 / 300 kWh</div>
          </div>
        </div>

        <!-- Alerta Advertencia 6 -->
        <div class="alert-item alert-warning">
          <div class="alert-content">
            <div class="alert-header-row">
              <div class="alert-badge">Advertencia</div>
              <div class="alert-timestamp">15/9/2025, 9:40:31 p. m.</div>
            </div>
            <div class="alert-message">Alcanzaste el 80% del límite mensual</div>
            <div class="alert-details">Consumo: 240.8 / 300 kWh</div>
          </div>
        </div>

        <!-- Alerta Advertencia 7 -->
        <div class="alert-item alert-warning">
          <div class="alert-content">
            <div class="alert-header-row">
              <div class="alert-badge">Advertencia</div>
              <div class="alert-timestamp">15/9/2025, 9:40:31 p. m.</div>
            </div>
            <div class="alert-message">Alcanzaste el 80% del límite mensual</div>
            <div class="alert-details">Consumo: 240.8 / 300 kWh</div>
          </div>
        </div>

        <!-- Alerta Info -->
        <div class="alert-item alert-info">
          <div class="alert-content">
            <div class="alert-header-row">
              <div class="alert-badge alert-badge-info">Info</div>
              <div class="alert-timestamp">15/9/2025, 6:47:37 p. m.</div>
            </div>
            <div class="alert-message">Registro completado</div>
            <div class="alert-details">Bienvenido, Jorge</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

// Estado reactivo para las alertas
const alerts = reactive([
  {
    id: 1,
    type: 'warning',
    badge: 'Advertencia',
    message: 'Alcanzaste el 80% del límite mensual',
    details: 'Consumo: 240.8 / 300 kWh',
    timestamp: '15/9/2025, 6:00:08 p. m.',
    isRead: false
  },
  {
    id: 2,
    type: 'warning',
    badge: 'Advertencia',
    message: 'Alcanzaste el 80% del límite mensual',
    details: 'Consumo: 240.8 / 300 kWh',
    timestamp: '15/9/2025, 6:17:08 p. m.',
    isRead: false
  },
  {
    id: 3,
    type: 'warning',
    badge: 'Advertencia',
    message: 'Alcanzaste el 80% del límite mensual',
    details: 'Consumo: 240.8 / 300 kWh',
    timestamp: '15/9/2025, 6:25:46 p. m.',
    isRead: false
  },
  {
    id: 4,
    type: 'warning',
    badge: 'Advertencia',
    message: 'Alcanzaste el 80% del límite mensual',
    details: 'Consumo: 240.8 / 300 kWh',
    timestamp: '15/9/2025, 6:40:08 p. m.',
    isRead: false
  },
  {
    id: 5,
    type: 'warning',
    badge: 'Advertencia',
    message: 'Alcanzaste el 80% del límite mensual',
    details: 'Consumo: 240.8 / 300 kWh',
    timestamp: '15/9/2025, 9:30:00 p. m.',
    isRead: false
  },
  {
    id: 6,
    type: 'warning',
    badge: 'Advertencia',
    message: 'Alcanzaste el 80% del límite mensual',
    details: 'Consumo: 240.8 / 300 kWh',
    timestamp: '15/9/2025, 9:40:31 p. m.',
    isRead: false
  },
  {
    id: 7,
    type: 'warning',
    badge: 'Advertencia',
    message: 'Alcanzaste el 80% del límite mensual',
    details: 'Consumo: 240.8 / 300 kWh',
    timestamp: '15/9/2025, 9:40:31 p. m.',
    isRead: false
  },
  {
    id: 8,
    type: 'info',
    badge: 'Info',
    message: 'Registro completado',
    details: 'Bienvenido, Jorge',
    timestamp: '15/9/2025, 6:47:37 p. m.',
    isRead: false
  }
]);

// Métodos
const markSelectedAsDetected = () => {
  console.log('Marcar detectadas');
  alert('Alertas marcadas como detectadas');
}

const markAllAsRead = () => {
  alerts.forEach(alert => {
    alert.isRead = true;
  });
  console.log('Todas las alertas marcadas como leídas');
  alert('Todas las alertas marcadas como leídas');
}

const markAsRead = (alertId) => {
  const alert = alerts.find(a => a.id === alertId);
  if (alert) {
    alert.isRead = true;
  }
}
</script>

<style scoped>
/* ESTILOS EXACTOS PARA ALERTAS BASADOS EN EL MOCKUP */

.alerts-container {
  flex: 1;
  padding: 32px;
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.alerts-content {
  max-width: 1024px;
  margin: 0 auto;
}

/* HEADER */
.alerts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.alerts-title {
  font-size: 28px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.alerts-actions {
  display: flex;
  gap: 12px;
}

.btn-outline {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: white;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-outline:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.checkbox-icon,
.mark-icon {
  font-size: 12px;
  color: #6b7280;
}

/* LISTA DE ALERTAS */
.alerts-list {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* ITEMS DE ALERTA */
.alert-item {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.15s ease;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-item:hover {
  background-color: #fafafa;
}

.alert-content {
  padding: 20px 24px;
}

.alert-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.alert-badge {
  background-color: #fef3c7;
  color: #92400e;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.alert-badge-info {
  background-color: #dbeafe;
  color: #1e40af;
}

.alert-timestamp {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 400;
}

.alert-message {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
  line-height: 1.4;
}

.alert-details {
  font-size: 12px;
  color: #6b7280;
  font-weight: 400;
}

/* TIPOS DE ALERTAS */
.alert-warning {
  border-left: 4px solid #f59e0b;
  background-color: #fffbeb;
}

.alert-info {
  border-left: 4px solid #3b82f6;
  background-color: #eff6ff;
}

.alert-warning:hover {
  background-color: #fef3c7;
}

.alert-info:hover {
  background-color: #dbeafe;
}

/* ESTADOS DE ALERTAS */
.alert-item.read {
  opacity: 0.7;
}

.alert-item.read .alert-message {
  color: #6b7280;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .alerts-container {
    padding: 16px;
  }

  .alerts-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .alerts-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .alert-content {
    padding: 16px;
  }

  .alert-header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .btn-outline {
    font-size: 12px;
    padding: 6px 12px;
  }
}

/* ANIMACIONES SUTILES */
.alert-item {
  transition: all 0.2s ease;
}

.alert-badge {
  transition: all 0.15s ease;
}

.btn-outline {
  transition: all 0.15s ease;
}

/* SCROLL PERSONALIZADO */
.alerts-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.alerts-list::-webkit-scrollbar {
  width: 6px;
}

.alerts-list::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.alerts-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.alerts-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* FOCUS STATES PARA ACCESIBILIDAD */
.btn-outline:focus,
.alert-item:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* LOADING STATES (OPCIONAL) */
.alerts-list.loading {
  opacity: 0.6;
  pointer-events: none;
}

/* EMPTY STATE (OPCIONAL) */
.alerts-empty {
  text-align: center;
  padding: 64px 24px;
  color: #6b7280;
}

.alerts-empty h3 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
}

.alerts-empty p {
  font-size: 14px;
}
</style>