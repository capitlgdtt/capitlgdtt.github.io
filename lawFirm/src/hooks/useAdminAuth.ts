import { useState, useEffect } from 'react';
import { validateLogin } from '../services/adminService';

export const useAdminAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentAdmin, setCurrentAdmin] = useState<any>(null);

    useEffect(() => {
        // Проверяем наличие токена и администратора в localStorage
        const token = localStorage.getItem('admin_token');
        const adminData = localStorage.getItem('admin_data');

        if (token && adminData) {
            try {
                const admin = JSON.parse(adminData);
                setIsAuthenticated(true);
                setCurrentAdmin(admin);
            } catch (error) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_data');
                setIsAuthenticated(false);
            }
        }
        setIsLoading(false);
    }, []);

    const login = (username: string, password: string): boolean => {
        const admin = validateLogin(username, password);

        if (admin) {
            const token = 'admin_token_' + Date.now() + '_' + admin.id;
            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_data', JSON.stringify(admin));
            setIsAuthenticated(true);
            setCurrentAdmin(admin);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        setIsAuthenticated(false);
        setCurrentAdmin(null);
    };

    return {
        isAuthenticated,
        isLoading,
        currentAdmin,
        login,
        logout
    };
};