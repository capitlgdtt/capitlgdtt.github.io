import type { StatItem } from '../types';
import { statsData as defaultStats } from '../data/statistics';

const STORAGE_KEY = 'stats_v2';

// Получить всю статистику
export const getStats = (): StatItem[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
        saveStats(defaultStats);
        return defaultStats;
    } catch (error) {
        console.error('Error loading stats:', error);
        return defaultStats;
    }
};

// Получить статистику для отображения на текущем языке
export const getStatsForDisplay = (language: 'en' | 'ru') => {
    const stats = getStats();
    return stats.map(stat => ({
        id: stat.id,
        number: stat.number,
        hasPlus: stat.hasPlus,
        label: stat.translations[language]?.label || stat.translations.en.label
    }));
};

// Сохранить статистику
export const saveStats = (stats: StatItem[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

// Обновить статистику
export const updateStats = (stats: StatItem[]): boolean => {
    try {
        saveStats(stats);
        return true;
    } catch (error) {
        console.error('Error updating stats:', error);
        return false;
    }
};

// Обновить конкретный показатель
export const updateStatItem = (id: number, updates: Partial<StatItem>): StatItem[] | null => {
    try {
        const stats = getStats();
        const index = stats.findIndex(stat => stat.id === id);

        if (index === -1) return null;

        stats[index] = { ...stats[index], ...updates };
        saveStats(stats);
        return stats;
    } catch (error) {
        console.error('Error updating stat item:', error);
        return null;
    }
};

// Сбросить к значениям по умолчанию
export const resetStats = (): boolean => {
    try {
        saveStats(defaultStats);
        return true;
    } catch (error) {
        console.error('Error resetting stats:', error);
        return false;
    }
};

// Генерация ID (для создания новых показателей)
export const generateStatId = (): number => {
    const stats = getStats();
    const maxId = stats.reduce((max, stat) => Math.max(max, stat.id), 0);
    return maxId + 1;
};