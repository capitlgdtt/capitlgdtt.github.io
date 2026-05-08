import React, { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import {useI18n} from "../../hooks/useI18n.ts";
import DecorativeLine from "../common/DecorativeLine.tsx";
import {useVisibility} from "../../hooks/useVisibility.ts";
import {useTheme} from "../../hooks/useTheme.ts";

interface BlogSectionProps {
    posts: any[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const postsContainerRef = useRef<HTMLDivElement>(null);
    const { t } = useI18n();
    const [ref, visible] = useVisibility(0.2);
    const { theme } = useTheme();

    const nextPost = () => {
        setCurrentIndex((prev) => (prev + 1) % posts.length);
    };

    const prevPost = () => {
        setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
    };

    const [postsPerView, setPostsPerView] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            setPostsPerView(window.innerWidth < 768 ? 1 : 3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section
            id="blog"
            ref={ref}
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{ padding: "var(--container-padding)" }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Заголовок и кнопки навигации */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
                    <div
                        className={`overflow-hidden transition-transform duration-1000 ${
                            visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                        }`}
                    >
                        <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                            {t('blog.section.title')} <span className="text-[var(--accent)]">{t('blog.section.accent')}</span>
                        </h2>
                    </div>

                    {/* Кнопки навигации */}
                    <div
                        className={`flex gap-4 transition-all duration-1000 delay-500 flex-shrink-0 justify-end ${
                            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                        }`}
                    >
                        <button
                            onClick={prevPost}
                            className="bg-[var(--bg-secondary)] p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 border flex-shrink-0"
                            style={{
                                borderColor: theme === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"
                            }}
                        >
                            <img
                                src="/arrow_left.svg"
                                alt="Previous"
                                className="w-6 h-6 flex-shrink-0"
                                style={{
                                    filter: theme === "dark" ? "invert(0)" : "invert(1) brightness(2)"
                                }}
                            />
                        </button>
                        <button
                            onClick={nextPost}
                            className="bg-[var(--bg-secondary)] p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 border flex-shrink-0"
                            style={{
                                borderColor: theme === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"
                            }}
                        >
                            <img
                                src="/arrow_right.svg"
                                alt="Next"
                                className="w-6 h-6 flex-shrink-0"
                                style={{
                                    filter: theme === "dark" ? "invert(0)" : "invert(1) brightness(2)"
                                }}
                            />
                        </button>
                    </div>
                </div>

                {/* Контейнер постов с бесконечной прокруткой */}
                <div className="overflow-hidden">
                    <div
                        ref={postsContainerRef}
                        className="flex transition-transform duration-500 ease-out gap-6 sm:gap-8"
                        style={{
                            transform: `translateX(calc(-${currentIndex * (100 / postsPerView)}% - ${currentIndex * (32 / postsPerView)}px))`
                        }}
                    >
                        {/* Дублируем посты для бесконечной прокрутки */}
                        {[...posts, ...posts, ...posts].map((post, index) => (
                            <article
                                key={`${post.id}-${index}`}
                                className={`relative p-8 transition-all duration-700 ease-out border rounded-none overflow-hidden group h-[420px] flex flex-col justify-between flex-shrink-0 ${
                                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                } ${
                                    theme === "light" ? "group hover:text-[var(--primary-light)]" : ""
                                }`}
                                style={{
                                    width: `calc(${100 / postsPerView}% - ${(postsPerView - 1) * 32 / postsPerView}px)`,
                                    minWidth: `calc(${100 / postsPerView}% - ${(postsPerView - 1) * 32 / postsPerView}px)`,
                                    borderColor: theme === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
                                }}
                            >
                                {/* Фон-картинка */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                    style={{
                                        backgroundImage: `url(${post.image})`,
                                        filter: theme === "dark" ? "brightness(0.5) contrast(110%) saturate(90%)" : "brightness(0.75) contrast(95%) saturate(100%)",
                                    }}
                                />

                                {/* Контент поверх */}
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div>
                                        <h3 className="text-2xl font-syne font-semibold mb-4 leading-snug line-clamp-3">
                                            {post.title}
                                        </h3>
                                        <p className="text-secondary text-lg mb-6 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-3 text-secondary text-sm mb-4">
                                            <span>{post.date}</span>
                                            <div className="w-2 h-2 rounded-full bg-current"></div>
                                            <span>{post.category}</span>
                                        </div>

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
                                                    filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)",
                                                }}
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* Кнопка "see our blog" */}
                <div
                    className={`transition-all duration-1000 delay-700 mt-12 ${
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                >
                    <Link
                        to="/blog"
                        className="relative inline-flex items-center group py-8"
                    >
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {t('blog.seeOurBlog')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('blog.seeOurBlog')}
                            </div>
                        </div>
                        <img
                            src="/arrow_details.svg"
                            alt="arrow"
                            className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                            style={{
                                filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)",
                            }}
                        />
                    </Link>
                </div>
            </div>

            {/* Нижняя линия */}
            <DecorativeLine visible={visible} />
        </section>
    );
};

export default BlogSection;