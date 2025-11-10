import React, {useEffect} from 'react';
import HeroSection from "../components/sections/HeroSection.tsx";
import TeamPageSection from "../components/sections/PageSections/TeamPageSection.tsx";
import { useI18n } from '../hooks/useI18n';

const TeamPage: React.FC = () => {
    const { t } = useI18n();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <HeroSection
                id="team-hero"
                title={t('team.hero.title')}
                subtitle={t('team.hero.subtitle')}
                accentText={t('team.hero.accentText')}
                imageUrl="/heros/team.jpeg"
                nextSectionId="team-members"
                imagePosition="right"
            />
            <TeamPageSection />
        </>
    );
};

export default TeamPage;