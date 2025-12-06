import React from 'react';

interface LanguageTabsProps {
    currentLanguage: 'en' | 'ru';
    onLanguageChange: (lang: 'en' | 'ru') => void;
}

const LanguageTabs: React.FC<LanguageTabsProps> = ({ currentLanguage, onLanguageChange }) => {

    return (
        <div className="flex border-b border-[var(--bg-secondary)] mb-6">
            <button
                className={`px-6 py-3 font-medium transition-colors ${
                    currentLanguage === 'ru'
                        ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                onClick={() => onLanguageChange('ru')}
            >
                Русский
            </button>
            <button
                className={`px-6 py-3 font-medium transition-colors ${
                    currentLanguage === 'en'
                        ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                onClick={() => onLanguageChange('en')}
            >
                English
            </button>
        </div>
    );
};

export default LanguageTabs;