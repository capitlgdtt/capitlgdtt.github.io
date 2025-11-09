import React, { useState, useEffect } from 'react';

const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme ? savedTheme === 'dark' : systemPrefersDark;
        setIsDark(initialTheme);
        applyTheme(initialTheme);
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
    };

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle-btn w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            aria-label={isDark ? 'Light theme' : 'Dark theme'}
        >
            {isDark ? '☀️' : '🌙'}
        </button>
    );
};

export default ThemeToggle;
