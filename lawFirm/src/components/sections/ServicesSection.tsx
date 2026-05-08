import React from "react";
import { useI18n } from "../../hooks/useI18n.ts";
import {Link} from "react-router-dom";
import DecorativeLine from "../common/DecorativeLine.tsx";
import {useVisibility} from "../../hooks/useVisibility.ts";
import {useTheme} from "../../hooks/useTheme.ts";

interface ServicesSectionProps {
    services: any[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
    const { t } = useI18n();
    const [ref, visible] = useVisibility(0.2);
    const { theme } = useTheme();
    const columnOffset = 60;

    return (
        <section
            id="services"
            ref={ref}
            className="relative flex flex-col justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{
                padding: "var(--container-padding)",
                paddingBottom: `calc(var(--container-padding))`,
            }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Заголовок секции */}
                <div
                    className={`overflow-hidden mb-8 transition-transform duration-1000 ${
                        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                    }`}
                >
                    <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {t('services.section.title.part1')} <span className="text-[var(--accent)]">{t('services.section.title.part2')}</span>
                    </h2>
                </div>

                {/* Сетка карточек */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-8 lg:gap-x-12 gap-y-8 md:gap-y-12">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`relative p-6 sm:p-8 bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-all duration-400 ease-out 
                          flex flex-col justify-between h-[350px] sm:h-[380px] md:h-[420px] shadow-lg
                          hover:scale-105 hover:shadow-xl cursor-pointer'
              ${
                                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                            }`}
                            style={{ transitionDelay: `100ms` }}
                        >
                            <div>
                                <h3 className="text-2xl md:text-3xl font-semibold mb-4! font-syne">
                                    {service.title}
                                </h3>
                                <p className="text-[var(--text-secondary)] leading-relaxed max-w-[90%]">
                                    {service.description}
                                </p>
                            </div>

                            {/* Нижняя панель */}
                            <div className="flex justify-between items-end mt-auto pt-6">
                                <Link
                                    to={`/services?service=${service.id}`}
                                    className="relative inline-flex items-center group"
                                >
                                    <div className="relative overflow-hidden">
                                        <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                            {t('services.section.details')}
                                        </div>
                                        <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                            {t('services.section.details')}
                                        </div>
                                    </div>
                                    <img
                                        src="/arrow_details.svg"
                                        alt="arrow"
                                        className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                                        style={{
                                            filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)",
                                        }}
                                    />
                                </Link>

                                <div className="text-[var(--accent)] text-4xl font-syne font-bold opacity-40 select-none">
                                    {String(service.id).padStart(2, "0")}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Смещение второй колонки */}
            <style>
                {`
          @media (min-width: 768px) {
            #services .grid > div:nth-child(2n) {
              transform: translateY(${columnOffset}px);
            }
          }
        `}
            </style>

            {/* Кнопка see all*/}
            <div
                className={`transition-all duration-1000 delay-700 mt-12! ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
            >
                <Link
                    to="/services"
                    className="relative inline-flex items-center group py-8"
                >
                    <div className="relative overflow-hidden">
                        <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                            {t('services.section.seeAll')}
                        </div>
                        <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                            {t('services.section.seeAll')}
                        </div>
                    </div>
                    <img
                        src="/arrow_details.svg"
                        alt="arrow"
                        className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        style={{
                            filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)",
                        }}
                    />
                </Link>
            </div>

            {/* линия снизу */}
            <DecorativeLine visible={visible} />
        </section>
    );
};

export default ServicesSection;