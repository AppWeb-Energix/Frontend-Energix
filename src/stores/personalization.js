// src/stores/personalization.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePersonalizationStore = defineStore('personalization', () => {
    const kpiCurrent = ref(true)
    const kpiCost = ref(true)
    const kpiMonthly = ref(true)
    const chartHourly = ref(true)
    const chartMonthly = ref(false)
    const chartDevice = ref(true)

    function setPersonalization(data) {
        kpiCurrent.value = data.kpiCurrent
        kpiCost.value = data.kpiCost
        kpiMonthly.value = data.kpiMonthly
        chartHourly.value = data.chartHourly
        chartMonthly.value = data.chartMonthly
        chartDevice.value = data.chartDevice
    }

    return {
        kpiCurrent,
        kpiCost,
        kpiMonthly,
        chartHourly,
        chartMonthly,
        chartDevice,
        setPersonalization
    }
})
