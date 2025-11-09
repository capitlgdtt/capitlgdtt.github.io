import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

interface Service {
    id: number;
    title: string;
    description: string;
    image: string;
    details: string[];
}

const ServicesPageSection: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const ref = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const services: Service[] = [
        {
            id: 1,
            title: "Корпоративное право",
            description: "Полное юридическое сопровождение бизнеса, регистрация компаний, договорная работа.",
            image: "/services/service4.jpg",
            details: [
                "Регистрация и ликвидация компаний",
                "Договорная работа и сопровождение сделок",
                "Корпоративное управление и compliance",
                "Слияния и поглощения (M&A)",
                "Защита от рейдерских захватов"
            ]
        },
        {
            id: 2,
            title: "Налоговое право",
            description: "Оптимизация налогообложения, защита в налоговых спорах, консультации.",
            image: "/services/service3.jpg",
            details: [
                "Налоговое планирование и оптимизация",
                "Защита в налоговых спорах",
                "Налоговый due diligence",
                "Консультации по налоговому законодательству",
                "Сопровождение налоговых проверок"
            ]
        },
        {
            id: 3,
            title: "Недвижимость",
            description: "Сделки с недвижимостью, сопровождение сделок, разрешение споров.",
            image: "/services/service6.jpg",
            details: [
                "Сопровождение сделок с недвижимостью",
                "Юридическая экспертиза документов",
                "Разрешение земельных споров",
                "Оформление прав собственности",
                "Долевое строительство"
            ]
        },
        {
            id: 4,
            title: "Семейное право",
            description: "Разводы, раздел имущества, алименты, брачные договоры.",
            image: "/services/service5.jpg",
            details: [
                "Расторжение брака и раздел имущества",
                "Взыскание алиментов",
                "Брачные договоры и соглашения",
                "Споры о детях и опеке",
                "Установление отцовства"
            ]
        },
        {
            id: 5,
            title: "Наследственное право",
            description: "Оформление наследства, оспаривание завещаний, наследственные споры.",
            image: "/services/service7.jpg",
            details: [
                "Оформление наследства у нотариуса",
                "Оспаривание завещаний",
                "Разрешение наследственных споров",
                "Признание права на обязательную долю",
                "Восстановление сроков принятия наследства"
            ]
        },
        {
            id: 6,
            title: "Защита прав потребителей",
            description: "Взыскание убытков, защита от недобросовестных продавцов.",
            image: "/services/service2.jpg",
            details: [
                "Защита прав при покупке товаров и услуг",
                "Взыскание убытков и компенсаций",
                "Споры с туроператорами",
                "Защита при приобретении недвижимости",
                "Юридическое сопровождение в судах"
            ]
        },
    ];

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const serviceId = urlParams.get('service');
        if (serviceId) {
            const targetElement = document.getElementById(`service-${serviceId}`);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        }
    }, [location]);

    // появление секции
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // отслеживание темы
    useEffect(() => {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
        setTheme(currentTheme as "dark" | "light");

        const observer = new MutationObserver(() => {
            const t = document.documentElement.getAttribute("data-theme") || "dark";
            setTheme(t as "dark" | "light");
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => observer.disconnect();
    }, []);

    const handleContactClick = (serviceTitle: string) => {
        // Сохраняем выбранную услугу и триггерим событие
        sessionStorage.setItem('selectedService', serviceTitle);

        // Создаем кастомное событие, чтобы уведомить ContactSection
        window.dispatchEvent(new CustomEvent('serviceSelected', {
            detail: { service: serviceTitle }
        }));

        // Скроллим к форме внутри секции контактов
        const contactForm = document.querySelector('#contact form');
        if (contactForm) {
            contactForm.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        } else {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <section
            id="services-list"
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
                    <h2 className="text-[5rem] md:text-[7rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        our <span className="text-[var(--accent)]">expertises</span>
                    </h2>
                </div>

                {/* Список услуг в строчном формате */}
                <div className="space-y-8">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            id={`service-${service.id}`}
                            className={`relative group transition-all duration-700 ease-out border rounded-none overflow-hidden ${
                                visible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-8"
                            }`}
                            style={{
                                transitionDelay: `${index * 100}ms`,
                                borderColor: theme === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
                            }}
                        >
                            <div className="flex flex-col lg:flex-row">
                                {/* Изображение */}
                                <div className="lg:w-1/3 h-64 lg:h-auto">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                                            theme === "dark"
                                                ? "brightness-50 contrast-110 saturate-90"
                                                : "brightness-90 contrast-95 saturate-100"
                                        }`}
                                    />
                                </div>

                                {/* Контент */}
                                <div className="lg:w-2/3 p-8 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h3 className="text-3xl font-syne font-semibold mb-2">
                                                    {service.title}
                                                </h3>
                                                <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-4">
                                                    {service.description}
                                                </p>
                                            </div>
                                            <div className="text-[var(--accent)] text-4xl font-syne font-bold opacity-40 select-none ml-4">
                                                {String(service.id).padStart(2, "0")}
                                            </div>
                                        </div>

                                        {/* Детали услуги */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold mb-3! text-[var(--text-secondary)]">
                                                What we offer:
                                            </h4>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {service.details.map((detail, idx) => (
                                                    <li key={idx} className="flex items-center text-sm text-[var(--text-secondary)]">
                                                        <span className="w-1 h-1 bg-[var(--accent)] rounded-full mr-3"></span>
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Кнопка контакта */}
                                    <div className="flex justify-between items-center pt-6 border-t"
                                         style={{
                                             borderColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"
                                         }}>
                                        <button
                                            onClick={() => handleContactClick(service.title)}
                                            className="relative inline-flex items-center group/btn"
                                        >
                                            <div className="relative overflow-hidden">
                                                <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover/btn:-translate-y-full">
                                                    get consultation
                                                </div>
                                                <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover/btn:translate-y-[-100%]">
                                                    get consultation
                                                </div>
                                            </div>
                                            <img
                                                src="/arrow_details.svg"
                                                alt="arrow"
                                                className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1"
                                                style={{
                                                    filter: theme === "dark" ? "invert(1) brightness(2)" : "invert(0)",
                                                }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Нижняя линия */}
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
            </div>
        </section>
    );
};

export default ServicesPageSection;