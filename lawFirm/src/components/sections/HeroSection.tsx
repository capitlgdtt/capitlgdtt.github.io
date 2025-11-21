import React, { useEffect, useState } from "react";

interface HeroSectionProps {
    id: string;
    title: string;
    subtitle?: string;
    accentText?: string;
    imageUrl: string;
    nextSectionId: string;
    imagePosition?: "right" | "left";
}

const HeroSection: React.FC<HeroSectionProps> = ({
                                                     id,
                                                     title,
                                                     subtitle,
                                                     accentText,
                                                     imageUrl,
                                                     nextSectionId,
                                                     imagePosition = "right"
                                                 }) => {
    const [theme, setTheme] = useState<"dark" | "light">(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) return savedTheme as "dark" | "light";

        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return systemPrefersDark ? "dark" : "light";
    });

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const currentTheme =
                document.documentElement.getAttribute("data-theme") || "dark";
            setTheme(currentTheme as "dark" | "light");
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 200);
        return () => clearTimeout(timeout);
    }, []);

    const scrollToNextSection = (e: React.MouseEvent) => {
        e.preventDefault();
        const nextSection = document.getElementById(nextSectionId);
        if (nextSection) {
            const startPosition = window.pageYOffset;
            const targetPosition = nextSection.offsetTop;
            const distance = targetPosition - startPosition;
            const duration = 700;
            let startTime: number | null = null;

            function animation(currentTime: number) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            function easeInOutQuad(t: number, b: number, c: number, d: number) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        }
    };

    return (
        <section
            id={id}
            className="relative flex items-center overflow-hidden bg-[var(--bg-primary)]"
            style={{
                minHeight: "calc(100vh)",
                paddingTop: "var(--header-height)",
            }}
        >
            {/* Изображение */}
            <div
                className={`absolute ${imagePosition === "right" ? "right-0" : "left-0"} top-0 h-full w-4/7 sm:w-1/3 md:w-1/3 flex items-center justify-center transition-all duration-[1800ms] transform ${
                    visible
                        ? "translate-x-0 opacity-100 scale-100 rotate-0"
                        : imagePosition === "right"
                            ? "translate-x-[-60em] opacity-0 scale-75 -rotate-[4deg]"
                            : "translate-x-[60em] opacity-0 scale-75 rotate-[4deg]"
                }`}
            >
                <img
                    src={imageUrl}
                    alt={title}
                    className={`object-cover w-full h-full select-none pointer-events-none transition-all duration-500
            ${
                        theme === "dark"
                            ? "brightness-50 contrast-110 saturate-90"
                            : "brightness-90 contrast-95 saturate-100"
                    }`}
                    style={{
                        backgroundColor: "transparent"
                    }}
                />
                <div
                    className={`absolute inset-0 transition-colors duration-500 ${
                        theme === "dark" ? "bg-black/40" : "bg-white/10"
                    }`}
                />
            </div>

            {/* Текст */}
            <div
                className={`relative z-10 w-full lg:w-2/3 ${imagePosition === "right" ? "" : "ml-auto"}`}
                style={{
                    maxWidth: "1920px",
                    margin: "0 auto",
                    paddingLeft: "var(--container-padding)",
                    paddingRight: "var(--container-padding)",
                }}
            >
                <div className="overflow-hidden mb-4">
                    <h1
                        className={`text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-syne uppercase font-semibold transition-transform duration-700 break-words leading-tight ${
                            visible ? "translate-y-0" : "translate-y-full"
                        }`}
                    >
                        {title}
                    </h1>
                </div>

                {subtitle && (
                    <div className="overflow-hidden mb-4">
                        <h2
                            className={`text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[7rem] font-syne uppercase font-normal text-right transition-transform duration-700 delay-150 break-words leading-tight ${
                                visible ? "translate-y-0" : "translate-y-full"
                            }`}
                        >
                            {subtitle}
                        </h2>
                    </div>
                )}

                {accentText && (
                    <div className="overflow-hidden mb-8">
                        <h3
                            className={`text-[1.5rem] sm:text-[2rem] md:text-[3rem] lg:text-[4rem] font-syne uppercase text-[var(--accent)] transition-transform duration-700 delay-300 break-words leading-tight ${
                                visible ? "translate-y-0" : "translate-y-full"
                            }`}
                        >
                            {accentText}
                        </h3>
                    </div>
                )}
            </div>

            {/* Кнопка со стрелкой */}
            <div
                className={`absolute bottom-[5%] transition-all duration-700 delay-700 z-10 ${
                    visible ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
                style={{
                    left: "var(--container-padding)",
                }}
            >
                <a
                    href={`#${nextSectionId}`}
                    className="inline-flex items-center justify-center bg-[var(--accent)] text-[var(--bg-primary)] rounded-full w-16 h-16 hover:opacity-90 transition-opacity"
                    onClick={scrollToNextSection}
                >
                    <img
                        src="/arrow.svg"
                        alt="arrow"
                        className="w-5 h-5"
                    />
                </a>
            </div>
        </section>
    );
};

export default HeroSection;