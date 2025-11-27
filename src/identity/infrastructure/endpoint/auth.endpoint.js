import { http } from '../../../shared/infrastructure/base-api.js';

const SESSION = '/session';

export const AuthApi = {
    async register({ name, lastName, email, password, dni, district }) {
        // Transformar payload del frontend al DTO que espera el backend
        const signUpRequest = {
            FirstName: name,
            LastName: lastName,
            Email: email,
            Password: password,
            Dni: dni,
            District: district
        };

        // Llamar a POST /session/sign-up
        // La respuesta del backend es { token, user, plan }
        const response = await http.post(`${SESSION}/sign-up`, signUpRequest);

        // Devolver exactamente lo que el backend retorna
        return response;
    },

    async login({ email, password }) {
        // Llamar a POST /session/sign-in
        // La respuesta del backend es { token, user, plan }
        const response = await http.post(`${SESSION}/sign-in`, { email, password });

        // Devolver exactamente lo que el backend retorna
        return response;
    }
};
