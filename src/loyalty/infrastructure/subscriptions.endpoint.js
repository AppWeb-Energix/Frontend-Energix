// loyalty/infrastructure/subscriptions.endpoint.js
const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

/**
 * Obtiene el token de autenticación del localStorage
 * @returns {string|null}
 */
function getAuthToken() {
    return localStorage.getItem('token');
}

/**
 * Maneja errores de la respuesta HTTP
 * @param {Response} res 
 */
async function handleError(res) {
    let message = res.statusText || 'Error de red';
    try {
        const txt = await res.text();
        if (txt) {
            const json = JSON.parse(txt);
            message = json?.message || message;
        }
    } catch { /* ignore */ }
    const err = new Error(message);
    err.status = res.status;
    throw err;
}

/**
 * API de Suscripciones
 */
export const SubscriptionsApi = {
    /**
     * Crea o actualiza la suscripción del usuario
     * @param {Object} payload
     * @param {number} payload.planType - 0=Basic, 1=Student, 2=FamilyPremium
     * @param {number} payload.billingPeriod - 11=Monthly, 1=Yearly
     * @param {string} [payload.cardNumber] - Requerido si planType > 0
     * @param {string} [payload.expiryMonth] - Requerido si planType > 0
     * @param {string} [payload.expiryYear] - 4 dígitos, requerido si planType > 0
     * @param {string} [payload.cvv] - Requerido si planType > 0
     * @returns {Promise<{token: string, plan: Object, planSelectionPending: boolean, message: string}>}
     */
    async upgrade(payload) {
        const token = getAuthToken();
        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const res = await fetch(`${BASE}/subscriptions/upgrade`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            return handleError(res);
        }

        return await res.json();
    },

    /**
     * Obtiene la suscripción actual del usuario
     * @param {number} userId 
     * @returns {Promise<Object>}
     */
    async getByUserId(userId) {
        const token = getAuthToken();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const res = await fetch(`${BASE}/subscriptions/user/${userId}`, {
            method: 'GET',
            headers
        });

        if (!res.ok) {
            return handleError(res);
        }

        return await res.json();
    },

    /**
     * Cancela la suscripción actual
     * @param {number} subscriptionId 
     * @returns {Promise<Object>}
     */
    async cancel(subscriptionId) {
        const token = getAuthToken();
        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const res = await fetch(`${BASE}/subscriptions/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ subscriptionId })
        });

        if (!res.ok) {
            return handleError(res);
        }

        return await res.json();
    },

    /**
     * Renueva la suscripción actual
     * @param {number} subscriptionId 
     * @returns {Promise<Object>}
     */
    async renew(subscriptionId) {
        const token = getAuthToken();
        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const res = await fetch(`${BASE}/subscriptions/renew`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ subscriptionId })
        });

        if (!res.ok) {
            return handleError(res);
        }

        return await res.json();
    }
};

/**
 * Constantes de tipos de plan
 */
export const PlanType = {
    Basic: 0,
    Student: 1,
    FamilyPremium: 2
};

/**
 * Constantes de período de facturación
 */
export const BillingPeriod = {
    Monthly: 11,
    Yearly: 1
};
