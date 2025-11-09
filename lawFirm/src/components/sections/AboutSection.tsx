import React, { useEffect, useRef, useState } from "react";

const AboutSection: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const paragraphs = [
        "Наша компания объединяет юристов, консультантов и аналитиков с многолетним опытом работы в сфере права. Мы создаем решения для клиентов любого масштаба — от малого бизнеса до международных корпораций.",
        "В своей работе мы ценим прозрачность, эффективность и доверие. Наши эксперты сопровождают клиентов на всех этапах взаимодействия — от первичной консультации до комплексного сопровождения дел.",
    ];

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
                    <h2 className="text-[5rem] md:text-[7rem] font-syne uppercase font-semibold leading-tight">
                        who <span className="text-[var(--accent)]">we are</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    {paragraphs.map((text, i) => (
                        <p
                            key={i}
                            className={`transition-all duration-1000 delay-${i * 200} ${
                                visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                            } max-w-[90%] mx-auto text-center md:text-left`}
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
