import { apiClient } from '../api/apiClient';

export interface TeamMember {
    id: number;
    name_en: string;
    name_ru: string;
    role_en: string;
    role_ru: string;
    description_en: string;
    description_ru: string;
    image: string;
    email: string;
    phone: string;
    experience: string;
    specialization: string[];
}

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
    const response = await apiClient.get('/team-members', true) as any;
    return response?.items || (Array.isArray(response) ? response : []);
};

export const fetchPublicTeamMembers = (lang: string): Promise<any[]> =>
    apiClient.get(`/team-members/public?lang=${lang}`, false);

export const createTeamMember = (data: Omit<TeamMember, 'id'>): Promise<TeamMember> =>
    apiClient.post('/team-members', data, true);

export const updateTeamMember = (id: number, data: Partial<TeamMember>): Promise<TeamMember> =>
    apiClient.patch(`/team-members/${id}`, data, true);

export const deleteTeamMember = (id: number): Promise<void> =>
    apiClient.delete(`/team-members/${id}`, true);

export const fetchTeamMemberById = (id: number): Promise<TeamMember> =>
    apiClient.get(`/team-members/${id}`, true);