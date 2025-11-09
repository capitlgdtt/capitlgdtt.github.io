import React, { useEffect, useRef, useState } from "react";

interface StatItem {
    number: number;
    label: string;
    hasPlus?: boolean;
}

const StatsSection: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [animatedValues, setAnimatedValues] = useState<number[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    const stats: StatItem[] = [
        { number: 200, label: "Клиентов", hasPlus: true },
        { number: 8, label: "Лет опыта" },
        { number: 22, label: "Юристов" },
        { number: 15, label: "Стран присутствия" },
        { number: 72, label: "Проектов в год", hasPlus: true },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

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
                    <h2 className="text-[5rem] md:text-[7rem] font-syne uppercase font-semibold leading-tight">
                        key <span className="text-[var(--accent)]">figures</span>
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
                            <div className="text-[3rem] md:text-[4rem] font-bold text-[var(--accent)]">
                                {animatedValues[i] ?? 0}
                                {s.hasPlus && "+"}
                            </div>
                            <div className="text-[var(--text-secondary)] text-lg font-medium mt-1">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* дополнительная линия после блоков */}
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

export default StatsSection;
