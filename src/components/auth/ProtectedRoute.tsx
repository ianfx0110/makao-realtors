import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'renter' | 'landlord' | 'buyer' | 'seller')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to signin if not authenticated
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If authenticated but role not allowed, redirect to their specific dashboard
    const dashboardMap: Record<string, string> = {
      admin: '/admin',
      renter: '/renter',
      landlord: '/landlord',
      buyer: '/buyer',
      seller: '/seller'
    };
    
    console.warn(`Access denied for role: ${user.role}. Allowed roles: ${allowedRoles.join(', ')}`);
    return <Navigate to={dashboardMap[user.role] || '/'} replace />;
  }

  return <>{children}</>;
};
