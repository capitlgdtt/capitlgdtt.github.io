import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import {Link} from "react-router-dom";
import {getPosts, deletePost} from "../../../services/blogService.ts";
import type {BlogPost} from "../../../types";

const PostsManager: React.FC = () => {
    const { t, currentLanguage } = useI18n();
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        const loadedPosts = getPosts();
        setPosts(loadedPosts);
    }, []);

    const handleDeletePost = async (postId: number, postTitle: string) => {
        const confirmed = window.confirm(
            `${t('admin.posts.deleteConfirm.message')} "${postTitle}"?`
        );

        if (confirmed) {
            const success = deletePost(postId);
            if (success) {
                // Обновляем список
                setPosts(getPosts());
                alert(t('admin.posts.deleteConfirm.deleted'));
            }
        }
    };

    const getCurrentTranslation = (post: BlogPost) => {
        return post.translations[currentLanguage as 'en' | 'ru'] || post.translations.en;
    };

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
                        {t('admin.posts.title')}
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4 mb-6">
                    {/* Кнопка возврата */}
                    <Link
                        to="/admin"
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
                                {t('admin.backToDashboard')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.backToDashboard')}
                            </div>
                        </div>
                    </Link>

                    {/* Кнопка создания поста */}
                    <Link
                        to="/admin/posts/create"
                        className="relative inline-flex items-center group py-4"
                    >
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {t('admin.posts.create')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.posts.create')}
                            </div>
                        </div>
                        <img
                            src="/add.svg"
                            alt="add"
                            className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                            style={{
                                filter: "invert(54%) sepia(95%) saturate(1555%) hue-rotate(190deg) brightness(95%) contrast(90%)"
                            }}
                        />
                    </Link>
                </div>

                {/* Список постов */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {posts.map((post) => {
                        const translation = getCurrentTranslation(post);
                        return (
                            <div
                                key={post.id}
                                className="p-6 border border-[var(--bg-secondary)] transition-all duration-300 hover:border-[var(--accent)] flex flex-col justify-between h-full"
                            >
                                <div className="flex-1">
                                    <h3 className="text-2xl font-syne font-semibold mb-2!">{translation.title}</h3>
                                    <p className="text-[var(--text-secondary)] mb-2!">{translation.excerpt}</p>
                                    <div className="flex items-center space-x-4 text-[var(--text-secondary)]">
                                        <span>{post.date}</span>
                                        <div className="w-1 h-1 rounded-full bg-current"></div>
                                        <span>{post.category}</span>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4 mt-6 pt-4 border-t border-[var(--bg-secondary)]">
                                    <Link
                                        to={`/admin/posts/edit/${post.id}`}
                                        className="relative inline-flex items-center group/btn py-2"
                                    >
                                        <div className="relative overflow-hidden">
                                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover/btn:-translate-y-full">
                                                {t('admin.posts.edit')}
                                            </div>
                                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover/btn:translate-y-[-100%]">
                                                {t('admin.posts.edit')}
                                            </div>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => handleDeletePost(post.id, translation.title)}
                                        className="text-red-500 hover:opacity-80 transition-opacity uppercase tracking-wide font-medium"
                                    >
                                        {t('admin.posts.delete')}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default PostsManager;