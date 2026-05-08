import { apiClient } from '../api/apiClient';

export interface Service {
    id: number;
    title_en: string;
    title_ru: string;
    description_en: string;
    description_ru: string;
    details_en: string[];
    details_ru: string[];
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