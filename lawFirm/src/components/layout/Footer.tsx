import React from "react";
import { useI18n } from "../../hooks/useI18n.ts";
import { useNavigate } from "react-router-dom";

interface Office {
    city: string;
    address: string;
    phone: string;
}

interface SocialLink {
    name: string;
    url: string;
}

const Footer: React.FC = () => {
    const { t, currentLanguage } = useI18n();
    const navigate = useNavigate();

    // Константные данные на двух языках
    const officesData: Record<string, Office[]> = {
        en: [
            { city: "Moscow", address: "Pravovaya st., 15, 115191", phone: "+7 (495) 123-45-67" },
            { city: "Saint Petersburg", address: "Nevsky pr., 100, 191186", phone: "+7 (812) 456-78-90" },
            { city: "Yekaterinburg", address: "Yuridicheskaya st., 25, 620014", phone: "+7 (343) 789-01-23" },
            { city: "Kazan", address: "Kremlyovskaya st., 35, 420111", phone: "+7 (843) 234-56-78" }
        ],
        ru: [
            { city: "Москва", address: "ул. Правовая, 15, 115191", phone: "+7 (495) 123-45-67" },
            { city: "Санкт-Петербург", address: "Невский пр., 100, 191186", phone: "+7 (812) 456-78-90" },
            { city: "Екатеринбург", address: "ул. Юридическая, 25, 620014", phone: "+7 (343) 789-01-23" },
            { city: "Казань", address: "ул. Кремлевская, 35, 420111", phone: "+7 (843) 234-56-78" }
        ]
    };

    const socialLinksData: Record<string, SocialLink[]> = {
        en: [
            { name: "VKontakte", url: "#" },
            { name: "Telegram", url: "#" },
            { name: "WhatsApp", url: "#" },
            { name: "YouTube", url: "#" }
        ],
        ru: [
            { name: "ВКонтакте", url: "#" },
            { name: "Telegram", url: "#" },
            { name: "WhatsApp", url: "#" },
            { name: "YouTube", url: "#" }
        ]
    };

    // Получаем данные на текущем языке
    const offices = officesData[currentLanguage] || officesData.en;
    const socialLinks = socialLinksData[currentLanguage] || socialLinksData.en;

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer
            className="bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--bg-secondary)] transition-colors duration-300 pb-6"
            style={{ fontFamily: "'Syne', sans-serif" }}
        >
            <div className="container py-16">

                {/* Верхняя линия */}
                <div className="h-[1px] bg-[var(--text-secondary)]/20 mb-8"></div>

                {/* Логотип и описание */}
                <div className="flex flex-col items-start mb-8">
                    <button
                        onClick={handleLogoClick}
                        className="font-bold text-3xl md:text-4xl tracking-tight text-[var(--text-primary)] mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        CompanyName
                    </button>
                    <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed max-w-lg">
                        {t('footer.companySlogan')}
                    </p>
                </div>

                {/* Линия */}
                <div className="h-[1px] bg-[var(--text-secondary)]/20 my-6"></div>

                {/* Города и офисы */}
                <div className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[var(--text-primary)] mb-3 mt-3">
                    {t('footer.citiesAndOffices')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {offices.map((office, index) => (
                        <div key={index} className="space-y-1.5">
                            <div className="text-lg font-semibold text-[var(--text-primary)]">
                                {office.city}
                            </div>
                            <p className="text-[var(--text-secondary)] text-base leading-6">
                                {office.address}
                            </p>
                            <a
                                href={`tel:${office.phone.replace(/\s|\(|\)|-/g, "")}`}
                                className="inline-block transition-all duration-300 hover:opacity-80"
                            >
                                <p className="text-[var(--text-secondary)] text-base underline underline-offset-2 decoration-[var(--text-secondary)] hover:decoration-[var(--accent)] hover:text-[var(--accent)]">
                                    {office.phone}
                                </p>
                            </a>
                        </div>
                    ))}
                </div>

                {/* Линия между Office и Social */}
                <div className="h-[1px] bg-[var(--text-secondary)]/20 my-6"></div>

                {/* Социальные сети */}
                <div className="text-sm font-semibold uppercase tracking-widest text-[var(--text-primary)] mb-3 mt-3">
                    {t('footer.socialNetworks')}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.url}
                            className="text-[var(--text-secondary)] text-base transition-all duration-300 hover:text-[var(--accent)] relative inline-block pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[var(--accent)] after:transition-all after:duration-300"
                        >
                            {social.name}
                        </a>
                    ))}
                </div>

                {/* Нижняя линия и копирайт */}
                <div className="h-[1px] bg-[var(--text-secondary)]/20 mt-4 mb-6"></div>

                <p className="text-[var(--text-secondary)] text-sm">
                    &copy; 2024 CompanyName.{" "}
                    <a
                        href="/copyright"
                        className="underline underline-offset-2 decoration-[var(--text-secondary)] hover:decoration-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
                    >
                        {t('footer.copyright')}
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;