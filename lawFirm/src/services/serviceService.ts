import type { Service } from '../types';
import { services as defaultServices } from '../data/services';

// Ключ для localStorage
const STORAGE_KEY = 'services_v3';

// Получить все услуги
export const getServices = (): Service[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }

        // Если нет сохраненных данных, используем дефолтные
        saveServices(defaultServices);
        return defaultServices;
    } catch (error) {
        console.error('Error loading services:', error);
        return defaultServices;
    }
};

// Сохранить все услуги
export const saveServices = (services: Service[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
};

// Получить услугу по ID
export const getServiceById = (id: number): Service | undefined => {
    const services = getServices();
    return services.find(service => service.id === id);
};

// Создать новую услугу
export const createService = (serviceData: Omit<Service, 'id'>): Service => {
    const services = getServices();

    const newService: Service = {
        ...serviceData,
        id: generateId(services)
    };

    services.push(newService);
    saveServices(services);
    return newService;
};

// Обновить услугу
export const updateService = (id: number, serviceData: Partial<Service>): Service | null => {
    const services = getServices();
    const index = services.findIndex(service => service.id === id);

    if (index === -1) return null;

    const updatedService = { ...services[index], ...serviceData };
    services[index] = updatedService;
    saveServices(services);
    return updatedService;
};

// Удалить услугу
export const deleteService = (id: number): boolean => {
    const services = getServices();
    const filteredServices = services.filter(service => service.id !== id);

    if (filteredServices.length === services.length) return false;

    saveServices(filteredServices);
    return true;
};

// Генерация ID
const generateId = (services: Service[]): number => {
    const maxId = services.reduce((max, service) => Math.max(max, service.id), 0);
    return maxId + 1;
};

// Получить услуги для отображения на текущем языке
export const getServicesForDisplay = (language: 'en' | 'ru'): Array<{
    id: number;
    title: string;
    description: string;
    image: string;
    details: string[];
}> => {
    const services = getServices();
    return services.map(service => {
        const translation = service.translations[language] || service.translations.en;
        return {
            id: service.id,
            title: translation.title,
            description: translation.description,
            image: service.image,
            details: translation.details
        };
    });
};