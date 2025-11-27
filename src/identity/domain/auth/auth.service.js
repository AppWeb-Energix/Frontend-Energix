import { AuthApi } from '@/identity/infrastructure/endpoint/auth.endpoint.js';

export function setAuthenticated(v = true){ localStorage.setItem('isAuthenticated', String(v)); }
export function isAuthenticated(){ return localStorage.getItem('isAuthenticated') === 'true'; }

export async function registerService(payload){
    // Desestructurar el contrato del backend real: { token, user, plan }
    const { token, user, plan } = await AuthApi.register(payload);

    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('energix-user', JSON.stringify(user));
    localStorage.setItem('energix-plan', plan?.uiKey || 'basic');
    setAuthenticated(true);

    return user;
}

export async function loginService({ email, password }){
    // Desestructurar el contrato del backend real: { token, user, plan }
    const { token, user, plan } = await AuthApi.login({ email, password });

    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('energix-user', JSON.stringify(user));
    localStorage.setItem('energix-plan', plan?.uiKey || 'basic');
    setAuthenticated(true);

    return user;
}

export function logoutService(){
    ['token','energix-user','energix-plan'].forEach(k => localStorage.removeItem(k));
    setAuthenticated(false);
}
