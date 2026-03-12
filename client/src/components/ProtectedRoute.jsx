import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        if (adminOnly) {
            return <Navigate to="/admin/login" />;
        }
        return <Navigate to="/login" />;
    }

    if (adminOnly && !user.isAdmin && user.role !== 'MAIN_ADMIN') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;
