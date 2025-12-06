import React, { useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { getStats, updateStats, resetStats } from '../../../services/statsService.ts';
import {Link} from "react-router-dom";

const StatsManager: React.FC = () => {
    const { t, currentLanguage } = useI18n();
    const [stats, setStats] = useState(getStats());
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    // Функция для получения отображаемых данных
    const getDisplayStats = () => {
        return stats.map(stat => ({
            id: stat.id,
            number: stat.number,
            hasPlus: stat.hasPlus || false,
            label: stat.translations[currentLanguage as 'en' | 'ru']?.label || stat.translations.en.label
        }));
    };

    // Обновление числа
    const updateStatNumber = (id: number, number: number) => {
        setStats(prev => prev.map(stat =>
            stat.id === id ? { ...stat, number } : stat
        ));
    };

    // Обновление hasPlus
    const updateStatHasPlus = (id: number, hasPlus: boolean) => {
        setStats(prev => prev.map(stat =>
            stat.id === id ? { ...stat, hasPlus } : stat
        ));
    };

    // Обновление перевода метки
    const updateStatLabel = (id: number, label: string) => {
        setStats(prev => prev.map(stat => {
            if (stat.id === id) {
                return {
                    ...stat,
                    translations: {
                        ...stat.translations,
                        [currentLanguage]: {
                            label
                        }
                    }
                };
            }
            return stat;
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');

        try {
            const success = updateStats(stats);
            if (success) {
                setSaveMessage(t('admin.stats.saved'));
                setTimeout(() => setSaveMessage(''), 3000);
            } else {
                setSaveMessage(t('admin.stats.saveError'));
            }
        } catch (error) {
            console.error('Error saving stats:', error);
            setSaveMessage(t('admin.stats.saveError'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (window.confirm(t('admin.stats.resetConfirm'))) {
            const success = resetStats();
            if (success) {
                setStats(getStats());
                setSaveMessage(t('admin.stats.resetSuccess'));
                setTimeout(() => setSaveMessage(''), 3000);
            }
        }
    };

    return (
        <section
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{
                padding: "var(--container-padding)",
                paddingTop: "calc(var(--header-height) + 2rem)"
            }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                {/* Заголовок */}
                <div className="overflow-hidden mb-6">
                    <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {t('admin.stats.title')}
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4 mb-6">
                    {/* Кнопка возврата */}
                    <Link
                        to="/admin"
                        className="relative inline-flex items-center group py-4"
                    >
                        <img
                            src="/arrow_details.svg"
                            alt="arrow"
                            className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1"
                            style={{
                                filter: "invert(54%) sepia(95%) saturate(1555%) hue-rotate(190deg) brightness(95%) contrast(90%)",
                                transform: 'scaleX(-1)'
                            }}
                        />
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {t('admin.backToDashboard')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.backToDashboard')}
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Сообщение об успехе/ошибке */}
                {saveMessage && (
                    <div className={`mb-6 p-4 rounded-none ${
                        saveMessage.includes('Error')
                            ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                            : 'bg-green-500/20 text-green-500 border border-green-500/30'
                    }`}>
                        {saveMessage}
                    </div>
                )}

                {/* Форма редактирования статистики */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                    {getDisplayStats().map((stat) => (
                        <div key={stat.id} className="border border-[var(--bg-secondary)] p-6 transition-all duration-300 hover:border-[var(--accent)]">
                            {/* Числовое значение */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                    {t('admin.stats.form.number')}
                                </label>
                                <input
                                    type="number"
                                    value={stat.number}
                                    onChange={(e) => updateStatNumber(stat.id, parseInt(e.target.value) || 0)}
                                    className="w-full text-center text-[2rem] font-bold text-[var(--accent)] bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                                />
                            </div>

                            {/* Название показателя */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                    {t('admin.stats.form.label')}
                                </label>
                                <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) => updateStatLabel(stat.id, e.target.value)}
                                    className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors text-center"
                                    placeholder={t('admin.stats.form.labelPlaceholder')}
                                />
                            </div>

                            {/* Плюсик */}
                            <div className="flex items-center justify-center">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={stat.hasPlus}
                                        onChange={(e) => updateStatHasPlus(stat.id, e.target.checked)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-[var(--text-secondary)]">
                                        {t('admin.stats.form.hasPlus')}
                                    </span>
                                </label>
                            </div>

                            {/* Предпросмотр */}
                            <div className="mt-4 pt-4 border-t border-[var(--bg-secondary)] text-center">
                                <div className="text-[1.5rem] sm:text-[2rem] font-bold text-[var(--accent)]">
                                    {stat.number}
                                    {stat.hasPlus && "+"}
                                </div>
                                <div className="text-[var(--text-secondary)] text-sm sm:text-base font-medium mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Кнопки действий */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="relative inline-flex items-center group py-4 disabled:opacity-50"
                    >
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {isSaving ? t('admin.stats.saving') : t('admin.stats.save')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {isSaving ? t('admin.stats.saving') : t('admin.stats.save')}
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={handleReset}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase tracking-wide font-medium py-4 border border-[var(--text-secondary)] hover:border-[var(--accent)] px-8"
                    >
                        {t('admin.stats.reset')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default StatsManager;