import React from "react";
import {useI18n} from "../../../hooks/useI18n.ts";
import DecorativeLine from "../../common/DecorativeLine.tsx";
import {getTeamMembersForDisplay} from "../../../services/teamService.ts";
import {useTheme} from "../../../hooks/useTheme.ts";
import {useVisibility} from "../../../hooks/useVisibility.ts";


const TeamPageSection: React.FC = () => {
    const { t, currentLanguage } = useI18n();

    // Получаем членов команды на текущем языке
    const members = getTeamMembersForDisplay(currentLanguage as 'en' | 'ru');

    // появление секции
    const [ref, visible] = useVisibility(0.17);

    // отслеживание темы
    const { theme } = useTheme();

    return (
        <section
            id="team-members"
            ref={ref}
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{ padding: "var(--container-padding)" }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Заголовок */}
                <div
                    className={`overflow-hidden mb-16 transition-transform duration-1000 ${
                        visible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-12 opacity-0"
                    }`}
                >
                    <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {t('team.page.title')} <span className="text-[var(--accent)]">{t('team.page.accent')}</span>
                    </h2>
                </div>

                {/* Сетка карточек команды */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {members.map((member) => {
                        return (
                            <div
                                key={member.id}
                                className={`relative group transition-all duration-700 ease-out ${
                                    visible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                }`}
                                style={{
                                    transitionDelay: `100ms`
                                }}
                            >
                                {/* Карточка */}
                                <div className="border rounded-none overflow-hidden h-full flex flex-col bg-[var(--bg-secondary)]/30 backdrop-blur-sm">
                                    {/* Изображение */}
                                    <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className={`w-full h-full object-cover object-[50%_25%] transition-all duration-500 group-hover:scale-105 ${
                                                theme === "dark"
                                                    ? "brightness-50 contrast-110 saturate-90"
                                                    : "brightness-90 contrast-95 saturate-100"
                                            }`}
                                        />
                                        <div className="absolute top-4 left-4 bg-[var(--accent)] text-[var(--bg-primary)] px-3 py-1 rounded-full text-sm font-medium">
                                            {member.experience}
                                        </div>
                                    </div>

                                    {/* Контент */}
                                    <div className="p-4 sm:p-6 flex-1 flex flex-col">
                                        {/* Основная информация */}
                                        <div className="mb-4">
                                            <h3 className="text-2xl font-syne font-semibold mb-2">
                                                {member.name}
                                            </h3>
                                            <p className="text-[var(--accent)] font-medium mb-3">
                                                {member.role}
                                            </p>
                                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                                                {member.description}
                                            </p>
                                        </div>

                                        {/* Специализация */}
                                        <div className="mb-4 flex-1">
                                            <h4 className="text-sm font-semibold mb-2! text-[var(--text-secondary)]">
                                                {t('team.specialization')}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {member.specialization.map((spec: string, idx: number) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs rounded border"
                                                        style={{
                                                            borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"
                                                        }}
                                                    >
                                                    {spec}
                                                </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Контакты */}
                                        <div className="border-t pt-4 mt-auto"
                                             style={{
                                                 borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"
                                             }}>
                                            <div className="flex flex-col space-y-2!">
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                                                >
                                                    <img
                                                        src="/icons/mail.png"
                                                        alt="Email"
                                                        className="w-4 h-4 mr-2"
                                                        style={{
                                                            filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)"
                                                        }}
                                                    />
                                                    {member.email}
                                                </a>
                                                <a
                                                    href={`tel:${member.phone}`}
                                                    className="flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                                                >
                                                    <img
                                                        src="/icons/phone.png"
                                                        alt="Phone"
                                                        className="w-4 h-4 mr-2"
                                                        style={{
                                                            filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)"
                                                        }}
                                                    />
                                                    {member.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Нижняя линия */}
                <DecorativeLine visible={visible} />
            </div>
        </section>
    );
};

export default TeamPageSection;