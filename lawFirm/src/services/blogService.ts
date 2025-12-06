import {type BlogPost} from '../types';
import { blogPosts as defaultBlogPosts } from '../data/blogPosts.ts';

export const BLOG_CATEGORIES = {
    en: [
        "Corporate Law",
        "Tax Law",
        "Real Estate",
        "Family Law",
        "Inheritance Law",
        "Consumer Rights Protection",
        "Other"
    ],
    ru: [
        "Корпоративное право",
        "Налоговое право",
        "Недвижимость",
        "Семейное право",
        "Наследственное право",
        "Защита прав потребителей",
        "Другое"
    ]
};

export const translateCategory = (category: string, language: 'en' | 'ru'): string => {
    const categoryMap: Record<string, { en: string, ru: string }> = {
        // Категории из BLOG_CATEGORIES
        "Corporate Law": { en: "Corporate Law", ru: "Корпоративное право" },
        "Tax Law": { en: "Tax Law", ru: "Налоговое право" },
        "Real Estate": { en: "Real Estate", ru: "Недвижимость" },
        "Family Law": { en: "Family Law", ru: "Семейное право" },
        "Inheritance Law": { en: "Inheritance Law", ru: "Наследственное право" },
        "Consumer Rights Protection": { en: "Consumer Rights Protection", ru: "Защита прав потребителей" },
        "Other": { en: "Other", ru: "Другое" },

        // Дополнительные категории из teamMembers
        "Mergers & Acquisitions": { en: "Mergers & Acquisitions", ru: "Слияния и поглощения" },
        "International Law": { en: "International Law", ru: "Международное право" },
        "Civil Law": { en: "Civil Law", ru: "Гражданское право" },
        "Contract Law": { en: "Contract Law", ru: "Договорное право" },
        "Dispute Resolution": { en: "Dispute Resolution", ru: "Разрешение споров" },
        "Criminal Law": { en: "Criminal Law", ru: "Уголовное право" },
        "Business Law": { en: "Business Law", ru: "Бизнес-право" },
        "Intellectual Property": { en: "Intellectual Property", ru: "Интеллектуальная собственность" },
        "Employment Law": { en: "Employment Law", ru: "Трудовое право" },
        "Compliance": { en: "Compliance", ru: "Комплаенс" },
        "Risk Management": { en: "Risk Management", ru: "Управление рисками" },
        "Immigration Law": { en: "Immigration Law", ru: "Иммиграционное право" },
        "Administrative Law": { en: "Administrative Law", ru: "Административное право" },
        "Human Rights": { en: "Human Rights", ru: "Права человека" },

        // для обратного перевода
        "Корпоративное право": { en: "Corporate Law", ru: "Корпоративное право" },
        "Налоговое право": { en: "Tax Law", ru: "Налоговое право" },
        "Недвижимость": { en: "Real Estate", ru: "Недвижимость" },
        "Семейное право": { en: "Family Law", ru: "Семейное право" },
        "Наследственное право": { en: "Inheritance Law", ru: "Наследственное право" },
        "Защита прав потребителей": { en: "Consumer Rights Protection", ru: "Защита прав потребителей" },
        "Другое": { en: "Other", ru: "Другое" },
        "Слияния и поглощения": { en: "Mergers & Acquisitions", ru: "Слияния и поглощения" },
        "Международное право": { en: "International Law", ru: "Международное право" },
        "Гражданское право": { en: "Civil Law", ru: "Гражданское право" },
        "Договорное право": { en: "Contract Law", ru: "Договорное право" },
        "Разрешение споров": { en: "Dispute Resolution", ru: "Разрешение споров" },
        "Уголовное право": { en: "Criminal Law", ru: "Уголовное право" },
        "Бизнес-право": { en: "Business Law", ru: "Бизнес-право" },
        "Интеллектуальная собственность": { en: "Intellectual Property", ru: "Интеллектуальная собственность" },
        "Трудовое право": { en: "Employment Law", ru: "Трудовое право" },
        "Комплаенс": { en: "Compliance", ru: "Комплаенс" },
        "Управление рисками": { en: "Risk Management", ru: "Управление рисками" },
        "Иммиграционное право": { en: "Immigration Law", ru: "Иммиграционное право" },
        "Административное право": { en: "Administrative Law", ru: "Административное право" },
        "Права человека": { en: "Human Rights", ru: "Права человека" }
    };

    return categoryMap[category]?.[language] || category;
};

export const formatDate = (dateString: string, language: 'en' | 'ru'): string => {
    try {
        const date = new Date(dateString);

        if (language === 'ru') {
            const options: Intl.DateTimeFormatOptions = {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            };
            return date.toLocaleDateString('ru-RU', options);
        } else {
            const options: Intl.DateTimeFormatOptions = {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            };
            return date.toLocaleDateString('en-US', options);
        }
    } catch (error) {
        return dateString;
    }
};

export const getCategoriesByLanguage = (language: 'en' | 'ru'): string[] => {
    return BLOG_CATEGORIES[language];
};

// Ключ для localStorage
const STORAGE_KEY = 'blog_posts_v2';

// Получить все посты
export const getPosts = (): BlogPost[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }

        // Если нет сохраненных данных, используем дефолтные из /data/blogPosts.ts
        savePosts(defaultBlogPosts);
        return defaultBlogPosts;
    } catch (error) {
        console.error('Error loading posts:', error);
        return defaultBlogPosts;
    }
};

// Сохранить все посты
export const savePosts = (posts: BlogPost[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

// Получить пост по ID
export const getPostById = (id: number): BlogPost | undefined => {
    const posts = getPosts();
    return posts.find(post => post.id === id);
};

// Получить пост по slug
export const getPostBySlug = (slug: string): BlogPost | undefined => {
    const posts = getPosts();
    return posts.find(post => post.slug === slug);
};

// Создать новый пост
export const createPost = (postData: Omit<BlogPost, 'id' | 'date'>): BlogPost => {
    const posts = getPosts();

    // Проверяем уникальность slug
    let slug = postData.slug;
    let counter = 1;
    while (posts.some(p => p.slug === slug)) {
        slug = `${postData.slug}-${counter}`;
        counter++;
    }

    const newPost: BlogPost = {
        ...postData,
        slug,
        id: generateId(posts),
        date: new Date().toISOString().split('T')[0] // Формат YYYY-MM-DD
    };

    posts.push(newPost);
    savePosts(posts);
    return newPost;
};

// Обновить пост
export const updatePost = (id: number, postData: Partial<BlogPost>): BlogPost | null => {
    const posts = getPosts();
    const index = posts.findIndex(post => post.id === id);

    if (index === -1) return null;

    const updatedPost = { ...posts[index], ...postData };

    // Если обновляем slug, проверяем уникальность
    if (postData.slug && postData.slug !== posts[index].slug) {
        let newSlug = postData.slug;
        let counter = 1;

        // Проверяем, чтобы slug не совпадал с другими постами
        while (posts.some((p, i) => i !== index && p.slug === newSlug)) {
            newSlug = `${postData.slug}-${counter}`;
            counter++;
        }

        updatedPost.slug = newSlug;
    }

    posts[index] = updatedPost;
    savePosts(posts);
    return updatedPost;
};

// Удалить пост
export const deletePost = (id: number): boolean => {
    const posts = getPosts();
    const filteredPosts = posts.filter(post => post.id !== id);

    if (filteredPosts.length === posts.length) return false;

    savePosts(filteredPosts);
    return true;
};

// Генерация ID
const generateId = (posts: BlogPost[]): number => {
    const maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);
    return maxId + 1;
};

// Функция для преобразования даты из "December 15, 2023" в "2023-12-15"
export const formatDateForStorage = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch {
        return new Date().toISOString().split('T')[0];
    }
};