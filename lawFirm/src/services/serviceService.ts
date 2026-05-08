import { apiClient } from '../api/apiClient';

export interface Service {
    id: number;
    translations: {
        en: { title: string; description: string; details: string[] };
        ru: { title: string; description: string; details: string[] };
    };
    image: string;
}

export const fetchServices = async (): Promise<Service[]> => {
    const response = await apiClient.get('/services', true) as any;
    return response?.items || (Array.isArray(response) ? response : []);
};

export const fetchPublicServices = (lang: string): Promise<any[]> =>
    apiClient.get(`/services/public?lang=${lang}`, false);

export const createService = (data: Omit<Service, 'id'>): Promise<Service> =>
    apiClient.post('/services', data, true);

export const updateService = (id: number, data: Partial<Service>): Promise<Service> =>
    apiClient.patch(`/services/${id}`, data, true);

export const deleteService = (id: number): Promise<void> =>
    apiClient.delete(`/services/${id}`, true);

export const fetchServiceById = (id: number): Promise<Service> =>
    apiClient.get(`/services/${id}`, true);