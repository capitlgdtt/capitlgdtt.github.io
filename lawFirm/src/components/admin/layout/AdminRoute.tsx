import React from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from "../../common/LoadingSpinner.tsx";
import {useAdminAuth} from "../../../hooks/useAdminAuth.ts";

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAdminAuth();

    if (isLoading) {
        return <div>
            <LoadingSpinner />
        </div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;