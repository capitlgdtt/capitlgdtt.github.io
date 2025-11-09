import React, {useEffect} from 'react';
import HeroSection from "../components/sections/HeroSection.tsx";
import TeamPageSection from "../components/sections/PageSections/TeamPageSection.tsx";

const TeamPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <HeroSection
                id="team-hero"
                title="Our Team"
                subtitle="Professional Lawyers"
                accentText="Meet Our Experts"
                imageUrl="/heros/team.jpeg"
                nextSectionId="team-members"
                imagePosition="right"
            />
            <TeamPageSection />
        </>
    );
};

export default TeamPage;