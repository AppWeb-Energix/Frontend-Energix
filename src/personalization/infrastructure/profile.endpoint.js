/**
 * Profile API Endpoint - Contiene las llamadas HTTP al backend
 */
import { http } from '../../shared/infrastructure/base-api.js';

// Usar VITE_PROFILE_ENDPOINT_PATH que apunta a /Profile
const PROFILE_BASE_URL = import.meta.env.VITE_PROFILE_ENDPOINT_PATH || '/Profile';

export const ProfileApi = {
    /**
     * Obtiene el perfil del usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<object>} Información del perfil
     */
    async getUserProfile(userId) {
        try {
            const response = await http.get(`${PROFILE_BASE_URL}/${userId}`);
            return response;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },

    /**
     * Actualiza el perfil del usuario
     * @param {number} userId - ID del usuario
     * @param {object} profileData - Datos del perfil a actualizar
     * @returns {Promise<object>} Perfil actualizado
     */
    async updateUserProfile(userId, profileData) {
        try {
            const response = await http.patch(`${PROFILE_BASE_URL}/${userId}`, profileData);
            return response;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },

    /**
     * Cambia la contraseña del usuario
     * @param {number} userId - ID del usuario
     * @param {string} currentPassword - Contraseña actual
     * @param {string} newPassword - Nueva contraseña
     * @returns {Promise<object>} Respuesta del servidor
     */
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const response = await http.patch(
                `${PROFILE_BASE_URL}/${userId}/password`,
                {
                    currentPassword,
                    newPassword
                }
            );
            return response;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }
};

