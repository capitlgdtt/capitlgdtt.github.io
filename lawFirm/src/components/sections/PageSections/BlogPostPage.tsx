import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from "../../../hooks/useI18n.ts";
import DecorativeLine from "../../common/DecorativeLine.tsx";
import {getPostBySlug, translateCategory, formatDate} from "../../../services/blogService.ts";
import {useTheme} from "../../../hooks/useTheme.ts";

const BlogPostPage: React.FC = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t, currentLanguage } = useI18n();
    const [visible, setVisible] = useState(false);

    const post = slug ? getPostBySlug(slug) : undefined;
    const languageKey = currentLanguage as 'en' | 'ru';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Отслеживание темы
    const { theme } = useTheme();

    useEffect(() => {
        setVisible(true);
    }, []);

    if (!post) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl mb-4">{t('blog.postNotFound')}</h1>
                    <button
                        onClick={() => navigate('/blog')}
                        className="text-[var(--accent)] hover:underline"
                    >
                        {t('blog.backToBlog')}
                    </button>
                </div>
            </div>
        );
    }

    const translation = post.translations[languageKey] || post.translations.en;

    // Переводим категорию и дату
    const translatedCategory = translateCategory(post.category, languageKey);
    const formattedDate = formatDate(post.date, languageKey);

    return (
        <section
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden min-h-screen"
            style={{ padding: "var(--container-padding)", paddingTop: "calc(var(--header-height) + 1rem)" }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Кнопка назад */}
                <div className="mb-2">
                    <button
                        onClick={() => navigate('/blog')}
                        className="relative inline-flex items-center group py-4"
                    >
                        <img
                            src="/arrow_details.svg"
                            alt="arrow"
                            className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-x-1"
                            style={{
                                filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)",
                                transform: 'scaleX(-1)'
                            }}
                        />
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {t('blog.backToBlog')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('blog.backToBlog')}
                            </div>
                        </div>
                    </button>
                </div>

                {/* Заголовок поста */}
                <div className="mb-2">
                    <div className="overflow-hidden mb-6">
                        <h1 className="text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[6rem] font-syne uppercase font-semibold leading-tight break-words">
                            {translation.title}
                        </h1>
                    </div>

                    {/* Информация */}
                    <div className="flex items-center space-x-4 text-[var(--text-secondary)] text-lg mb-8">
                        <span>{formattedDate}</span>
                        <div className="w-2 h-2 rounded-full bg-current"></div>
                        <span>{translatedCategory}</span>
                    </div>

                    {/* Изображение поста */}
                    <div className="relative h-80 sm:h-96 md:h-[500px] mb-8 overflow-hidden rounded-lg">
                        <img
                            src={post.image}
                            alt={translation.title}
                            className={`w-full h-full object-cover transition-all duration-500 ${
                                theme === "dark"
                                    ? "brightness-50 contrast-110 saturate-90"
                                    : "brightness-90 contrast-95 saturate-100"
                            }`}
                        />
                    </div>
                </div>

                {/* Контент поста */}
                <div className="w-full">
                    <div className="prose prose-lg max-w-none text-[var(--text-primary)]">
                        {/* Краткое описание */}
                        <p className="text-xl text-[var(--text-secondary)] leading-relaxed italic">
                            {translation.excerpt}
                        </p>

                        {/* Линия разделитель */}
                        <div className="relative -mx-10 mt-4">
                            <DecorativeLine visible={visible} color="var(--accent)" delay={500} />
                        </div>

                        {/* Основной контент */}
                        <div className="space-y-6 text-lg leading-relaxed mt-12">
                            <div
                                className="prose prose-lg max-w-none text-[var(--text-primary) tiptap-editor"
                                dangerouslySetInnerHTML={{ __html: translation.content }}
                            />
                        </div>
                    </div>
                </div>

                {/* Нижняя линия секции */}
                <DecorativeLine visible={visible} delay={1000} />
            </div>
        </section>
    );
};

export default BlogPostPage;