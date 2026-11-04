import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen text="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    let loginPath = '/login';
    if (location.pathname.startsWith('/admin')) loginPath = '/login/admin';
    else if (location.pathname.startsWith('/seller')) loginPath = '/login/seller';
    else if (location.pathname.startsWith('/dashboard')) loginPath = '/login/user';

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If authenticated but unauthorized role, redirect to appropriate home or dashboard
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'seller' || user.role === 'shop') return <Navigate to="/seller" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
