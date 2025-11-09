import React, {useEffect} from 'react';
import HeroSection from "../components/sections/HeroSection.tsx";
import ContactSection from "../components/sections/ContactSection.tsx";
import ServicePageSection from "../components/sections/PageSections/ServicePageSection.tsx";

const ServicesPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <HeroSection
                id="services-hero"
                title="Our Services"
                accentText="Expert Legal Solutions"
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