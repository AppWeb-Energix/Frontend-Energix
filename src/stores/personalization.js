// src/stores/personalization.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

function getUserId() {
    try {
        const user = JSON.parse(localStorage.getItem('energix-user'))
        return user?.id || 'default'
    } catch {
        return 'default'
    }
}

export const usePersonalizationStore = defineStore('personalization', () => {
    const kpiCurrent = ref(true)
    const kpiCost = ref(true)
    const kpiMonthly = ref(true)
    const chartHourly = ref(true)
    const chartMonthly = ref(false)
    const chartDevice = ref(true)

    // Cargar configuración personalizada por usuario
    function loadPersonalization() {
        const userId = getUserId()
        const data = JSON.parse(localStorage.getItem(`personalization_${userId}`) || 'null')
        if (data) {
            kpiCurrent.value = data.kpiCurrent
            kpiCost.value = data.kpiCost
            kpiMonthly.value = data.kpiMonthly
            chartHourly.value = data.chartHourly
            chartMonthly.value = data.chartMonthly
            chartDevice.value = data.chartDevice
        }
    }

    // Guardar configuración personalizada por usuario
    function savePersonalization(forceValues) {
        const userId = getUserId()
        // Si se pasan valores explícitos (por ejemplo, desde configuration.vue), usarlos
        const data = forceValues || {
            kpiCurrent: kpiCurrent.value,
            kpiCost: kpiCost.value,
            kpiMonthly: kpiMonthly.value,
            chartHourly: chartHourly.value,
            chartMonthly: chartMonthly.value,
            chartDevice: chartDevice.value
        }
        localStorage.setItem(`personalization_${userId}` , JSON.stringify(data))
        // Refrescar los valores reactivos si se usó forceValues
        if (forceValues) {
            kpiCurrent.value = data.kpiCurrent
            kpiCost.value = data.kpiCost
            kpiMonthly.value = data.kpiMonthly
            chartHourly.value = data.chartHourly
            chartMonthly.value = data.chartMonthly
            chartDevice.value = data.chartDevice
        }
    }

    function setPersonalization(data) {
        kpiCurrent.value = data.kpiCurrent
        kpiCost.value = data.kpiCost
        kpiMonthly.value = data.kpiMonthly
        chartHourly.value = data.chartHourly
        chartMonthly.value = data.chartMonthly
        chartDevice.value = data.chartDevice
        savePersonalization()
    }

    function resetPersonalization() {
        const userId = getUserId()
        kpiCurrent.value = true
        kpiCost.value = true
        kpiMonthly.value = true
        chartHourly.value = true
        chartMonthly.value = false
        chartDevice.value = true
        localStorage.removeItem(`personalization_${userId}`)
    }

    // Guardar automáticamente cuando cambian los valores
    watch([
        kpiCurrent, kpiCost, kpiMonthly, chartHourly, chartMonthly, chartDevice
    ], savePersonalization)

    // Cargar al inicializar
    loadPersonalization()

    return {
        kpiCurrent,
        kpiCost,
        kpiMonthly,
        chartHourly,
        chartMonthly,
        chartDevice,
        setPersonalization,
        loadPersonalization,
        savePersonalization,
        resetPersonalization
    }
})
