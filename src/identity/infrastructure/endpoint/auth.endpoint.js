import { http } from '../../../shared/infrastructure/base-api.js';

const AUTH = (import.meta.env.VITE_AUTH_ENDPOINT_PATH || '/authentication').replace(/\/+$/, '');
const USERS = (import.meta.env.VITE_USERS_ENDPOINT_PATH || '/users').replace(/\/+$/, '');

export const AuthApi = {
    async register({ name, lastName, email, password, dni, district }) {
        const dup = await http.get(`${USERS}?email=${encodeURIComponent(email)}`);
        if (dup.length) throw { message: 'Ya existe un usuario con este correo' };

        const user = await http.post(USERS, {
            name,
            lastName,
            email,
            password,
            dni,
            district,
            plan: 'basic' // Plan por defecto para todos los usuarios
        });

        return { user, token: 'dev-token' };
    },

    async login({ email, password }) {
        return await http.post(`${AUTH}/sign-in`, { email, password });
    }
};
