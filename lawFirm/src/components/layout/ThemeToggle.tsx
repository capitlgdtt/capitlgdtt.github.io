import React, { useState, useEffect } from 'react';
import { useI18n } from "../../hooks/useI18n.ts";

const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(true);
    const { t } = useI18n();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme ? savedTheme === 'dark' : systemPrefersDark;
        setIsDark(initialTheme);
        applyTheme(initialTheme);

        const handleThemeChange = (event: CustomEvent) => {
            setIsDark(event.detail.isDark);
        };

        window.addEventListener('themeChanged', handleThemeChange as EventListener);
        return () => window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    }, []);

    const applyTheme = (dark: boolean) => {
        const theme = dark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        applyTheme(newTheme);

        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { isDark: newTheme }
        }));
    };

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle-btn w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
        >
            {isDark ? (
                <img
                    src="/icons/sun.png"
                    alt="Light theme"
                    className="w-6 h-6"
                    style={{
                        filter: 'invert(1) brightness(2)'
                    }}
                />
            ) : (
                <img
                    src="/icons/moon.png"
                    alt="Dark theme"
                    className="w-6 h-6"
                />
            )}
        </button>
    );
};

export default ThemeToggle;