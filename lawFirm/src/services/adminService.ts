import type { Admin, AdminFormData } from '../types';
import { admins as defaultAdmins } from '../data/admins';

// Ключ для localStorage
const STORAGE_KEY = 'admins_v1';

// Простая хэш-функция для демонстрации
//const hashPassword = (password: string): string => {
//    return btoa(password); // В реальном приложении bcrypt или аналоги
//};

// Получить всех администраторов
export const getAdmins = (): Admin[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }

        saveAdmins(defaultAdmins);
        return defaultAdmins;
    } catch (error) {
        console.error('Error loading admins:', error);
        return defaultAdmins;
    }
};

// Сохранить всех администраторов
export const saveAdmins = (admins: Admin[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(admins));
};

// Получить администратора по ID
export const getAdminById = (id: number): Admin | undefined => {
    const admins = getAdmins();
    return admins.find(admin => admin.id === id);
};

// Получить администратора по username
export const getAdminByUsername = (username: string): Admin | undefined => {
    const admins = getAdmins();
    return admins.find(admin => admin.username === username);
};

// Проверить логин
export const validateLogin = (username: string, password: string): Admin | null => {
    const admin = getAdminByUsername(username);

    if (!admin || !admin.isActive) return null;

    // В демо: пароль совпадает с username для всех пользователей
    if (password === username || (username === 'admin' && password === 'admin')) {
        // Обновляем lastLogin
        updateAdmin(admin.id, {
            lastLogin: new Date().toLocaleString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        });
        return admin;
    }

    return null;
};

// Создать нового администратора
export const createAdmin = (formData: AdminFormData): Admin => {
    const admins = getAdmins();

    // Проверяем уникальность username и email
    if (admins.some(a => a.username === formData.username)) {
        throw new Error('Username already exists');
    }

    if (admins.some(a => a.email === formData.email)) {
        throw new Error('Email already exists');
    }

    if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
    }

    const newAdmin: Admin = {
        id: generateId(admins),
        username: formData.username,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: '',
        isActive: true
    };

    admins.push(newAdmin);
    saveAdmins(admins);
    return newAdmin;
};

// Обновить администратора
export const updateAdmin = (id: number, adminData: Partial<Admin>): Admin | null => {
    const admins = getAdmins();
    const index = admins.findIndex(admin => admin.id === id);

    if (index === -1) return null;

    const updatedAdmin = { ...admins[index], ...adminData };
    admins[index] = updatedAdmin;
    saveAdmins(admins);
    return updatedAdmin;
};

// Удалить администратора (только если не superadmin)
export const deleteAdmin = (id: number): boolean => {
    const admins = getAdmins();
    const admin = admins.find(a => a.id === id);

    if (admin?.role === 'superadmin') {
        throw new Error('Cannot delete superadmin');
    }

    const filteredAdmins = admins.filter(admin => admin.id !== id);

    if (filteredAdmins.length === admins.length) return false;

    saveAdmins(filteredAdmins);
    return true;
};

// Изменить статус активности
export const toggleAdminStatus = (id: number): Admin | null => {
    const admin = getAdminById(id);
    if (!admin || admin.role === 'superadmin') return null;

    return updateAdmin(id, { isActive: !admin.isActive });
};

// Получить статистику
export const getAdminsStats = () => {
    const admins = getAdmins();
    return {
        total: admins.length,
        active: admins.filter(a => a.isActive).length,
        superadmins: admins.filter(a => a.role === 'superadmin').length,
        admins: admins.filter(a => a.role === 'admin').length,
        editors: admins.filter(a => a.role === 'editor').length
    };
};

// Генерация ID
const generateId = (admins: Admin[]): number => {
    const maxId = admins.reduce((max, admin) => Math.max(max, admin.id), 0);
    return maxId + 1;
};