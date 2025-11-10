import React, { useEffect } from 'react';
import HeroSection from "../components/sections/HeroSection.tsx";
import BlogPageSection from "../components/sections/PageSections/BlogPageSection.tsx";
import { useI18n } from '../hooks/useI18n';

const BlogPage: React.FC = () => {
    const { t } = useI18n();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <HeroSection
                id="blog-hero"
                title={t('blog.hero.title')}
                accentText={t('blog.hero.accentText')}
                imageUrl="/heros/blogs.jpg"
                nextSectionId="blog-posts"
                imagePosition="right"
            />
            <BlogPageSection />
        </>
    );
};

export default BlogPage;