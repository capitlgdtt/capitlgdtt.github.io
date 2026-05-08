import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from "../../../hooks/useI18n";
import DecorativeLine from "../../common/DecorativeLine";
import { fetchPublicPostBySlug } from "../../../services/blogService";
import { useTheme } from "../../../hooks/useTheme";

const BlogPostPage: React.FC = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t, currentLanguage } = useI18n();
    const { theme } = useTheme();

    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setVisible(true);
    }, []);

    useEffect(() => {
        if (!slug) return;
        const loadPost = async () => {
            setLoading(true);
            setError(false);
            try {
                const data = await fetchPublicPostBySlug(slug, currentLanguage as 'en' | 'ru');
                setPost(data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [slug, currentLanguage]);

    if (loading) {
        return (
            <section className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen flex items-center justify-center">
                <div>{t('common.loading')}</div>
            </section>
        );
    }

    if (error || !post) {
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

    return (
        <section
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden min-h-screen"
            style={{ padding: "var(--container-padding)", paddingTop: "calc(var(--header-height) + 1rem)" }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
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

                <div className="mb-2">
                    <div className="overflow-hidden mb-6">
                        <h1 className="text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[6rem] font-syne uppercase font-semibold leading-tight break-words">
                            {post.title}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4 text-[var(--text-secondary)] text-lg mb-8">
                        <span>{post.date}</span>
                        <div className="w-2 h-2 rounded-full bg-current"></div>
                        <span>{post.category}</span>
                    </div>

                    <div className="relative h-80 sm:h-96 md:h-[500px] mb-8 overflow-hidden rounded-lg">
                        <img
                            src={post.image}
                            alt={post.title}
                            className={`w-full h-full object-cover transition-all duration-500 ${
                                theme === "dark"
                                    ? "brightness-50 contrast-110 saturate-90"
                                    : "brightness-90 contrast-95 saturate-100"
                            }`}
                        />
                    </div>
                </div>

                <div className="w-full">
                    <div className="prose prose-lg max-w-none text-[var(--text-primary)]">
                        <p className="text-xl text-[var(--text-secondary)] leading-relaxed italic">
                            {post.excerpt}
                        </p>

                        <div className="relative -mx-10 mt-4">
                            <DecorativeLine visible={visible} color="var(--accent)" delay={500} />
                        </div>

                        <div className="space-y-6 text-lg leading-relaxed mt-12">
                            <div
                                className="prose prose-lg max-w-none text-[var(--text-primary)] tiptap-editor"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>
                    </div>
                </div>

                <DecorativeLine visible={visible} delay={1000} />
            </div>
        </section>
    );
};

export default BlogPostPage;