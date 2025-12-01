import { AuthApi } from '@/identity/infrastructure/endpoint/auth.endpoint.js';

export function setAuthenticated(v = true){ localStorage.setItem('isAuthenticated', String(v)); }
export function isAuthenticated(){ return localStorage.getItem('isAuthenticated') === 'true'; }

// --- Funciones para manejar planSelectionPending ---
export function setPlanSelectionPending(v = true) {
    localStorage.setItem('planSelectionPending', String(v));
}

export function isPlanSelectionPending() {
    return localStorage.getItem('planSelectionPending') === 'true';
}

/**
 * Actualiza el token y plan después de un upgrade de suscripción
 * @param {string} token - Nuevo token JWT con claims de plan
 * @param {Object} plan - Objeto con info del plan { uiKey, displayName, type, billingPeriod }
 */
export function updateTokenAndPlan(token, plan) {
    if (token) {
        localStorage.setItem('token', token);
    }
    if (plan) {
        localStorage.setItem('energix-plan', plan.uiKey || plan.displayName?.toLowerCase() || 'basic');
    }
    setPlanSelectionPending(false);
}

export async function registerService(payload){
    // Desestructurar el contrato del backend real: { token, user, plan, planSelectionPending }
    const { token, user, plan, planSelectionPending } = await AuthApi.register(payload);

    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('energix-user', JSON.stringify(user));
    localStorage.setItem('energix-plan', plan?.uiKey || 'basic');
    setPlanSelectionPending(planSelectionPending ?? true); // Por defecto pending después del registro
    setAuthenticated(true);

    return { user, planSelectionPending: planSelectionPending ?? true };
}

export async function loginService({ email, password }){
    // Desestructurar el contrato del backend real: { token, user, plan, planSelectionPending }
    const { token, user, plan, planSelectionPending } = await AuthApi.login({ email, password });

    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('energix-user', JSON.stringify(user));
    localStorage.setItem('energix-plan', plan?.uiKey || 'basic');
    setPlanSelectionPending(planSelectionPending ?? false);
    setAuthenticated(true);

    return { user, planSelectionPending: planSelectionPending ?? false };
}

export function logoutService(){
    ['token','energix-user','energix-plan','planSelectionPending'].forEach(k => localStorage.removeItem(k));
    setAuthenticated(false);
}
