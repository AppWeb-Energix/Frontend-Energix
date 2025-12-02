/**
 * Profile Application Service - Composable para manejar operaciones de perfil
 */
import { ref, computed } from 'vue';
import { ProfileApi } from '../infrastructure/profile.endpoint.js';
import { ProfileDomainService } from '../domain/profile.service.js';
import { UserProfile } from '../domain/profile.entity.js';

export function useProfileService() {
    const userProfile = ref(null);
    const isLoading = ref(false);
    const error = ref(null);
    const success = ref(null);

    /**
     * Obtiene el ID del usuario del localStorage
     * @returns {number|null}
     */
    function getCurrentUserId() {
        try {
            const user = JSON.parse(localStorage.getItem('energix-user'));
            return user?.id || null;
        } catch {
            return null;
        }
    }

    /**
     * Carga el perfil del usuario actual
     */
    async function loadUserProfile() {
        const userId = getCurrentUserId();
        if (!userId) {
            error.value = 'Usuario no identificado';
            return;
        }

        try {
            isLoading.value = true;
            error.value = null;
            const profileData = await ProfileApi.getUserProfile(userId);
            userProfile.value = UserProfile.fromJson(profileData);
        } catch (err) {
            error.value = err.message || 'Error al cargar el perfil';
            console.error('Error loading profile:', err);
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Actualiza el perfil del usuario
     * @param {object} profileData - Datos a actualizar
     */
    async function updateProfile(profileData) {
        const userId = getCurrentUserId();
        if (!userId) {
            error.value = 'Usuario no identificado';
            return;
        }

        // Validar datos
        const validation = ProfileDomainService.validateProfileData(profileData);
        if (!validation.isValid) {
            error.value = validation.errors;
            return;
        }

        try {
            isLoading.value = true;
            error.value = null;
            success.value = null;

            const updatedProfile = await ProfileApi.updateUserProfile(userId, profileData);
            userProfile.value = UserProfile.fromJson(updatedProfile);

            // Actualizar datos del usuario en localStorage si es necesario
            const storedUser = JSON.parse(localStorage.getItem('energix-user'));
            const updatedUser = {
                ...storedUser,
                firstName: updatedProfile.firstName,
                lastName: updatedProfile.lastName,
                email: updatedProfile.email,
                dni: updatedProfile.dni,
                district: updatedProfile.district
            };
            localStorage.setItem('energix-user', JSON.stringify(updatedUser));

            success.value = 'Perfil actualizado correctamente';
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'Error al actualizar el perfil';
            console.error('Error updating profile:', err);
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Cambia la contraseña del usuario
     * @param {string} currentPassword - Contraseña actual
     * @param {string} newPassword - Nueva contraseña
     * @param {string} confirmPassword - Confirmación de nueva contraseña
     */
    async function changePassword(currentPassword, newPassword, confirmPassword) {
        const userId = getCurrentUserId();
        if (!userId) {
            error.value = 'Usuario no identificado';
            return;
        }

        // Validar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            error.value = 'Las contraseñas no coinciden';
            return;
        }

        // Validar fortaleza de contraseña
        const validation = ProfileDomainService.validatePasswordStrength(newPassword);
        if (!validation.isValid) {
            error.value = validation.errors;
            return;
        }

        try {
            isLoading.value = true;
            error.value = null;
            success.value = null;

            await ProfileApi.changePassword(userId, currentPassword, newPassword);
            success.value = 'Contraseña cambiada correctamente';
        } catch (err) {
            error.value = err.response?.data?.message || err.message || 'Error al cambiar la contraseña';
            console.error('Error changing password:', err);
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Limpia los mensajes de error y éxito
     */
    function clearMessages() {
        error.value = null;
        success.value = null;
    }

    return {
        userProfile: computed(() => userProfile.value),
        isLoading: computed(() => isLoading.value),
        error: computed(() => error.value),
        success: computed(() => success.value),
        loadUserProfile,
        updateProfile,
        changePassword,
        clearMessages
    };
}

