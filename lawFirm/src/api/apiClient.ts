const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
    private isRefreshing = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    private getHeaders(includeAuth: boolean = true): HeadersInit {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (includeAuth) {
            const token = localStorage.getItem('access_token');
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    private async handleResponse<T>(response: Response, originalRequest: () => Promise<Response>): Promise<T> {
        if (response.status === 401) {
            if (this.isRefreshing) {
                return new Promise((resolve, reject) => {
                    this.refreshSubscribers.push((newToken) => {
                        localStorage.setItem('access_token', newToken);
                        originalRequest()
                            .then(res => this.handleResponse<T>(res, originalRequest))
                            .then(resolve)
                            .catch(reject);
                    });
                });
            }

            this.isRefreshing = true;
            try {
                const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                });
                if (!refreshRes.ok) throw new Error('Refresh failed');
                const data = await refreshRes.json();
                const access_token = data.access_token || (data.data && data.data.access_token);
                if (!access_token) throw new Error('No access token');
                localStorage.setItem('access_token', access_token);
                this.refreshSubscribers.forEach(cb => cb(access_token));
                this.refreshSubscribers = [];
                const retryRes = await originalRequest();
                return this.handleResponse<T>(retryRes, originalRequest);
            } catch (error) {
                localStorage.removeItem('access_token');
                window.location.href = '/admin/login';
                throw error;
            } finally {
                this.isRefreshing = false;
            }
        }

        if (!response.ok) {
            let msg = `HTTP ${response.status}`;
            try {
                const err = await response.json();
                msg = err.message || msg;
            } catch {}
            throw new Error(msg);
        }

        const json = await response.json();
        if (json && typeof json === 'object' && 'data' in json) {
            return json.data;
        }
        return json;
    }

    private async request<T>(url: string, options: RequestInit, includeAuth: boolean): Promise<T> {
        const requestFn = () => fetch(`${API_BASE}${url}`, {
            ...options,
            headers: this.getHeaders(includeAuth),
            credentials: 'include',
        });
        const response = await requestFn();
        return this.handleResponse<T>(response, requestFn);
    }

    async get<T>(url: string, includeAuth: boolean = true): Promise<T> {
        return this.request<T>(url, { method: 'GET' }, includeAuth);
    }

    async post<T>(url: string, body: any, includeAuth: boolean = true): Promise<T> {
        return this.request<T>(url, { method: 'POST', body: JSON.stringify(body) }, includeAuth);
    }

    async patch<T>(url: string, body: any, includeAuth: boolean = true): Promise<T> {
        return this.request<T>(url, { method: 'PATCH', body: JSON.stringify(body) }, includeAuth);
    }

    async delete<T>(url: string, includeAuth: boolean = true): Promise<T> {
        return this.request<T>(url, { method: 'DELETE' }, includeAuth);
    }

    async uploadFile(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE}/upload/image`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            credentials: 'include',
            body: formData,
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Upload failed');
        }
        const json = await response.json();
        const url = json.url || (json.data && json.data.url);
        if (!url) throw new Error('No url in response');
        return { url };
    }
}

export const apiClient = new ApiClient();