import React, { useState } from "react";
import { useI18n } from "../../hooks/useI18n.ts";
import {Link} from "react-router-dom";
import DecorativeLine from "../common/DecorativeLine.tsx";
import {getLimitedTeamMembersForDisplay} from "../../services/teamService.ts";
import {useVisibility} from "../../hooks/useVisibility.ts";
import {useTheme} from "../../hooks/useTheme.ts";

const TeamSection: React.FC = () => {
    const [hoveredMember, setHoveredMember] = useState<number | null>(null);
    const { t, currentLanguage } = useI18n();

    // Получаем команду на текущем языке
    const members = getLimitedTeamMembersForDisplay(currentLanguage as 'en' | 'ru', 4);

    // появление секции
    const [ref, visible] = useVisibility(0.2);

    // отслеживание темы
    const { theme } = useTheme();

    return (
        <section
            id="team"
            ref={ref}
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{ padding: "var(--container-padding)" }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Заголовок*/}
                <div
                    className={`overflow-hidden mb-8 transition-transform duration-1000 ${
                        visible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-12 opacity-0"
                    }`}
                >
                    <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {t('team.section.title.part1')} <span className="text-[var(--accent)]">{t('team.section.title.part2')}</span>
                    </h2>
                </div>

                {/* Список команды */}
                <div className="space-y-0">
                    {members.map((member, index) => {
                        return (
                            <div
                                key={member.id}
                                className="relative group"
                                onMouseEnter={() => setHoveredMember(member.id)}
                                onMouseLeave={() => setHoveredMember(null)}
                            >
                                <div className="flex items-center justify-between py-8 cursor-pointer">
                                    {/* Информация о человеке */}
                                    <div className="flex items-center space-x-6 sm:space-x-8 md:space-x-12">
                                        <div className="text-4xl font-syne font-bold text-[var(--accent)] opacity-60 w-16 hidden md:block">
                                            {String(member.id).padStart(2, "0")}
                                        </div>
                                        <div className="infos-team-member">
                                            <div className="sub-heading text-xl sm:text-2xl md:text-3xl font-semibold font-syne">
                                                {member.name}
                                            </div>
                                            <div className="wrapper-job-title text-[var(--text-secondary)] text-base sm:text-lg md:text-xl mt-2">
                                                <p>{member.role}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Фото */}
                                    <div className={`absolute left-1/2 top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-out z-10 ${
                                        hoveredMember === member.id
                                            ? "opacity-100 scale-100 rotate-0 translate-x-0"
                                            : "opacity-0 scale-90 -rotate-3 translate-x-4"
                                    }`}>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className={`w-48 h-72 object-cover rounded-lg transition-all duration-500 ${
                                                theme === "dark"
                                                    ? "brightness-50 contrast-110 saturate-90"
                                                    : "brightness-90 contrast-95 saturate-100"
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Линия между строками */}
                                <div
                                    className={`absolute bottom-0 left-0 w-full h-[1px] bg-[var(--text-secondary)] transition-all duration-700 z-0 ${
                                        visible ? "scale-x-100" : "scale-x-0"
                                    }`}
                                    style={{
                                        transformOrigin: "left center",
                                        transitionDelay: `${index * 100}ms`,
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>

                {/* Кнопка "see all the team" */}
                <div
                    className={`transition-all duration-1000 delay-700 mt-8 ${
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                >
                    <Link
                        to="/team"
                        className="relative inline-flex items-center group py-8"
                    >
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {t('team.section.seeAll')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('team.section.seeAll')}
                            </div>
                        </div>
                        <img
                            src="/arrow_details.svg"
                            alt="arrow"
                            className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                            style={{
                                filter:
                                    theme === "dark"
                                        ? "invert(1) brightness(2)"
                                        : "invert(0)",
                            }}
                        />
                    </Link>
                </div>
            </div>

            {/* нижняя линия */}
            <DecorativeLine visible={visible} />
        </section>
    );
};

export default TeamSection;