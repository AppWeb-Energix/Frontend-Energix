import { http } from '../../shared/infrastructure/base-api.js';

const ALERTS = (import.meta.env.VITE_ALERTS_ENDPOINT_PATH || '/alerts').replace(/\/+$/, '');

export const AlertsApi = {
    async getAll() {
        return await http.get(ALERTS);
    },

    async getByUserId(userId) {
        return await http.get(`${ALERTS}?userId=${userId}`);
    },

    async markAsRead(id) {
        return await http.patch(`${ALERTS}/${id}`, { isRead: true });
    },

    async markAllAsRead(userId) {
        const alerts = await this.getByUserId(userId);
        const updates = alerts
            .filter(a => !a.isRead)
            .map(a => http.patch(`${ALERTS}/${a.id}`, { isRead: true }));
        return await Promise.all(updates);
    }
};
