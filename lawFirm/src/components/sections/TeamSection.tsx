import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "../../hooks/useI18n.ts";
import {Link} from "react-router-dom";

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
}

const TeamSection: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [hoveredMember, setHoveredMember] = useState<number | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const { t, currentLanguage } = useI18n();

    // Константные данные на двух языках
    const teamMembersData: Record<string, TeamMember[]> = {
        en: [
            {
                id: 1,
                name: "Phil Morrisson",
                role: "Founder & CEO",
                image: "/team/dmitry.jpg",
            },
            {
                id: 2,
                name: "Frederik Johansson",
                role: "General practice lawyer",
                image: "/team/sergei.jpg",
            },
            {
                id: 3,
                name: "John Wayne",
                role: "General practice lawyer",
                image: "/team/mikhail.jpg",
            },
            {
                id: 4,
                name: "Jane Smith",
                role: "Founder & CEO",
                image: "/team/anna.jpg",
            },
        ],
        ru: [
            {
                id: 1,
                name: "Фил Моррисон",
                role: "Основатель и CEO",
                image: "/team/dmitry.jpg",
            },
            {
                id: 2,
                name: "Фредерик Йоханссон",
                role: "Юрист общей практики",
                image: "/team/sergei.jpg",
            },
            {
                id: 3,
                name: "Джон Уэйн",
                role: "Юрист общей практики",
                image: "/team/mikhail.jpg",
            },
            {
                id: 4,
                name: "Джейн Смит",
                role: "Основатель и CEO",
                image: "/team/anna.jpg",
            },
        ]
    };

    // Получаем команду на текущем языке
    const teamMembers = teamMembersData[currentLanguage] || teamMembersData.en;

    // появление секции
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // отслеживание темы
    useEffect(() => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme") || "dark";
        setTheme(currentTheme as "dark" | "light");

        const observer = new MutationObserver(() => {
            const t =
                document.documentElement.getAttribute("data-theme") || "dark";
            setTheme(t as "dark" | "light");
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => observer.disconnect();
    }, []);

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
                    {teamMembers.map((member, index) => (
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
                    ))}
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
            <div
                className={`absolute bottom-0 h-[2px] bg-[var(--text-secondary)] transition-all duration-1000 delay-1000 ${
                    visible ? "w-full scale-x-100" : "w-0 scale-x-0"
                }`}
                style={{
                    left: "var(--container-padding)",
                    width: "calc(100% - 2 * var(--container-padding))",
                    transformOrigin: "left center",
                    transitionTimingFunction: "ease-out",
                }}
            />
        </section>
    );
};

export default TeamSection;