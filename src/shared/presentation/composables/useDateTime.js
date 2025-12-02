import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useDateTime() {
    const { locale } = useI18n()

    const day = ref('')
    const date = ref('')
    const month = ref('')
    const hour = ref('')

    const actualDate = () => {
        const now = new Date()

        // ✅ Convierte locale a string explícitamente
        const localeString = locale.value || 'es'

        // Obtener el día de la semana
        day.value = now.toLocaleDateString(localeString, { weekday: 'long' })

        // Obtener el día del mes
        date.value = now.getDate()

        // Obtener el mes
        month.value = now.toLocaleDateString(localeString, { month: 'long' })

        // Obtener la hora
        hour.value = now.toLocaleTimeString(localeString, {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Actualizar cada segundo
    actualDate()
    setInterval(actualDate, 1000)

    return {
        day,
        date,
        month,
        hour
    }
}
