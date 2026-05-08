import React, { useEffect, useState } from "react";
import { useI18n } from "../../hooks/useI18n";
import DecorativeLine from "../common/DecorativeLine";
import { fetchPublicStats, type StatPublic } from "../../services/statsService";
import { useVisibility } from "../../hooks/useVisibility";

const StatsSection: React.FC = () => {
    const [animatedValues, setAnimatedValues] = useState<number[]>([]);
    const [stats, setStats] = useState<StatPublic[]>([]);
    const { t, currentLanguage } = useI18n();
    const [ref, visible] = useVisibility(0.2);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchPublicStats(currentLanguage as 'en' | 'ru');
                setStats(data);
            } catch (err) {
                console.error(err);
            }
        };
        loadStats();
    }, [currentLanguage]);

    useEffect(() => {
        if (!visible || stats.length === 0) return;
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
    }, [visible, stats]);

    //if (stats.length === 0) return null;

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

                <div
                    className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-4 transition-opacity duration-1000 ${
                        visible ? "opacity-100" : "opacity-0"
                    }`}
                >
                    {stats.map((s, i) => (
                        <div key={s.id} className="text-center">
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
            <DecorativeLine visible={visible} delay={1500} />
        </section>
    );
};

export default StatsSection;