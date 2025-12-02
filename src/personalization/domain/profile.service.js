/**
 * Profile Domain Service - Contiene la lógica de negocio para validaciones de perfil
 */

export class ProfileDomainService {
    /**
     * Valida la fortaleza de una contraseña
     * @param {string} password - Contraseña a validar
     * @returns {object} { isValid: boolean, errors: string[] }
     */
    static validatePasswordStrength(password) {
        const errors = [];

        if (!password) {
            errors.push('La contraseña es requerida');
            return { isValid: false, errors };
        }

        if (password.length < 8) {
            errors.push('La contraseña debe tener al menos 8 caracteres');
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('La contraseña debe contener al menos una letra mayúscula');
        }

        if (!/[a-z]/.test(password)) {
            errors.push('La contraseña debe contener al menos una letra minúscula');
        }

        if (!/\d/.test(password)) {
            errors.push('La contraseña debe contener al menos un número');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Valida si el email tiene formato válido
     * @param {string} email - Email a validar
     * @returns {boolean}
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valida los datos del perfil
     * @param {object} profileData - Datos del perfil
     * @returns {object} { isValid: boolean, errors: object }
     */
    static validateProfileData(profileData) {
        const errors = {};

        if (profileData.firstName && profileData.firstName.trim().length === 0) {
            errors.firstName = 'El nombre no puede estar vacío';
        }

        if (profileData.firstName && profileData.firstName.length > 100) {
            errors.firstName = 'El nombre no debe exceder 100 caracteres';
        }

        if (profileData.lastName && profileData.lastName.trim().length === 0) {
            errors.lastName = 'El apellido no puede estar vacío';
        }

        if (profileData.lastName && profileData.lastName.length > 100) {
            errors.lastName = 'El apellido no debe exceder 100 caracteres';
        }

        if (profileData.email && !this.isValidEmail(profileData.email)) {
            errors.email = 'Email inválido';
        }

        if (profileData.email && profileData.email.length > 255) {
            errors.email = 'El email no debe exceder 255 caracteres';
        }

        if (profileData.dni && profileData.dni.length > 20) {
            errors.dni = 'El DNI no debe exceder 20 caracteres';
        }

        if (profileData.district && profileData.district.length > 100) {
            errors.district = 'El distrito no debe exceder 100 caracteres';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

