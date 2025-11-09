import React, {useEffect} from 'react';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import StatsSection from '../components/sections/StatsSection';
import ServicesSection from '../components/sections/ServicesSection';
import TeamSection from '../components/sections/TeamSection';
import ReviewsSection from '../components/sections/ReviewsSection';
import BlogSection from '../components/sections/BlogSection';
import ContactSection from '../components/sections/ContactSection';

const HomePage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <HeroSection
                id="hero"
                title="CompanyName"
                subtitle="Law Firm"
                accentText="Company Slogan"
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