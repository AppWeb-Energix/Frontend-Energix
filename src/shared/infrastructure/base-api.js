// shared/infrastructure/base-api.js
const BASE = import.meta.env.VITE_API_BASE_URL;

// ✅ Función para obtener el token del localStorage/sessionStorage
function getAuthHeaders() {
    const token = localStorage.getItem('token'); // o sessionStorage
    if (token) {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // ← JWT aquí
        };
    }
    return { 'Content-Type': 'application/json' };
}

async function parseJsonSafely(res) {
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
            headers: getAuthHeaders() // ✅ Incluye JWT
        });
        if (!res.ok) return handleError(res);
        return await res.json();
    },

    async post(url, body) {
        const res = await fetch(BASE + url, {
            method: 'POST',
            headers: getAuthHeaders(), // ✅ Incluye JWT
            body: JSON.stringify(body),
        });
        if (!res.ok) return handleError(res);
        return await res.json();
    },

    async put(url, body) {
        const res = await fetch(BASE + url, {
            method: 'PUT',
            headers: getAuthHeaders(), // ✅ Incluye JWT
            body: JSON.stringify(body),
        });
        if (!res.ok) return handleError(res);
        return await res.json();
    },

    async patch(url, body) {
        const res = await fetch(BASE + url, {
            method: 'PATCH',
            headers: getAuthHeaders(), // ✅ Incluye JWT
            body: JSON.stringify(body),
        });
        if (!res.ok) return handleError(res);
        return await res.json();
    },

    async delete(url) {
        const res = await fetch(BASE + url, {
            method: 'DELETE',
            headers: getAuthHeaders() // ✅ Incluye JWT
        });
        if (!res.ok) return handleError(res);
        const json = await parseJsonSafely(res);
        return json ?? true;
    },
};
