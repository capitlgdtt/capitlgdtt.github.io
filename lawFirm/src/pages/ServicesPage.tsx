import React, {useEffect} from 'react';
import HeroSection from "../components/sections/HeroSection.tsx";
import ContactSection from "../components/sections/ContactSection.tsx";
import ServicePageSection from "../components/sections/PageSections/ServicePageSection.tsx";
import { useI18n } from '../hooks/useI18n';

const ServicesPage: React.FC = () => {
    const { t } = useI18n();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <HeroSection
                id="services-hero"
                title={t('services.hero.title')}
                accentText={t('services.hero.accentText')}
                imageUrl="/heros/services.jpeg"
                nextSectionId="services-list"
                imagePosition="right"
            />
            <ServicePageSection />
            <ContactSection />
        </>
    );
};

export default ServicesPage;