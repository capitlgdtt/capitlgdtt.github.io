import React, { useEffect } from 'react';
import HeroSection from "../components/sections/HeroSection.tsx";
import BlogPageSection from "../components/sections/PageSections/BlogPageSection.tsx";

const BlogPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <HeroSection
                id="blog-hero"
                title="Our Blog"
                accentText="Latest Legal Insights"
                imageUrl="/heros/blogs.jpg"
                nextSectionId="blog-posts"
                imagePosition="right"
            />
            <BlogPageSection />
        </>
    );
};

export default BlogPage;