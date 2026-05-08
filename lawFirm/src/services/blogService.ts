import { apiClient } from '../api/apiClient';

export interface BlogPost {
    id: number;
    translations: {
        en: { title: string; excerpt: string; content: string };
        ru: { title: string; excerpt: string; content: string };
    };
    image: string;
    category: string;
    date: string;
    slug: string;
}

export const fetchPosts = async (): Promise<BlogPost[]> => {
    const response = await apiClient.get('/blog-posts', true) as any;
    return response?.items || (Array.isArray(response) ? response : []);
};

export const fetchPublicPosts = (lang: string): Promise<any[]> =>
    apiClient.get(`/blog-posts/public?lang=${lang}`, false);

export const fetchPostBySlug = (slug: string, lang: string): Promise<any> =>
    apiClient.get(`/blog-posts/public/slug/${slug}?lang=${lang}`, false);

export const createPost = (data: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost> =>
    apiClient.post('/blog-posts', data, true);

export const updatePost = (id: number, data: Partial<BlogPost>): Promise<BlogPost> =>
    apiClient.patch(`/blog-posts/${id}`, data, true);

export const deletePost = (id: number): Promise<void> =>
    apiClient.delete(`/blog-posts/${id}`, true);

export const formatDate = (dateString: string, language: 'en' | 'ru'): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return dateString;
    }
};

export const fetchPostById = (id: number): Promise<BlogPost> =>
    apiClient.get(`/blog-posts/${id}`, true);

export const fetchPublicPostBySlug = (slug: string, lang: string): Promise<any> =>
    apiClient.get(`/blog-posts/public/slug/${slug}?lang=${lang}`, false);