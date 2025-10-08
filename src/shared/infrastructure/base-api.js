const BASE_URL = (import.meta.env.VITE_ENERGIX_API_URL || 'http://localhost:3001/api/v1').replace(/\/+$/, '');

class Http {
    constructor(baseUrl){ this.baseUrl = baseUrl; }

    async request(path, opts = {}) {
        const url = `${this.baseUrl}${path}`;
        const headers = new Headers({ 'Content-Type':'application/json', ...(opts.headers||{}) });

        try {
            const res = await fetch(url, { ...opts, headers });
            const isJson = (res.headers.get('content-type') || '').includes('application/json');
            const data = isJson ? await res.json().catch(() => ({})) : await res.text();

            if (!res.ok) {
                const message = (isJson ? data?.error || data?.message : data) || 'HTTP error';
                throw { status: res.status, message, url };
            }
            return data;
        } catch (err) {
            console.error('HTTP NETWORK ERROR →', { url, err });
            throw { network: true, message: 'No se pudo conectar a la API', url, cause: err };
        }
    }

    get(p){ return this.request(p, { method:'GET' }); }
    post(p,b){ return this.request(p, { method:'POST', body: JSON.stringify(b) }); }
    patch(p,b){ return this.request(p, { method:'PATCH', body: JSON.stringify(b) }); }
    delete(p){ return this.request(p, { method:'DELETE' }); }
}

export const http = new Http(BASE_URL);
