export interface Service {
    id: number;
    title: string;
    description: string;
    icon: string;
}

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
    bio: string;
}

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    image: string;
}

export interface Review {
    id: number;
    author: string;
    position: string;
    text: string;
    rating: number;
}