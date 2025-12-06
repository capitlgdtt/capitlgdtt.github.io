import type { Admin } from '../types';

export const admins: Admin[] = [
    {
        id: 1,
        username: "admin",
        email: "admin@company.com",
        role: "superadmin",
        createdAt: "2024-01-01",
        lastLogin: "2024-01-15 14:30",
        isActive: true
    },
    {
        id: 2,
        username: "manager",
        email: "manager@company.com",
        role: "admin",
        createdAt: "2024-01-10",
        lastLogin: "2024-01-14 11:20",
        isActive: true
    },
    {
        id: 3,
        username: "editor",
        email: "editor@company.com",
        role: "editor",
        createdAt: "2024-01-12",
        lastLogin: "2024-01-13 09:45",
        isActive: true
    }
];