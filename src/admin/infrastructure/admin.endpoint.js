// admin/infrastructure/admin.endpoint.js
import { http } from '@/shared/infrastructure/base-api.js'

/**
 * API para el módulo de administración
 */
export const AdminApi = {
  /**
   * Verifica el estado de salud del sistema
   * @returns {Promise<{healthy: boolean, details: string}>}
   */
  async getHealth() {
    return await http.get('/health')
  },

  /**
   * Obtiene estadísticas del dashboard administrativo (KPIs, gráficos, etc.)
   * @returns {Promise<{totalUsers: number, activeSubscriptions: number, activeDevices: number, totalRevenue: number, plans: Array, topDistricts: Array}>}
   */
  async getDashboardStats() {
    return await http.get('/dashboard')
  },

  /**
   * Obtiene los registros de auditoría del sistema
   * @returns {Promise<Array<{timestamp: string, message: string, action?: string}>>}
   */
  async getAuditLogs() {
    return await http.get('/audit-logs')
  }
}

