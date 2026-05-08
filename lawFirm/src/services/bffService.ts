import { apiClient } from '../api/apiClient';

export interface HomePageData {
    services: any[];
    blogPosts: any[];
    teamMembers: any[];
}
export const getHomePageData = async (lang: string): Promise<HomePageData> => {
    const response = await apiClient.get(`/bff/home?lang=${lang}`, false);
    return (response as any).data || response;
};