import React, { useState, useEffect } from 'react';
import { useI18n } from "../../hooks/useI18n.ts";

const LanguageToggle: React.FC = () => {
    const { changeLanguage, isEnglish, t } = useI18n();
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark';
        setTheme(currentTheme);

        const observer = new MutationObserver(() => {
            const t = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark';
            setTheme(t);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => observer.disconnect();
    }, []);

    const toggleLanguage = () => {
        const newLanguage = isEnglish ? 'ru' : 'en';
        changeLanguage(newLanguage);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="language-toggle-btn w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label={isEnglish ? t('language.switchToRussian') : t('language.switchToEnglish')}
        >
            {isEnglish ? (
                <img
                    src="/icons/ru_lang.png"
                    alt="Russian"
                    className="w-6 h-6"
                    style={{
                        filter: theme === 'dark' ? 'invert(1) brightness(2)' : 'invert(0)'
                    }}
                />
            ) : (
                <img
                    src="/icons/en_lang.png"
                    alt="English"
                    className="w-6 h-6"
                    style={{
                        filter: theme === 'dark' ? 'invert(1) brightness(2)' : 'invert(0)'
                    }}
                />
            )}
        </button>
    );
};

export default LanguageToggle;