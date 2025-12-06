import React from 'react';
import AdminRoute from "./AdminRoute.tsx";
import AdminLayout from "./AdminLayout.tsx";

interface AdminPageProps {
    children: React.ReactNode;
}

const AdminPage: React.FC<AdminPageProps> = ({ children }) => {
    return (
        <AdminRoute>
            <AdminLayout>
                {children}
            </AdminLayout>
        </AdminRoute>
    );
};

export default AdminPage;