import { apiClient } from '../api/apiClient';

export interface Application {
    id: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    createdAt: string;
    status: 'new' | 'in-progress' | 'completed';
}

export const fetchApplications = (params?: {
    status?: string;
    service?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: string;
}) => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.service && params.service !== 'all') query.append('service', params.service);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.order) query.append('order', params.order);
    const url = `/applications${query.toString() ? '?' + query.toString() : ''}`;
    return apiClient.get<{ items: Application[]; total: number }>(url, true);
};

export const createApplication = (
    data: Omit<Application, 'id' | 'createdAt' | 'status'>
): Promise<Application> => {
    return apiClient.post('/applications', data, false);
};

export const updateApplicationStatus = (id: number, status: Application['status']): Promise<Application> =>
    apiClient.patch(`/applications/${id}/status`, { status }, true);

export const deleteApplication = (id: number): Promise<void> =>
    apiClient.delete(`/applications/${id}`, true);

export const fetchApplicationsStats = () =>
    apiClient.get<{ total: number; new: number; inProgress: number; completed: number }>('/applications/stats', true);