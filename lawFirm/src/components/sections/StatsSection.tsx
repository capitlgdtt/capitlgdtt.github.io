import React, { useEffect, useState } from "react";
import { useI18n } from "../../hooks/useI18n.ts";
import DecorativeLine from "../common/DecorativeLine.tsx";
import {getStatsForDisplay} from "../../services/statsService.ts";
import {useVisibility} from "../../hooks/useVisibility.ts";


const StatsSection: React.FC = () => {
    const [animatedValues, setAnimatedValues] = useState<number[]>([]);
    const { t, currentLanguage } = useI18n();

    // Получаем статистику на текущем языке
    const stats = getStatsForDisplay(currentLanguage as 'en' | 'ru');

    const [ref, visible] = useVisibility(0.2);

    useEffect(() => {
        if (!visible) return;
        const duration = 2000;
        const steps = 60;
        let current = 0;

        const interval = setInterval(() => {
            current++;
            setAnimatedValues(
                stats.map((s) => Math.round((s.number * current) / steps))
            );
            if (current >= steps) clearInterval(interval);
        }, duration / steps);
    }, [visible]);

    return (
        <section
            ref={ref}
            className="relative flex flex-col justify-center bg-[var(--bg-secondary)] text-[var(--text-primary)] overflow-hidden"
            style={{
                minHeight: "40vh",
                padding: "var(--container-padding)",
            }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                <div
                    className={`overflow-hidden mb-4 transition-transform duration-1000 ${
                        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                    }`}
                >
                    <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-syne uppercase font-semibold leading-tight break-words">
                        {t('stats.title.part1')} <span className="text-[var(--accent)]">{t('stats.title.part2')}</span>
                    </h2>
                </div>

                {/* Параметры статистики */}
                <div
                    className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-4 transition-opacity duration-1000 ${
                        visible ? "opacity-100" : "opacity-0"
                    }`}
                >
                    {stats.map((s, i) => (
                        <div key={i} className="text-center">
                            <div className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-bold text-[var(--accent)]">
                                {animatedValues[i] ?? 0}
                                {s.hasPlus && "+"}
                            </div>
                            <div className="text-[var(--text-secondary)] text-sm sm:text-base md:text-lg font-medium mt-1">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* дополнительная линия после блоков */}
            <DecorativeLine visible={visible} delay={1500}/>
        </section>
    );
};

export default StatsSection;