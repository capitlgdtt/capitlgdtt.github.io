import type { StatItem } from '../types';

export const statsData: StatItem[] = [
    {
        id: 1,
        number: 200,
        hasPlus: true,
        translations: {
            en: { label: "Clients" },
            ru: { label: "Клиентов" }
        }
    },
    {
        id: 2,
        number: 8,
        hasPlus: false,
        translations: {
            en: { label: "Years of experience" },
            ru: { label: "Лет опыта" }
        }
    },
    {
        id: 3,
        number: 22,
        hasPlus: false,
        translations: {
            en: { label: "Lawyers" },
            ru: { label: "Юристов" }
        }
    },
    {
        id: 4,
        number: 15,
        hasPlus: false,
        translations: {
            en: { label: "Countries of presence" },
            ru: { label: "Стран присутствия" }
        }
    },
    {
        id: 5,
        number: 72,
        hasPlus: true,
        translations: {
            en: { label: "Projects per year" },
            ru: { label: "Проектов в год" }
        }
    }
];