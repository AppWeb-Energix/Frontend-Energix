// src/stores/personalization.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

function getUserId() {
    try {
        const user = JSON.parse(localStorage.getItem('energix-user'))
        return user?.id || 'default'
    } catch {
        return 'default'
    }
}

const DEFAULTS = {
    kpiCurrent: true,
    kpiCost: true,
    kpiMonthly: true,
    chartHourly: true,
    chartMonthly: false,
    chartDevice: true
}

export const usePersonalizationStore = defineStore('personalization', () => {
    const kpiCurrent = ref(DEFAULTS.kpiCurrent)
    const kpiCost = ref(DEFAULTS.kpiCost)
    const kpiMonthly = ref(DEFAULTS.kpiMonthly)
    const chartHourly = ref(DEFAULTS.chartHourly)
    const chartMonthly = ref(DEFAULTS.chartMonthly)
    const chartDevice = ref(DEFAULTS.chartDevice)

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
        } else {
            // Si no hay datos, usar los valores por defecto
            resetToDefaults()
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
    }

    function resetToDefaults() {
        kpiCurrent.value = DEFAULTS.kpiCurrent
        kpiCost.value = DEFAULTS.kpiCost
        kpiMonthly.value = DEFAULTS.kpiMonthly
        chartHourly.value = DEFAULTS.chartHourly
        chartMonthly.value = DEFAULTS.chartMonthly
        chartDevice.value = DEFAULTS.chartDevice
        savePersonalization(DEFAULTS)
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
        resetToDefaults,
        resetPersonalization: resetToDefaults
    }
})
