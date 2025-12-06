import type {TeamMember} from "../types";
import {translateCategory} from "./blogService.ts";
import { teamMembers as defaultTeamMembers } from '../data/teamMembers.ts';

// Ключ для localStorage
const STORAGE_KEY = 'team_members_v2';

// Получить всех членов команды
export const getTeamMembers = (): TeamMember[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }

        // Если нет сохраненных данных, используем дефолтные
        saveTeamMembers(defaultTeamMembers);
        return defaultTeamMembers;
    } catch (error) {
        console.error('Error loading team members:', error);
        return defaultTeamMembers;
    }
};

// Сохранить всех членов команды
export const saveTeamMembers = (members: TeamMember[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
};

// Получить члена команды по ID
export const getTeamMemberById = (id: number): TeamMember | undefined => {
    const members = getTeamMembers();
    return members.find(member => member.id === id);
};

// Создать нового члена команды
export const createTeamMember = (memberData: Omit<TeamMember, 'id'>): TeamMember => {
    const members = getTeamMembers();
    const newMember: TeamMember = {
        ...memberData,
        id: generateId(members)
    };

    members.push(newMember);
    saveTeamMembers(members);
    return newMember;
};

// Обновить члена команды
export const updateTeamMember = (id: number, memberData: Partial<TeamMember>): TeamMember | null => {
    const members = getTeamMembers();
    const index = members.findIndex(member => member.id === id);

    if (index === -1) return null;

    const updatedMember = { ...members[index], ...memberData };
    members[index] = updatedMember;
    saveTeamMembers(members);
    return updatedMember;
};

// Удалить члена команды
export const deleteTeamMember = (id: number): boolean => {
    const members = getTeamMembers();
    const filteredMembers = members.filter(member => member.id !== id);

    if (filteredMembers.length === members.length) return false;

    saveTeamMembers(filteredMembers);
    return true;
};

// Генерация ID
const generateId = (members: TeamMember[]): number => {
    const maxId = members.reduce((max, member) => Math.max(max, member.id), 0);
    return maxId + 1;
};

// Функции для перевода и отображения
export const translateTeamMember = (member: TeamMember, language: 'en' | 'ru') => {
    const translation = member.translations[language] || member.translations.en;
    return {
        ...member,
        name: translation.name,
        role: translation.role,
        description: translation.description
    };
};

export const translateSpecialization = (specialization: string[], language: 'en' | 'ru'): string[] => {
    return specialization.map(cat => translateCategory(cat, language));
};

// Получить опыт на нужном языке
export const translateExperience = (experience: string, language: 'en' | 'ru'): string => {
    // Простая замена
    if (language === 'ru') {
        return experience.replace('years', 'лет').replace('year', 'год');
    }
    return experience.replace('лет', 'years').replace('год', 'year');
};

export const getTeamMembersForDisplay = (language: 'en' | 'ru'): Array<{
    id: number;
    name: string;
    role: string;
    description: string;
    image: string;
    email: string;
    phone: string;
    experience: string;
    specialization: string[];
}> => {
    const members = getTeamMembers();
    return members.map(member => {
        const translation = member.translations[language] || member.translations.en;
        const translatedSpecs = member.specialization.map(cat =>
            translateCategory(cat, language)
        );
        const translatedExp = translateExperience(member.experience, language);

        return {
            id: member.id,
            name: translation.name,
            role: translation.role,
            description: translation.description,
            image: member.image,
            email: member.email,
            phone: member.phone,
            experience: translatedExp,
            specialization: translatedSpecs
        };
    });
};
export const getLimitedTeamMembersForDisplay = (language: 'en' | 'ru', limit: number = 4) => {
    const allMembers = getTeamMembersForDisplay(language);
    return allMembers.slice(0, limit);
};
