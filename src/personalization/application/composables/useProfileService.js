/**
}
    };
        clearMessages
        changePassword,
        updateProfile,
        loadUserProfile,
        success: computed(() => success.value),
        error: computed(() => error.value),
        isLoading: computed(() => isLoading.value),
        userProfile: computed(() => userProfile.value),
    return {

    }
        success.value = null;
        error.value = null;
    function clearMessages() {
     */
     * Limpia los mensajes de error y éxito
    /**

    }
        }
            isLoading.value = false;
        } finally {
            console.error('Error changing password:', err);
            error.value = err.response?.data?.message || err.message || 'Error al cambiar la contraseña';
        } catch (err) {
            success.value = 'Contraseña cambiada correctamente';
            await ProfileApi.changePassword(userId, currentPassword, newPassword);

            success.value = null;
            error.value = null;
            isLoading.value = true;
        try {

        }
            return;
            error.value = validation.errors;
        if (!validation.isValid) {
        const validation = ProfileDomainService.validatePasswordStrength(newPassword);
        // Validar fortaleza de contraseña

        }
            return;
            error.value = 'Las contraseñas no coinciden';
        if (newPassword !== confirmPassword) {
        // Validar que las contraseñas coincidan

        }
            return;
            error.value = 'Usuario no identificado';
        if (!userId) {
        const userId = getCurrentUserId();
    async function changePassword(currentPassword, newPassword, confirmPassword) {
     */
     * @param {string} confirmPassword - Confirmación de nueva contraseña
     * @param {string} newPassword - Nueva contraseña
     * @param {string} currentPassword - Contraseña actual
     * Cambia la contraseña del usuario
    /**

    }
        }
            isLoading.value = false;
        } finally {
            console.error('Error updating profile:', err);
            error.value = err.response?.data?.message || err.message || 'Error al actualizar el perfil';
        } catch (err) {
            success.value = 'Perfil actualizado correctamente';

            localStorage.setItem('energix-user', JSON.stringify(updatedUser));
            };
                district: updatedProfile.district
                dni: updatedProfile.dni,
                email: updatedProfile.email,
                lastName: updatedProfile.lastName,
                firstName: updatedProfile.firstName,
                ...storedUser,
            const updatedUser = {
            const storedUser = JSON.parse(localStorage.getItem('energix-user'));
            // Actualizar datos del usuario en localStorage si es necesario

            userProfile.value = UserProfile.fromJson(updatedProfile);
            const updatedProfile = await ProfileApi.updateUserProfile(userId, profileData);

            success.value = null;
            error.value = null;
            isLoading.value = true;
        try {

        }
            return;
            error.value = validation.errors;
        if (!validation.isValid) {
        const validation = ProfileDomainService.validateProfileData(profileData);
        // Validar datos

        }
            return;
            error.value = 'Usuario no identificado';
        if (!userId) {
        const userId = getCurrentUserId();
    async function updateProfile(profileData) {
     */
     * @param {object} profileData - Datos a actualizar
     * Actualiza el perfil del usuario
    /**

    }
        }
            isLoading.value = false;
        } finally {
            console.error('Error loading profile:', err);
            error.value = err.message || 'Error al cargar el perfil';
        } catch (err) {
            userProfile.value = UserProfile.fromJson(profileData);
            const profileData = await ProfileApi.getUserProfile(userId);
            error.value = null;
            isLoading.value = true;
        try {

        }
            return;
            error.value = 'Usuario no identificado';
        if (!userId) {
        const userId = getCurrentUserId();
    async function loadUserProfile() {
     */
     * Carga el perfil del usuario actual
    /**

    }
        }
            return null;
        } catch {
            return user?.id || null;
            const user = JSON.parse(localStorage.getItem('energix-user'));
        try {
    function getCurrentUserId() {
     */
     * @returns {number|null}
     * Obtiene el ID del usuario del localStorage
    /**

    const success = ref(null);
    const error = ref(null);
    const isLoading = ref(false);
    const userProfile = ref(null);
export function useProfileService() {

import { UserProfile } from '../domain/profile.entity.js';
import { ProfileDomainService } from '../domain/profile.service.js';
import { ProfileApi } from '../infrastructure/profile.endpoint.js';
import { ref, computed } from 'vue';
 */
 * Profile Application Service - Composable para manejar operaciones de perfil

