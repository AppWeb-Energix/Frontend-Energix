import { http } from '../base-api';

const USERS = (import.meta.env.VITE_USERS_ENDPOINT_PATH || '/users').replace(/\/+$/, '');
const CODES = (import.meta.env.VITE_CODES_ENDPOINT_PATH || '/codes').replace(/\/+$/, '');
const CODES_CHECK = (import.meta.env.VITE_CODES_CHECK_PATH || '/codes').replace(/\/+$/, '');

// Función auxiliar: Devuelve el objeto de código (entry) o lanza un error
async function checkCode(code) {
    // Si no hay código, lo tratamos como plan 'basic' pero no lanzamos error en el check
    if (!code) return { plan: 'basic', entry: null };

    // Asumiendo que http.get apunta a http://localhost:8001/codes
    const list = await http.get(`${CODES_CHECK}?code=${encodeURIComponent(code)}`);
    const entry = Array.isArray(list) && list[0] ? list[0] : null;

    if (!entry) throw { message: 'Código inválido' };
    if (entry.used) throw { message: 'Este código ya fue usado' };

    // Aquí definimos el plan basado en el 'kind' para el registro (no es necesario para la validación del frontend)
    const plan = entry.kind === 'plug' ? 'student' : entry.kind === 'sensor' ? 'family' : 'basic';

    // 💡 CAMBIO CRÍTICO: Devolvemos el objeto completo que incluye 'kind'
    return { plan, entry };
}

export const AuthApi = {
    async validateCode(code) {
        // 💡 CAMBIO CLAVE: Devolvemos la propiedad 'entry' que contiene el 'kind'
        const { entry } = await checkCode(code);
        return entry; // Esto retorna el objeto: { id: 1, code: "STU-11111", kind: "plug", used: false }
    },

    async register({ name, lastName, email, password, dni, district, code }) {
        const { plan, entry } = await checkCode(code);
        const dup = await http.get(`${USERS}?email=${encodeURIComponent(email)}`);
        if (dup.length) throw { message: 'Ya existe un usuario con este correo' };

        const user = await http.post(USERS, { name, lastName, email, password, dni, district, plan });
        if (entry) await http.patch(`${CODES}/${entry.id}`, { used: true });

        return { user, token: 'dev-token' };
    },

    async login({ email }) {
        const list = await http.get(`${USERS}?email=${encodeURIComponent(email)}`);
        if (!list.length) throw { message: 'Usuario no encontrado. Regístrate primero.' };
        return { user: list[0], token: 'dev-token' };
    }
};