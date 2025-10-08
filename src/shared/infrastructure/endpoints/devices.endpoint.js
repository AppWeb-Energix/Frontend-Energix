import { http } from '@/shared/infrastructure/base-api';

const DEVICES = (import.meta.env.VITE_DEVICES_ENDPOINT_PATH || '/devices').replace(/\/+$/, '');
const ZONES   = (import.meta.env.VITE_ZONES_ENDPOINT_PATH   || '/zones').replace(/\/+$/, '');

export const DevicesApi = {
    // Devices
    getByUserId(userId) { return http.get(`${DEVICES}?userId=${userId}`); },
    create(userId, payload) {
        const now = new Date().toISOString();
        return http.post(DEVICES, { userId, linkedAt: now, status: 'off', online: false, zoneId: null, ...payload });
    },
    update(id, patch) { return http.patch(`${DEVICES}/${id}`, patch); },
    remove(id) { return http.delete(`${DEVICES}/${id}`); },

    // Zones (solo plan familiar)
    getZones(userId) { return http.get(`${ZONES}?userId=${userId}`); },
    createZone(userId, name) { return http.post(ZONES, { userId, name }); },
    renameZone(zoneId, name){ return http.patch(`${ZONES}/${zoneId}`, { name }); },
    deleteZone(zoneId){ return http.delete(`${ZONES}/${zoneId}`); },

    // Asignar zona a un device
    setDeviceZone(deviceId, zoneId){ return http.patch(`${DEVICES}/${deviceId}`, { zoneId }); }
};
