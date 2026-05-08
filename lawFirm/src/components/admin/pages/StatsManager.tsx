import React, { useEffect, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { fetchStats, updateStat, createStat, deleteStat } from '../../../services/statsService';
import { Link } from "react-router-dom";

let nextTempId = -1;

const StatsManager: React.FC = () => {
    const { t, currentLanguage } = useI18n();
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const loadStats = async () => {
        setLoading(true);
        try {
            const data = await fetchStats();
            setStats(data);
        } catch (err) {
            console.error(err);
            setSaveMessage(t('admin.stats.loadError'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const getDisplayStats = () => {
        return stats.map(stat => ({
            id: stat.id,
            number: stat.number,
            hasPlus: stat.hasPlus,
            labelEn: stat.label_en,
            labelRu: stat.label_ru,
        }));
    };

    const updateStatNumber = (id: number | string, number: number) => {
        setStats(prev => prev.map(stat =>
            stat.id === id ? { ...stat, number } : stat
        ));
    };

    const updateStatHasPlus = (id: number | string, hasPlus: boolean) => {
        setStats(prev => prev.map(stat =>
            stat.id === id ? { ...stat, hasPlus } : stat
        ));
    };

    const updateStatLabelEn = (id: number | string, labelEn: string) => {
        setStats(prev => prev.map(stat =>
            stat.id === id ? { ...stat, label_en: labelEn } : stat
        ));
    };

    const updateStatLabelRu = (id: number | string, labelRu: string) => {
        setStats(prev => prev.map(stat =>
            stat.id === id ? { ...stat, label_ru: labelRu } : stat
        ));
    };

    const handleAddStat = () => {
        const tempId = nextTempId--;
        const newStat = {
            id: tempId,
            number: 0,
            hasPlus: false,
            label_en: '',
            label_ru: '',
        };
        setStats(prev => [...prev, newStat]);
    };

    const handleDeleteStat = async (id: number | string) => {
        const confirmed = window.confirm(t('admin.stats.deleteConfirm') || 'Удалить элемент?');
        if (!confirmed) return;

        if (typeof id === 'number' && id > 0) {
            try {
                await deleteStat(id);
                await loadStats(); // перезагружаем после удаления
            } catch (err) {
                console.error(err);
                alert(t('admin.stats.deleteError') || 'Ошибка удаления');
            }
        } else {
            // временная запись (id < 0) – удаляем локально
            setStats(prev => prev.filter(stat => stat.id !== id));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
            for (const stat of stats) {
                if (stat.id < 0) {
                    await createStat({
                        number: stat.number,
                        hasPlus: stat.hasPlus,
                        label_en: stat.label_en,
                        label_ru: stat.label_ru,
                    });
                } else {
                    await updateStat(stat.id, {
                        number: stat.number,
                        hasPlus: stat.hasPlus,
                        label_en: stat.label_en,
                        label_ru: stat.label_ru,
                    });
                }
            }
            await loadStats();
            setSaveMessage(t('admin.stats.saved'));
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('Error saving stats:', error);
            setSaveMessage(t('admin.stats.saveError'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        loadStats();
        setSaveMessage(t('admin.stats.resetSuccess'));
        setTimeout(() => setSaveMessage(''), 3000);
    };

    if (loading) {
        return (
            <section className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen flex items-center justify-center">
                <div>{t('common.loading')}</div>
            </section>
        );
    }

    return (
        <section
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden"
            style={{
                padding: "var(--container-padding)",
                paddingTop: "calc(var(--header-height) + 2rem)"
            }}
        >
            <div className="max-w-[1920px] mx-auto w-full">
                <div className="overflow-hidden mb-6">
                    <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-syne uppercase font-semibold whitespace-normal break-words leading-tight">
                        {t('admin.stats.title')}
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4 mb-6">
                    <Link to="/admin" className="relative inline-flex items-center group py-4">
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

                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={handleAddStat}
                        className="relative inline-flex items-center group py-4"
                    >
                        <div className="relative overflow-hidden">
                            <div className="text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:-translate-y-full">
                                {t('admin.stats.add')}
                            </div>
                            <div className="absolute left-0 top-full text-[var(--accent)] uppercase tracking-wide font-medium transition-transform duration-300 group-hover:translate-y-[-100%]">
                                {t('admin.stats.add')}
                            </div>
                        </div>
                        <img
                            src="/add.svg"
                            alt="add"
                            className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                            style={{
                                filter: "invert(54%) sepia(95%) saturate(1555%) hue-rotate(190deg) brightness(95%) contrast(90%)"
                            }}
                        />
                    </button>

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

                {saveMessage && (
                    <div className={`mb-6 p-4 rounded-none ${
                        saveMessage.includes('Error') || saveMessage.includes('ошибка')
                            ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                            : 'bg-green-500/20 text-green-500 border border-green-500/30'
                    }`}>
                        {saveMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                    {getDisplayStats().map((stat) => (
                        <div key={stat.id} className="border border-[var(--bg-secondary)] p-6 transition-all duration-300 hover:border-[var(--accent)]">
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

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                    {t('admin.stats.form.labelEn')}
                                </label>
                                <input
                                    type="text"
                                    value={stat.labelEn}
                                    onChange={(e) => updateStatLabelEn(stat.id, e.target.value)}
                                    className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                                    placeholder="English label"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                                    {t('admin.stats.form.labelRu')}
                                </label>
                                <input
                                    type="text"
                                    value={stat.labelRu}
                                    onChange={(e) => updateStatLabelRu(stat.id, e.target.value)}
                                    className="w-full bg-transparent border border-[var(--text-secondary)] px-4 py-3 focus:border-[var(--accent)] outline-none transition-colors"
                                    placeholder="Название на русском"
                                />
                            </div>

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

                            <div className="mt-4 pt-4 border-t border-[var(--bg-secondary)] text-center">
                                <div className="text-[1.5rem] sm:text-[2rem] font-bold text-[var(--accent)]">
                                    {stat.number}
                                    {stat.hasPlus && "+"}
                                </div>
                                <div className="text-[var(--text-secondary)] text-sm sm:text-base font-medium mt-1">
                                    {currentLanguage === 'en' ? stat.labelEn : stat.labelRu}
                                </div>
                            </div>

                            <div className="flex justify-center mt-4 pt-2">
                                <button
                                    onClick={() => handleDeleteStat(stat.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors text-sm uppercase tracking-wide font-medium"
                                >
                                    {t('admin.stats.delete')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsManager;