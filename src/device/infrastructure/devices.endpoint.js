import { http } from '@/shared/infrastructure/base-api.js'

const DEVICES = (import.meta.env.VITE_DEVICES_ENDPOINT_PATH || '/Devices').replace(/\/+$/, '')
const ZONES   = (import.meta.env.VITE_ZONES_ENDPOINT_PATH || '/Zones').replace(/\/+$/, '')

const listeners = new Set()
export function onDeviceChange(cb){
    listeners.add(cb); return () => listeners.delete(cb)
}
function emitDeviceChange(){ listeners.forEach(cb => { try { cb() } catch(err){ console.error(err) } }) }

export const DevicesApi = {
    async getByUserId(userId){ return await http.get(`${DEVICES}?userId=${userId}`) },
    async create(userId, payload){
        const result = await http.post(DEVICES, { userId, linkedAt:new Date().toISOString(), status:'off', online:false, zoneId:null, ...payload })
        emitDeviceChange(); return result
    },
    async update(id, patch){ const r = await http.patch(`${DEVICES}/${id}`, patch); emitDeviceChange(); return r },
    async remove(id){ const r = await http.delete(`${DEVICES}/${id}`); emitDeviceChange(); return r },

    async getZones(userId){ return await http.get(`${ZONES}?userId=${userId}`) },
    async createZone(userId, name){ const r = await http.post(ZONES, { userId, name }); emitDeviceChange(); return r },
    async renameZone(zoneId, name){ const r = await http.patch(`${ZONES}/${zoneId}`, { name }); emitDeviceChange(); return r },
    async deleteZone(zoneId){ const r = await http.delete(`${ZONES}/${zoneId}`); emitDeviceChange(); return r },
    async setDeviceZone(deviceId, zoneId){ const r = await http.patch(`${DEVICES}/${deviceId}`, { zoneId }); emitDeviceChange(); return r },

    async getManualChart(userId){ return await http.get(`${DEVICES}/metrics/chart?userId=${userId}`) },
    async getDashboardCharts(userId){
        return await http.get(`${DEVICES}/metrics/dashboard?userId=${userId}`)
    },


}
