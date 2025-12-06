import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../../../../hooks/useI18n';
import type {PostFormData} from "../../../../types/admin.types.ts";
import LanguageTabs from "../../editor/LanguageTabs.tsx";
import RichTextEditor from "../../editor/RichTextEditor.tsx";
import {useDebounce} from "../../../../hooks/useDebounce.ts";
import {
    createPost,
    getCategoriesByLanguage,
    getPostById,
    updatePost
} from "../../../../services/blogService.ts";
import {useTheme} from "../../../../hooks/useTheme.ts";

const PostEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, currentLanguage: siteLanguage } = useI18n();

    const isEditing = !!id;
    const postId = id ? parseInt(id) : undefined;

    const categories = getCategoriesByLanguage(siteLanguage as 'en' | 'ru');

    const [formData, setFormData] = useState<PostFormData>({
        translations: {
            en: { title: '', excerpt: '', content: '' },
            ru: { title: '', excerpt: '', content: '' }
        },
        image: '',
        category: categories[0],
        slug: '',
        currentLanguage: siteLanguage as 'en' | 'ru'
    });

    const [isSlugManual, setIsSlugManual] = useState(false);
    const currentTitle = formData.translations[formData.currentLanguage].title;
    const debouncedTitle = useDebounce(currentTitle, 500);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { theme } = useTheme();

    // Загрузка данных поста при редактировании
    useEffect(() => {
        if (isEditing && postId) {
            const post = getPostById(postId);
            if (post) {
                setFormData({
                    translations: post.translations,
                    image: post.image,
                    category: post.category,
                    slug: post.slug,
                    currentLanguage: siteLanguage as 'en' | 'ru'
                });
            }
        }
    }, [isEditing, postId, siteLanguage]);

    useEffect(() => {
        const newCategories = getCategoriesByLanguage(siteLanguage as 'en' | 'ru');

        if (!newCategories.includes(formData.category)) {
            setFormData(prev => ({
                ...prev,
                category: newCategories[0]
            }));
        }
    }, [siteLanguage]);

    useEffect(() => {
        if (!isSlugManual && debouncedTitle && !formData.slug) {
            const generatedSlug = generateSlug(debouncedTitle);
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    }, [debouncedTitle, formData.slug, isSlugManual]);

    const handleTranslationChange = (
        field: 'title' | 'excerpt' | 'content',
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            translations: {
                ...prev.translations,
                [prev.currentLanguage]: {
                    ...prev.translations[prev.currentLanguage],
                    [field]: value
                }
            }
        }));
    };

    const handleContentChange = (content: string) => {
        handleTranslationChange('content', content);
    };

    const handleLanguageChange = (language: 'en' | 'ru') => {
        setFormData(prev => ({ ...prev, currentLanguage: language }));
    };

    const handleSlugChange = (value: string) => {
        setIsSlugManual(true);
        setFormData(prev => ({ ...prev, slug: value }));
    };

    const handleSave = () => {
        const postData = {
            translations: formData.translations,
            image: formData.image || '/blog/default.jpg',
            category: formData.category,
            slug: formData.slug || generateSlug(currentTitle)
        };

        if (isEditing && postId) {
            updatePost(postId, postData);
        } else {
            createPost(postData);
        }

        navigate('/admin/posts');
    };

    const handleCancel = () => {
        navigate('/admin/posts');
    };

    // Функция генерации slug с поддержкой кириллицы
    const generateSlug = (text: string): string => {
        // временная транслитерация
        const translitMap: { [key: string]: string } = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
            'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
            'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
            'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
            'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Е': 'e', 'Ё': 'yo',
            'Ж': 'zh', 'З': 'z', 'И': 'i', 'Й': 'y', 'К': 'k', 'Л': 'l', 'М': 'm',
            'Н': 'n', 'О': 'o', 'П': 'p', 'Р': 'r', 'С': 's', 'Т': 't', 'У': 'u',
            'Ф': 'f', 'Х': 'h', 'Ц': 'ts', 'Ч': 'ch', 'Ш': 'sh', 'Щ': 'sch', 'Ъ': '',
            'Ы': 'y', 'Ь': '', 'Э': 'e', 'Ю': 'yu', 'Я': 'ya'
        };

        // Транслитерируем текст
        const transliterated = text
            .split('')
            .map(char => translitMap[char] || char)
            .join('');

        // Генерируем slug из транслитерированного текста
        return transliterated
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const currentTranslation = formData.translations[formData.currentLanguage];

    return (
        <section
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{
                padding: "var(--container-padding)",
                paddingTop: "calc(var(--header-height) + 2rem)"
            }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Заголовок */}
                <div className="overflow-hidden mb-6">
                    <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {isEditing ? t('admin.posts.editPost') : t('admin.posts.createPost')}
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4 mb-6">
                    {/* Кнопка возврата */}
                    <button
                        onClick={handleCancel}
                        className="relative inline-flex items-center group py-4"
                    >
                        <img
                            src="/arrow_details.svg"
                            alt="arrow"
                            className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1"
                            style={{
                                filter: "invert(54%) sepia(95%) saturate(1555%) hue-rotate(190deg) brightness(95%) contrast(90%)",
                                transform: 'scaleX(-1)'
                            }}
                        />
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {t('admin.backToPosts')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.backToPosts')}
                            </div>
                        </div>
                    </button>
                </div>

                {/* Языковые табы */}
                <LanguageTabs
                    currentLanguage={formData.currentLanguage}
                    onLanguageChange={handleLanguageChange}
                />

                {/* Форма */}
                <div className="space-y-6 mb-8">
                    {/* Заголовок */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.posts.form.title')} *
                        </label>
                        <input
                            type="text"
                            value={currentTranslation.title}
                            onChange={(e) => handleTranslationChange('title', e.target.value)}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder={t('admin.posts.form.titlePlaceholder')}
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.posts.form.slug')}
                            {isSlugManual && (
                                <span className="text-xs text-[var(--accent)] ml-2">
                                    {t('admin.posts.form.slugManual')}
                                </span>
                            )}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => handleSlugChange(e.target.value)}
                                onFocus={() => setIsSlugManual(true)}
                                className="flex-1 bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                                placeholder={t('admin.posts.form.slugPlaceholder')}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newSlug = generateSlug(currentTranslation.title);
                                    handleSlugChange(newSlug);
                                    setIsSlugManual(false);
                                }}
                                className="bg-[var(--bg-secondary)] hover:bg-[var(--accent)] hover:text-white px-4 py-3 transition-colors whitespace-nowrap"
                                title={t('admin.posts.form.slugAuto')}
                            >
                                {t('admin.posts.form.slugAuto')}
                            </button>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                            {isSlugManual
                                ? t('admin.posts.form.slugHintManual')
                                : t('admin.posts.form.slugHintAuto')
                            }
                        </p>
                    </div>

                    {/* Краткое описание */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.posts.form.excerpt')} *
                        </label>
                        <textarea
                            value={currentTranslation.excerpt}
                            onChange={(e) => handleTranslationChange('excerpt', e.target.value)}
                            rows={3}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors resize-none"
                            placeholder={t('admin.posts.form.excerptPlaceholder')}
                        />
                    </div>

                    {/* Категория */}
                    {/* Категория */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.posts.form.category')} *
                        </label>
                        <div className="relative">
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className={`w-full bg-transparent border px-4 py-3 focus:border-[var(--accent)] outline-none transition appearance-none pr-12`}
                                style={{
                                    backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "transparent",
                                    color: "var(--text-primary)",
                                    borderColor: "var(--text-secondary)"
                                }}
                            >
                                {categories.map((category, index) => (
                                    <option
                                        key={index}
                                        value={category}
                                        style={{
                                            backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "white",
                                            color: theme === "dark" ? "var(--text-primary)" : "var(--text-primary)"
                                        }}
                                    >
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <img
                                src="/arrow_down.svg"
                                alt=""
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none w-4 h-4 z-10"
                                style={{
                                    filter: theme === "dark" ? "invert(0)" : "invert(1) brightness(2)"
                                }}
                            />
                        </div>
                    </div>

                    {/* Изображение */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.posts.form.image')}
                        </label>
                        <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                            className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder="/blog/post1.jpg"
                        />
                    </div>

                    {/* Контент */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t('admin.posts.form.content')} *
                        </label>
                        <RichTextEditor
                            content={currentTranslation.content}
                            onChange={handleContentChange}
                            placeholder={t('admin.posts.form.contentPlaceholder')}
                        />
                    </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        className="relative inline-flex items-center group py-4"
                    >
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {isEditing ? t('admin.posts.update') : t('admin.posts.save')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {isEditing ? t('admin.posts.update') : t('admin.posts.save')}
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={handleCancel}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-wide font-medium py-4"
                    >
                        {t('admin.posts.cancel')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PostEditor;