import type { Application } from '../types';
import { applications as defaultApplications } from '../data/applications';
import {translateCategory} from "./blogService.ts";

// Ключ для localStorage
const STORAGE_KEY = 'applications_v1';

// Получить все заявки
export const getApplications = (): Application[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }

        // Если нет сохраненных данных, используем дефолтные
        saveApplications(defaultApplications);
        return defaultApplications;
    } catch (error) {
        console.error('Error loading applications:', error);
        return defaultApplications;
    }
};

// Сохранить все заявки
export const saveApplications = (applications: Application[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
};

// Получить заявку по ID
export const getApplicationById = (id: number): Application | undefined => {
    const applications = getApplications();
    return applications.find(app => app.id === id);
};

// Создать новую заявку (из формы контактов)
export const createApplication = (applicationData: Omit<Application, 'id' | 'createdAt' | 'status'>, language: 'en' | 'ru' = 'ru'): Application => {
    const applications = getApplications();

    // Преобразуем название услуги: сохраняем английскую версию как ключ
    let serviceKey = applicationData.service;

    // Если текущий язык русский, ищем английский эквивалент
    if (language === 'ru') {
        // Пытаемся найти обратный перевод из русского в английский
        const allCategories = [
            "Corporate Law", "Tax Law", "Real Estate", "Family Law",
            "Inheritance Law", "Consumer Rights Protection", "Other"
        ];

        const found = allCategories.find(enCat => {
            const ruCat = translateCategory(enCat, 'ru');
            return ruCat === applicationData.service;
        });

        if (found) {
            serviceKey = found;
        }
    }

    const newApplication: Application = {
        ...applicationData,
        service: serviceKey, // Сохраняем английский ключ
        id: generateId(applications),
        createdAt: new Date().toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }),
        status: 'new'
    };

    applications.push(newApplication);
    saveApplications(applications);
    return newApplication;
};
export const getServiceDisplayName = (serviceKey: string, language: 'en' | 'ru'): string => {
    return translateCategory(serviceKey, language);
};

// Обновить статус заявки
export const updateApplicationStatus = (id: number, status: 'new' | 'in-progress' | 'completed'): Application | null => {
    const applications = getApplications();
    const index = applications.findIndex(app => app.id === id);

    if (index === -1) return null;

    const updatedApplication = {
        ...applications[index],
        status
    };
    applications[index] = updatedApplication;
    saveApplications(applications);
    return updatedApplication;
};

// Удалить заявку
export const deleteApplication = (id: number): boolean => {
    const applications = getApplications();
    const filteredApplications = applications.filter(app => app.id !== id);

    if (filteredApplications.length === applications.length) return false;

    saveApplications(filteredApplications);
    return true;
};

// Получить заявки по статусу
export const getApplicationsByStatus = (status: 'new' | 'in-progress' | 'completed'): Application[] => {
    const applications = getApplications();
    return applications.filter(app => app.status === status);
};

// Получить статистику по заявкам
export const getApplicationsStats = () => {
    const applications = getApplications();
    return {
        total: applications.length,
        new: applications.filter(app => app.status === 'new').length,
        inProgress: applications.filter(app => app.status === 'in-progress').length,
        completed: applications.filter(app => app.status === 'completed').length
    };
};

// Генерация ID
const generateId = (applications: Application[]): number => {
    const maxId = applications.reduce((max, app) => Math.max(max, app.id), 0);
    return maxId + 1;
};