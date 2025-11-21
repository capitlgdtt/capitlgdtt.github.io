import React, { useEffect, useRef, useState } from "react";
import {useI18n} from "../../hooks/useI18n.ts";

const AboutSection: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { t, currentLanguage } = useI18n();

    // Константные данные на двух языках
    const aboutData: Record<string, string[]> = {
        en: [
            "Our company brings together lawyers, consultants and analysts with years of experience in the legal field. We create solutions for clients of any scale — from small businesses to international corporations.",
            "In our work, we value transparency, efficiency and trust. Our experts accompany clients at all stages of interaction — from initial consultation to comprehensive case support."
        ],
        ru: [
            "Наша компания объединяет юристов, консультантов и аналитиков с многолетним опытом работы в сфере права. Мы создаем решения для клиентов любого масштаба — от малого бизнеса до международных корпораций.",
            "В своей работе мы ценим прозрачность, эффективность и доверие. Наши эксперты сопровождают клиентов на всех этапах взаимодействия — от первичной консультации до комплексного сопровождения дел."
        ]
    };

    // Получаем параграфы на текущем языке
    const paragraphs = aboutData[currentLanguage] || aboutData.en;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={ref}
            id="about"
            className="relative flex flex-col justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{
                minHeight: "calc(60vh - var(--header-height))",
                padding: "var(--container-padding)",
            }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                <div
                    className={`overflow-hidden mb-6 transition-transform duration-1000 ${
                        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                    }`}
                >
                    <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-syne uppercase font-semibold leading-tight break-words">
                        {t('about.title.part1')} <span className="text-[var(--accent)]">{t('about.title.part2')}</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    {paragraphs.map((text, i) => (
                        <p
                            key={i}
                            className={`transition-all duration-1000 delay-${i * 200} ${
                                visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                            } max-w-full md:max-w-[90%] mx-auto text-center md:text-left text-base sm:text-lg md:text-xl leading-relaxed`}
                        >
                            {text}
                        </p>
                    ))}
                </div>
            </div>

            {/* линия снизу */}
            <div
                className={`absolute bottom-0 h-[2px] bg-[var(--accent)] transition-all duration-1000 ${
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

export default AboutSection;