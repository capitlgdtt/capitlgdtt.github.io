// export interface PostFormData {
//     // Мультиязычные поля
//     title: { en: string; ru: string };
//     excerpt: { en: string; ru: string };
//     content: { en: string; ru: string };
//
//     // Общие поля
//     category: string;
//     image: string;
//     slug: { en: string; ru: string };
//     isPublished: boolean;
//     currentLanguage: 'en' | 'ru';
// }

export type PostFormData = {
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
    slug: string;
    currentLanguage: 'en' | 'ru';
};

export interface PostEditorProps {
    postId?: number;
    onSave?: (postData: PostFormData) => void;
    onCancel?: () => void;
}

// export interface PostFormData {
//     title: Record<'en' | 'ru', string>;
//     excerpt: Record<'en' | 'ru', string>;
//     content: Record<'en' | 'ru', string>;
//     category: string;
//     image: string;
//     slug: string;
//     currentLanguage: 'en' | 'ru';
// }
//
// export interface PostEditorProps {
//     postId?: number;
//     onSave?: (postData: PostFormData) => void;
//     onCancel?: () => void;
// }