import React, { useEffect, useRef, useState } from "react";

interface Service {
    id: number;
    title: string;
    description: string;
    link?: string;
}

const ServicesSection: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const ref = useRef<HTMLDivElement>(null);

    const services: Service[] = [
        {
            id: 1,
            title: "Корпоративное право",
            description:
                "Полное юридическое сопровождение бизнеса, регистрация компаний, договорная работа.",
        },
        {
            id: 2,
            title: "Налоговое право",
            description:
                "Оптимизация налогообложения, защита в налоговых спорах, консультации.",
        },
        {
            id: 3,
            title: "Недвижимость",
            description:
                "Сделки с недвижимостью, сопровождение сделок, разрешение споров.",
        },
        {
            id: 4,
            title: "Семейное право",
            description:
                "Разводы, раздел имущества, алименты, брачные договоры.",
        },
        {
            id: 5,
            title: "Наследственное право",
            description:
                "Оформление наследства, оспаривание завещаний, наследственные споры.",
        },
        {
            id: 6,
            title: "Защита прав потребителей",
            description:
                "Взыскание убытков, защита от недобросовестных продавцов.",
        },
    ];

    // Анимация появления
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // Отслеживаем тему
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

    // Смещение правой колонки
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
                        visible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-12 opacity-0"
                    }`}
                >
                    <h2 className="text-[5rem] md:text-[7rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        our <span className="text-[var(--accent)]">expertises</span>
                    </h2>
                </div>

                {/* Сетка карточек */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className={`relative p-8 bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-all duration-400 ease-out 
                                       flex flex-col justify-between h-[400px] md:h-[420px] shadow-lg
                                       hover:scale-105 hover:shadow-xl cursor-pointer
                            ${
                                visible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-20"
                            }`}
                            style={{
                                transitionDelay: `${index * 100}ms`,
                            }}
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
                                <a
                                    href={`/services?service=${service.id}`}
                                    className="relative inline-flex items-center group"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href = `/services?service=${service.id}`;
                                    }}
                                >
                                    <div className="relative overflow-hidden">
                                        <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                            Подробнее
                                        </div>
                                        <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                            Подробнее
                                        </div>
                                    </div>
                                    <img
                                        src="https://cdn.prod.website-files.com/6160407763f5cd74b27c2405/6160407763f5cd15737c241e_icon-arrow-black-diag.svg"
                                        alt="arrow"
                                        className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                                        style={{
                                            filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)",
                                        }}
                                    />
                                </a>

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

            {/* Кнопка "see all expertises" */}
            <div
                className={`transition-all duration-1000 delay-700 mt-12! ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
            >
                <a
                    href="/services"
                    className="relative inline-flex items-center group py-8"
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/services';
                    }}
                >
                    <div className="relative overflow-hidden">
                        <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                            see all expertises
                        </div>
                        <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                            see all expertises
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
                </a>
            </div>

            {/* линия снизу */}
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

export default ServicesSection;
