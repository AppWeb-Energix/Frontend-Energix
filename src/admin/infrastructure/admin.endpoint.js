// admin/infrastructure/admin.endpoint.js
import { http } from '@/shared/infrastructure/base-api.js';

/**
 * AdminApi - Endpoints para el panel de administración
 * Consume los endpoints del backend de administración
 */
export const AdminApi = {
    /**
     * Obtiene el estado de salud del sistema
     * @returns {Promise<{status: string}>} Estado del sistema (healthy/unhealthy)
     */
    async getHealth() {
        return await http.get('/admin/health');
    },

    /**
     * Obtiene las métricas del dashboard administrativo
     * @returns {Promise<{totalUsers: number, activeDevices: number, planDistribution: object}>}
     */
    async getDashboard() {
        return await http.get('/admin/dashboard');
    },

    /**
     * Obtiene el registro de auditoría del sistema
     * @returns {Promise<Array<{date: string, message: string}>>} Lista de eventos de auditoría
     */
    async getAuditLogs() {
        return await http.get('/admin/audit');
    }
};

