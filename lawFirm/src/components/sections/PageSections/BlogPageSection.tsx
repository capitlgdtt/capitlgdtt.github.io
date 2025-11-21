import React, { useEffect, useRef, useState } from "react";
import {useI18n} from "../../../hooks/useI18n.ts";

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    image: string;
    category: string;
    link: string;
}

const BlogPageSection: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const ref = useRef<HTMLDivElement>(null);
    const { t, currentLanguage } = useI18n();

    // Константные данные на двух языках
    const blogPosts: Record<string, BlogPost[]> = {
        en: [
            {
                id: 1,
                title: "Changes in Tax Legislation 2024",
                excerpt: "Overview of key amendments to the tax code coming into effect next year.",
                date: "December 15, 2023",
                image: "/blog/post1.jpg",
                category: "Tax Law",
                link: "/blog/tax-2024",
            },
            {
                id: 2,
                title: "How to Protect Business from Raider Takeover",
                excerpt: "Practical recommendations for protecting corporate rights and preventing hostile takeovers.",
                date: "December 10, 2023",
                image: "/blog/post2.jpg",
                category: "Corporate Law",
                link: "/blog/anti-raid",
            },
            {
                id: 3,
                title: "Digital Contracts: Legal Aspects",
                excerpt: "Examining the legal nuances of electronic contracts and digital signatures.",
                date: "December 5, 2023",
                image: "/blog/post3.jpg",
                category: "IT Law",
                link: "/blog/digital-contracts",
            },
            {
                id: 4,
                title: "Liability for Customer Data Leaks",
                excerpt: "How companies can minimize risks and act properly in case of confidentiality breaches.",
                date: "December 2, 2023",
                image: "/blog/post4.jpg",
                category: "Data Protection",
                link: "/blog/data-breach",
            },
            {
                id: 5,
                title: "Labor Relations: New Rules 2025",
                excerpt: "What has changed in the Labor Code and how employers can adapt to new norms.",
                date: "November 28, 2023",
                image: "/blog/post5.jpg",
                category: "Labor Law",
                link: "/blog/labor-law-2025",
            },
            {
                id: 6,
                title: "Artificial Intelligence and Jurisprudence",
                excerpt: "How AI affects judicial practice and legal processes worldwide.",
                date: "November 20, 2023",
                image: "/blog/post6.jpg",
                category: "Technology",
                link: "/blog/ai-law",
            },
        ],
        ru: [
            {
                id: 1,
                title: "Изменения в налоговом законодательстве 2024",
                excerpt: "Обзор ключевых поправок в налоговом кодексе, вступающих в силу в следующем году.",
                date: "15 декабря 2023",
                image: "/blog/post1.jpg",
                category: "Налоговое право",
                link: "/blog/tax-2024",
            },
            {
                id: 2,
                title: "Как защитить бизнес от рейдерского захвата",
                excerpt: "Практические рекомендации по защите корпоративных прав и предотвращению недружественных поглощений.",
                date: "10 декабря 2023",
                image: "/blog/post2.jpg",
                category: "Корпоративное право",
                link: "/blog/anti-raid",
            },
            {
                id: 3,
                title: "Цифровые договоры: правовые аспекты",
                excerpt: "Разбираем юридические тонкости заключения электронных договоров и цифровых подписей.",
                date: "5 декабря 2023",
                image: "/blog/post3.jpg",
                category: "IT-право",
                link: "/blog/digital-contracts",
            },
            {
                id: 4,
                title: "Ответственность за утечку данных клиентов",
                excerpt: "Как компании минимизировать риски и правильно действовать при нарушении конфиденциальности.",
                date: "2 декабря 2023",
                image: "/blog/post4.jpg",
                category: "Защита данных",
                link: "/blog/data-breach",
            },
            {
                id: 5,
                title: "Трудовые отношения: новые правила 2025",
                excerpt: "Что изменилось в Трудовом кодексе и как работодателям адаптироваться к новым нормам.",
                date: "28 ноября 2023",
                image: "/blog/post5.jpg",
                category: "Трудовое право",
                link: "/blog/labor-law-2025",
            },
            {
                id: 6,
                title: "Искусственный интеллект и юриспруденция",
                excerpt: "Как AI влияет на судебную практику и юридические процессы по всему миру.",
                date: "20 ноября 2023",
                image: "/blog/post6.jpg",
                category: "Технологии",
                link: "/blog/ai-law",
            },
        ]
    };

    // Получаем посты на текущем языке
    const currentPosts = blogPosts[currentLanguage] || blogPosts.en;

    // появление секции
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // отслеживание темы
    useEffect(() => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme") || "dark";
        setTheme(currentTheme as "dark" | "light");

        const observer = new MutationObserver(() => {
            const t =
                document.documentElement.getAttribute("data-theme") || "dark";
            setTheme(t as "dark" | "light");
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => observer.disconnect();
    }, []);

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
                                    <a
                                        href={post.link}
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
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Нижняя линия */}
                <div
                    className={`absolute bottom-0 h-[2px] bg-[var(--text-secondary)] transition-all duration-1000 delay-1000 ${
                        visible ? "w-full scale-x-100" : "w-0 scale-x-0"
                    }`}
                    style={{
                        left: "var(--container-padding)",
                        width: "calc(100% - 2 * var(--container-padding))",
                        transformOrigin: "left center",
                        transitionTimingFunction: "ease-out",
                    }}
                />
            </div>
        </section>
    );
};

export default BlogPageSection;