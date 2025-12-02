import { http } from '@/shared/infrastructure/base-api.js'

const DEVICES = (import.meta.env.VITE_DEVICES_ENDPOINT_PATH || '/devices').replace(/\/+$/, '')
const ZONES   = (import.meta.env.VITE_ZONES_ENDPOINT_PATH || '/zones').replace(/\/+$/, '')

const listeners = new Set()
export function onDeviceChange(cb){
    listeners.add(cb); return () => listeners.delete(cb)
}
function emitDeviceChange(){ listeners.forEach(cb => { try { cb() } catch(err){ console.error(err) } }) }

export const DevicesApi = {
    // ✅ SEGURO: El backend extrae userId del JWT
    async getByUserId(){
        return await http.get(DEVICES) // ❌ Eliminado ?userId=${userId}
    },

    // ✅ SEGURO: No envía userId - se extrae del JWT
    async create(payload){
        const result = await http.post(DEVICES, payload) // ❌ Eliminado ?userId=${userId}
        emitDeviceChange();
        return result
    },

    async update(id, patch){
        const r = await http.patch(`${DEVICES}/${id}`, patch);
        emitDeviceChange();
        return r
    },

    async remove(id){
        const r = await http.delete(`${DEVICES}/${id}`);
        emitDeviceChange();
        return r
    },

    // ✅ SEGURO: Zonas también usan JWT
    async getZones(){
        return await http.get(ZONES) // ❌ Eliminado ?userId=${userId}
    },

    async createZone(name){
        const r = await http.post(ZONES, { name }); // ❌ Eliminado userId del body
        emitDeviceChange();
        return r
    },

    async renameZone(zoneId, name){
        const r = await http.patch(`${ZONES}/${zoneId}`, { name });
        emitDeviceChange();
        return r
    },

    async deleteZone(zoneId){
        const r = await http.delete(`${ZONES}/${zoneId}`);
        emitDeviceChange();
        return r
    },

    async setDeviceZone(deviceId, zoneId){
        const r = await http.patch(`${DEVICES}/${deviceId}`, { zoneId });
        emitDeviceChange();
        return r
    },

    // ✅ SEGURO: Métricas también usan JWT
    async getManualChart(){
        return await http.get(`${DEVICES}/metrics/chart`) // ❌ Eliminado ?userId=${userId}
    },

    async getDashboardCharts(){
        return await http.get(`${DEVICES}/metrics/dashboard`) // ❌ Eliminado ?userId=${userId}
    },
}
