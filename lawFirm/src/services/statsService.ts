import { apiClient } from '../api/apiClient';

export interface Stat {
    id: number;
    number: number;
    hasPlus: boolean;
    label_en: string;
    label_ru: string;
}

export interface StatPublic {
    id: number;
    number: number;
    hasPlus: boolean;
    label: string;
}

export const fetchPublicStats = (lang: string): Promise<StatPublic[]> =>
    apiClient.get(`/stats/public?lang=${lang}`, false);

export const fetchStats = async (): Promise<Stat[]> => {
    const response = await apiClient.get('/stats', true) as any;
    return response?.items || (Array.isArray(response) ? response : []);
};

export const createStat = (data: Omit<Stat, 'id'>): Promise<Stat> =>
    apiClient.post('/stats', data, true);

export const updateStat = (id: number, data: Partial<Stat>): Promise<Stat> =>
    apiClient.patch(`/stats/${id}`, data, true);

export const deleteStat = (id: number): Promise<void> =>
    apiClient.delete(`/stats/${id}`, true);