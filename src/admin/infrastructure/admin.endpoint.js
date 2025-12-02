// admin/infrastructure/admin.endpoint.js
import { http } from '@/shared/infrastructure/base-api.js'

// Variables de entorno para endpoints de admin
const ADMIN_HEALTH_PATH = import.meta.env.VITE_ADMIN_HEALTH_ENDPOINT_PATH || '/admin/health'
const ADMIN_DASHBOARD_PATH = import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT_PATH || '/admin/dashboard'
const ADMIN_AUDIT_PATH = import.meta.env.VITE_ADMIN_AUDIT_ENDPOINT_PATH || '/admin/audit'

/**
 * API para el módulo de administración
 */
export const AdminApi = {
  /**
   * Verifica el estado de salud del sistema
   * @returns {Promise<{healthy: boolean, details: string}>}
   */
  async getHealth() {
    return await http.get(ADMIN_HEALTH_PATH)
  },

  /**
   * Obtiene estadísticas del dashboard administrativo (KPIs, gráficos, etc.)
   * @returns {Promise<{totalUsers: number, activeSubscriptions: number, activeDevices: number, totalRevenue: number, plans: Array, topDistricts: Array}>}
   */
  async getDashboardStats() {
    return await http.get(ADMIN_DASHBOARD_PATH)
  },

  /**
   * Obtiene los registros de auditoría del sistema
   * @returns {Promise<Array<{timestamp: string, message: string, action?: string}>>}
   */
  async getAuditLogs() {
    return await http.get(ADMIN_AUDIT_PATH)
  }
}

