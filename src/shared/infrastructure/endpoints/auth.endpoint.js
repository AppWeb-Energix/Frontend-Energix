import { http } from '../base-api';

const USERS = (import.meta.env.VITE_USERS_ENDPOINT_PATH || '/users').replace(/\/+$/, '');
const CODES = (import.meta.env.VITE_CODES_ENDPOINT_PATH || '/codes').replace(/\/+$/, '');
const CODES_CHECK = (import.meta.env.VITE_CODES_CHECK_PATH || '/codes').replace(/\/+$/, '');async function checkCode(code) {
    if (!code) return { plan: 'basic', entry: null };
    // Cambiar esta línea:
    const list = await http.get(`${CODES_CHECK}?code=${encodeURIComponent(code)}`);
    const entry = Array.isArray(list) && list[0] ? list[0] : null;
    if (!entry) throw { message: 'Código inválido' };
    if (entry.used) throw { message: 'Este código ya fue usado' };
    const plan = entry.kind === 'plug' ? 'student' : entry.kind === 'sensor' ? 'family' : 'basic';
    return { plan, entry };
}

export const AuthApi = {
    async validateCode(code) {
        await checkCode(code);
        return { ok: true };
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
