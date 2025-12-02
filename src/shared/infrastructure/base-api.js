// shared/infrastructure/base-api.js
const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

function getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };

    // Usar el token de usuario normal como token principal
    const userToken = localStorage.getItem('token');
    if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
    }

    return headers;
}

async function parseJsonSafely(res) {
    // Algunas rutas (DELETE en json-server) devuelven 200/204 sin cuerpo.
    const text = await res.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch { return null; }
}

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

export const http = {
    async get(url) {
        const res = await fetch(BASE + url, {
            headers: getAuthHeaders()
        });
        if (!res.ok) return handleError(res);
        return await res.json();
    },

    async post(url, body) {
        const res = await fetch(BASE + url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });
        if (!res.ok) return handleError(res);
        return await res.json();
    },

    async put(url, body) {
        const res = await fetch(BASE + url, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });
        if (!res.ok) return handleError(res);
        return await res.json();
    },

    async patch(url, body) {
        const res = await fetch(BASE + url, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });
        if (!res.ok) return handleError(res);
        return await res.json();
    },

    // ✅ TOLERA respuestas sin cuerpo (200/204) → no rompe la UI
    async delete(url) {
        const res = await fetch(BASE + url, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!res.ok) return handleError(res);
        // Si no hay JSON, devolvemos true para indicar éxito
        const json = await parseJsonSafely(res);
        return json ?? true;
    },
};
