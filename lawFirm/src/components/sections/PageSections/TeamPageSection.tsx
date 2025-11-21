import React, { useEffect, useRef, useState } from "react";
import {useI18n} from "../../../hooks/useI18n.ts";

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
    email: string;
    phone: string;
    experience: string;
    specialization: string[];
    description: string;
}

const TeamPageSection: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const ref = useRef<HTMLDivElement>(null);
    const { t, currentLanguage } = useI18n();

    // Константные данные на двух языках
    const teamMembers: Record<string, TeamMember[]> = {
        en: [
            {
                id: 1,
                name: "Phil Morrisson",
                role: "Founder & CEO",
                image: "/team/dmitry.jpg",
                email: "phil@company.com",
                phone: "+1 (555) 123-4567",
                experience: "15+ years",
                specialization: ["Corporate Law", "Mergers & Acquisitions", "International Law"],
                description: "Expert in corporate law with extensive experience in international business transactions."
            },
            {
                id: 2,
                name: "Frederik Johansson",
                role: "General Practice Lawyer",
                image: "/team/sergei.jpg",
                email: "frederik@company.com",
                phone: "+1 (555) 123-4568",
                experience: "12+ years",
                specialization: ["Civil Law", "Contract Law", "Dispute Resolution"],
                description: "Specialized in civil litigation and contract disputes with successful case history."
            },
            {
                id: 3,
                name: "John Wayne",
                role: "General Practice Lawyer",
                image: "/team/mikhail.jpg",
                email: "john@company.com",
                phone: "+1 (555) 123-4569",
                experience: "10+ years",
                specialization: ["Criminal Law", "Family Law", "Real Estate"],
                description: "Dedicated to providing comprehensive legal solutions for individuals and families."
            },
            {
                id: 4,
                name: "Jane Smith",
                role: "Senior Partner",
                image: "/team/anna.jpg",
                email: "jane@company.com",
                phone: "+1 (555) 123-4570",
                experience: "18+ years",
                specialization: ["Tax Law", "Business Law", "Intellectual Property"],
                description: "Leading expert in tax optimization and intellectual property protection."
            },
            {
                id: 5,
                name: "Robert Brown",
                role: "Legal Consultant",
                image: "/team/dmitry.jpg",
                email: "robert@company.com",
                phone: "+1 (555) 123-4571",
                experience: "8+ years",
                specialization: ["Employment Law", "Compliance", "Risk Management"],
                description: "Focused on employment law and corporate compliance strategies."
            },
            {
                id: 6,
                name: "Sarah Wilson",
                role: "Associate Lawyer",
                image: "/team/anna.jpg",
                email: "sarah@company.com",
                phone: "+1 (555) 123-4572",
                experience: "6+ years",
                specialization: ["Immigration Law", "Administrative Law", "Human Rights"],
                description: "Passionate about immigration law and protecting clients' rights."
            }
        ],
        ru: [
            {
                id: 1,
                name: "Фил Моррисон",
                role: "Основатель и Генеральный директор",
                image: "/team/dmitry.jpg",
                email: "phil@company.com",
                phone: "+1 (555) 123-4567",
                experience: "15+ лет",
                specialization: ["Корпоративное право", "Слияния и поглощения", "Международное право"],
                description: "Эксперт в области корпоративного права с обширным опытом международных бизнес-транзакций."
            },
            {
                id: 2,
                name: "Фредерик Йоханссон",
                role: "Юрист общей практики",
                image: "/team/sergei.jpg",
                email: "frederik@company.com",
                phone: "+1 (555) 123-4568",
                experience: "12+ лет",
                specialization: ["Гражданское право", "Договорное право", "Разрешение споров"],
                description: "Специализируется на гражданских судебных процессах и договорных спорах с успешной историей дел."
            },
            {
                id: 3,
                name: "Джон Уэйн",
                role: "Юрист общей практики",
                image: "/team/mikhail.jpg",
                email: "john@company.com",
                phone: "+1 (555) 123-4569",
                experience: "10+ лет",
                specialization: ["Уголовное право", "Семейное право", "Недвижимость"],
                description: "Посвящен предоставлению комплексных юридических решений для частных лиц и семей."
            },
            {
                id: 4,
                name: "Джейн Смит",
                role: "Старший партнер",
                image: "/team/anna.jpg",
                email: "jane@company.com",
                phone: "+1 (555) 123-4570",
                experience: "18+ лет",
                specialization: ["Налоговое право", "Бизнес-право", "Интеллектуальная собственность"],
                description: "Ведущий эксперт в области налоговой оптимизации и защиты интеллектуальной собственности."
            },
            {
                id: 5,
                name: "Роберт Браун",
                role: "Юридический консультант",
                image: "/team/dmitry.jpg",
                email: "robert@company.com",
                phone: "+1 (555) 123-4571",
                experience: "8+ лет",
                specialization: ["Трудовое право", "Комплаенс", "Управление рисками"],
                description: "Сосредоточен на трудовом праве и корпоративных стратегиях соответствия."
            },
            {
                id: 6,
                name: "Сара Уилсон",
                role: "Младший юрист",
                image: "/team/anna.jpg",
                email: "sarah@company.com",
                phone: "+1 (555) 123-4572",
                experience: "6+ лет",
                specialization: ["Иммиграционное право", "Административное право", "Права человека"],
                description: "Увлечена иммиграционным правом и защитой прав клиентов."
            }
        ]
    };

    // Получаем членов команды на текущем языке
    const currentMembers = teamMembers[currentLanguage] || teamMembers.en;

    // появление секции
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.17 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // отслеживание темы
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
                    {currentMembers.map((member) => (
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
                                            {member.specialization.map((spec, idx) => (
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

export default TeamPageSection;