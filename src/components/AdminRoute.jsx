import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen text="Verifying access..." />;
  }

  return user && user.role === 'admin' ? children : <Navigate to="/auth" />;
};

export default AdminRoute;