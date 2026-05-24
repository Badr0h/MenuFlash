import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Bloque le rendu tant que l'état d'authentification n'est pas résolu
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Si pas authentifié, redirection vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role;

  // Vérification des rôles spécifiques si demandés
  if (requiredRole && userRole !== requiredRole) {
    if (userRole === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === 'CLIENT') {
      return <Navigate to="/menu/demo" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Rendu des routes imbriquées
  return <Outlet />;
};

export default ProtectedRoute;
