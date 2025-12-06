export interface Service {
    id: number;
    translations: {
        en: {
            title: string;
            description: string;
            details: string[];
        };
        ru: {
            title: string;
            description: string;
            details: string[];
        };
    };
    image: string;
}

export interface TeamMember {
    id: number;
    translations: {
        en: {
            name: string;
            role: string;
            description: string;
        };
        ru: {
            name: string;
            role: string;
            description: string;
        };
    };
    image: string;
    email: string;
    phone: string;
    experience: string;
    specialization: string[];
}

export interface BlogPost {
    id: number;
    translations: {
        en: {
            title: string;
            excerpt: string;
            content: string;
        };
        ru: {
            title: string;
            excerpt: string;
            content: string;
        };
    };
    image: string;
    category: string;
    date: string;
    slug: string;
}

export interface Review {
    id: number;
    author: string;
    position: string;
    text: string;
    rating: number;
}

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

export interface Admin {
    id: number;
    username: string;
    email: string;
    role: 'superadmin' | 'admin' | 'editor';
    passwordHash?: string;
    createdAt: string;
    lastLogin: string;
    isActive: boolean;
}

export interface AdminFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'superadmin' | 'admin' | 'editor';
}

export interface StatItem {
    id: number;
    number: number;
    hasPlus?: boolean;
    translations: {
        en: {
            label: string;
        };
        ru: {
            label: string;
        };
    };
}