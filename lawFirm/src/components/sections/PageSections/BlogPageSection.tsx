import React from "react";
import {useI18n} from "../../../hooks/useI18n.ts";
import DecorativeLine from "../../common/DecorativeLine.tsx";
import { Link } from "react-router-dom";
import {getPosts} from "../../../services/blogService.ts";
import {useTheme} from "../../../hooks/useTheme.ts";
import {useVisibility} from "../../../hooks/useVisibility.ts";

const BlogPageSection: React.FC = () => {
    const { theme } = useTheme();
    const { t, currentLanguage } = useI18n();

    // Получаем посты на текущем языке
    const allPosts = getPosts();
    const languageKey = currentLanguage as 'en' | 'ru';

    const currentPosts = allPosts.map(post => ({
        id: post.id,
        title: post.translations[languageKey]?.title || post.translations.en.title,
        excerpt: post.translations[languageKey]?.excerpt || post.translations.en.excerpt,
        content: post.translations[languageKey]?.content || post.translations.en.content,
        date: post.date,
        image: post.image,
        category: post.category,
        slug: post.slug
    }));

    // появление секции
    const [ref, visible] = useVisibility(0.2);

    return (
        <section
            id="blog-posts"
            ref={ref}
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{ padding: "var(--container-padding)" }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Заголовок */}
                <div
                    className={`overflow-hidden transition-transform duration-1000 mb-16 ${
                        visible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-12 opacity-0"
                    }`}
                >
                    <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {t('blog.page.title')} <span className="text-[var(--accent)]">{t('blog.page.accent')}</span>
                    </h2>
                </div>

                {/* Сетка постов */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {currentPosts.map((post, index) => (
                        <article
                            key={post.id}
                            className={`relative p-8 transition-all duration-700 ease-out border rounded-none overflow-hidden group h-[420px] flex flex-col justify-between ${
                                visible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-8"
                            } ${
                                theme === "light"
                                    ? "group hover:text-[var(--primary-light)]"
                                    : ""
                            }`}
                            style={{
                                borderColor:
                                    theme === "dark"
                                        ? "rgba(255,255,255,0.25)"
                                        : "rgba(0,0,0,0.25)",
                                transitionDelay: `${index * 100}ms`
                            }}
                        >
                            {/* Фон-картинка */}
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                style={{
                                    backgroundImage: `url(${post.image})`,
                                    filter:
                                        theme === "dark"
                                            ? "brightness(0.5) contrast(110%) saturate(90%)"
                                            : "brightness(0.75) contrast(95%) saturate(100%)",
                                }}
                            />

                            {/* Контент поверх */}
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                {/* Верх — заголовок */}
                                <div>
                                    <h3 className="text-2xl font-syne font-semibold mb-4 leading-snug line-clamp-3">
                                        {post.title}
                                    </h3>
                                    <p className="text-secondary text-lg mb-6 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                </div>

                                {/* Нижняя часть */}
                                <div>
                                    <div className="flex items-center space-x-3 text-secondary text-sm mb-4">
                                        <span>{post.date}</span>
                                        <div className="w-2 h-2 rounded-full bg-current"></div>
                                        <span>{post.category}</span>
                                    </div>

                                    {/* Кнопка "read more" */}
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="relative inline-flex items-center group/btn py-2"
                                    >
                                        <div className="relative overflow-hidden">
                                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover/btn:-translate-y-full">
                                                {t('blog.readMore')}
                                            </div>
                                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover/btn:translate-y-[-100%]">
                                                {t('blog.readMore')}
                                            </div>
                                        </div>
                                        <img
                                            src="/arrow_details.svg"
                                            alt="arrow"
                                            className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1"
                                            style={{
                                                filter:
                                                    theme === "dark"
                                                        ? "invert(1) brightness(2)"
                                                        : "invert(0)",
                                            }}
                                        />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Нижняя линия */}
                <DecorativeLine visible={visible} />
            </div>
        </section>
    );
};

export default BlogPageSection;