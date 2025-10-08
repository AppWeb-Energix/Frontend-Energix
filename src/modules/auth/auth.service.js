import { AuthApi } from '@/shared/infrastructure/endpoints/auth.endpoint';
import { AlertsApi } from '@/shared/infrastructure/endpoints/alerts.endpoint';

export function setAuthenticated(v = true){ localStorage.setItem('isAuthenticated', String(v)); }
export function isAuthenticated(){ return localStorage.getItem('isAuthenticated') === 'true'; }

export async function validateCodeService(code){
    return AuthApi.validateCode(code);
}

export async function registerService(payload){
    const { user, token } = await AuthApi.register(payload);
    localStorage.setItem('token', token || 'dev-token');
    localStorage.setItem('energix-user', JSON.stringify(user));
    localStorage.setItem('energix-plan', user.plan);
    setAuthenticated(true);

    // 🔥 CREAR ALERTA DE BIENVENIDA AUTOMÁTICAMENTE
    await AlertsApi.create({
        userId: user.id,
        type: 'info',
        badge: 'Bienvenida',
        message: '¡Registro completado exitosamente!',
        details: `Bienvenid@ ${user.name}! Tu plan es: ${user.plan.toUpperCase()}. Comienza a monitorear tu consumo energético.`,
        timestamp: new Date().toISOString(),
        isRead: false
    });

    return user;
}

export async function loginService({ email }){
    const { user, token } = await AuthApi.login({ email });
    localStorage.setItem('token', token || 'dev-token');
    localStorage.setItem('energix-user', JSON.stringify(user));
    localStorage.setItem('energix-plan', user.plan);
    setAuthenticated(true);

    // 🔥 CREAR ALERTA DE LOGIN AUTOMÁTICAMENTE
    await AlertsApi.create({
        userId: user.id,
        type: 'info',
        badge: 'Info',
        message: 'Sesión iniciada',
        details: `¡Bienvenid@ de vuelta, ${user.name}!`,
        timestamp: new Date().toISOString(),
        isRead: false
    });

    return user;
}

export function logoutService(){
    ['token','energix-user','energix-plan'].forEach(k => localStorage.removeItem(k));
    setAuthenticated(false);
}