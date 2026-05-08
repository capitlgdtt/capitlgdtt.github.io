import { apiClient } from '../api/apiClient';

export interface Admin {
    id: number;
    username: string;
    email: string;
    role: 'superadmin' | 'admin' | 'editor';
    createdAt: string;
    lastLogin: string;
    isActive: boolean;
}

export interface AdminStats {
    total: number;
    active: number;
    superadmins: number;
    admins: number;
    editors: number;
}


export const login = async (username: string, password: string): Promise<{ access_token: string; user: Omit<Admin, 'passwordHash' | 'createdAt' | 'lastLogin' | 'isActive'> }> => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid credentials');
    }
    const json = await response.json();
    return json.data ? json.data : json;
};

export const fetchAdmins = async (): Promise<Admin[]> => {
    const response = await apiClient.get('/admins', true) as any;
    return response?.items || [];
};

export const fetchAdminsStats = async (): Promise<AdminStats> => {
    const response = await apiClient.get('/admins/stats', true) as any;
    return response?.data || response || { total: 0, active: 0, superadmins: 0, admins: 0, editors: 0 };
};

export const createAdmin = (data: { username: string; email: string; password: string; role: string }): Promise<Admin> =>
    apiClient.post('/admins', data, true);

export const updateAdmin = (id: number, data: Partial<Admin>): Promise<Admin> =>
    apiClient.patch(`/admins/${id}`, data, true);

export const updateAdminStatus = (id: number, isActive: boolean): Promise<Admin> =>
    apiClient.patch(`/admins/${id}/status`, { isActive }, true);

export const deleteAdmin = (id: number): Promise<void> =>
    apiClient.delete(`/admins/${id}`, true);

export const fetchAdminById = (id: number): Promise<Admin> =>
    apiClient.get(`/admins/${id}`, true);