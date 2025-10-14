import { ref, onMounted, onBeforeUnmount } from "vue";

export function useDateTime() {
    const day = ref('');
    const date = ref('');
    const month = ref('');
    const hour = ref('');
    let timer;

    function actualDate() {
        const now = new Date();
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        day.value = dias[now.getDay()];
        date.value = now.getDate();
        month.value = meses[now.getMonth()];

        let h = now.getHours();
        let m = now.getMinutes();
        let sufijo = h >= 12 ? 'p. m.' : 'a. m.';
        h = h % 12 || 12;
        hour.value = `${h}:${String(m).padStart(2, '0')} ${sufijo}`;
    }

    onMounted(() => {
        actualDate();
        timer = setInterval(actualDate, 5000);
    });

    onBeforeUnmount(() => clearInterval(timer));

    return { day, date, month, hour };
}
