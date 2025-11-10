import React, {useEffect} from 'react';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import StatsSection from '../components/sections/StatsSection';
import ServicesSection from '../components/sections/ServicesSection';
import TeamSection from '../components/sections/TeamSection';
import ReviewsSection from '../components/sections/ReviewsSection';
import BlogSection from '../components/sections/BlogSection';
import ContactSection from '../components/sections/ContactSection';
import { useI18n } from '../hooks/useI18n';

const HomePage: React.FC = () => {
    const { t } = useI18n();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
            <ServicesSection />
            <TeamSection />
            <ReviewsSection />
            <BlogSection />
            <ContactSection />
        </>
    );
};

export default HomePage;