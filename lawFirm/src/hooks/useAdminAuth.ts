import { useState, useEffect } from 'react';
import { login } from '../services/adminService';

export const useAdminAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentAdmin, setCurrentAdmin] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const adminData = localStorage.getItem('admin_data');
        if (token && adminData) {
            setIsAuthenticated(true);
            setCurrentAdmin(JSON.parse(adminData));
        }
        setIsLoading(false);
    }, []);

    const loginUser = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await login(username, password);
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('admin_data', JSON.stringify(response.user));
            setIsAuthenticated(true);
            setCurrentAdmin(response.user);
            return true;
        } catch (error) {
            console.error('Login failed', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('admin_data');
        setIsAuthenticated(false);
        setCurrentAdmin(null);
    };

    return {
        isAuthenticated,
        isLoading,
        currentAdmin,
        login: loginUser,
        logout,
    };
};