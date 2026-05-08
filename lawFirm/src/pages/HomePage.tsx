import React, { useEffect, useState } from 'react';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import StatsSection from '../components/sections/StatsSection';
import ServicesSection from '../components/sections/ServicesSection';
import TeamSection from '../components/sections/TeamSection';
import ReviewsSection from '../components/sections/ReviewsSection';
import BlogSection from '../components/sections/BlogSection';
import ContactSection from '../components/sections/ContactSection';
import { useI18n } from '../hooks/useI18n';
import { getHomePageData, type HomePageData } from '../services/bffService';

const HomePage: React.FC = () => {
    const { t, currentLanguage } = useI18n();
    const [homeData, setHomeData] = useState<HomePageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getHomePageData(currentLanguage as 'en' | 'ru');
                setHomeData(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };
        loadData();
        window.scrollTo(0, 0);
    }, [currentLanguage]);

    if (loading) {
        return (
            <section className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen flex items-center justify-center">
                <div>{t('common.loading')}</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] text-red-500 min-h-screen flex items-center justify-center">
                <div>{error}</div>
            </section>
        );
    }

    return (
        <>
            <HeroSection
                id="hero"
                title={t('hero.title')}
                subtitle={t('hero.subtitle')}
                accentText={t('hero.slogan')}
                imageUrl="/heros/law.jpg"
                nextSectionId="about"
                imagePosition="right"
            />
            <AboutSection />
            <StatsSection />
            <ServicesSection services={homeData?.services || []} />
            <TeamSection teamMembers={homeData?.teamMembers || []} />
            <ReviewsSection />
            <BlogSection posts={homeData?.blogPosts || []} />
            <ContactSection />
        </>
    );
};

export default HomePage;