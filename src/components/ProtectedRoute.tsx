import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // Wait for localStorage rehydration before deciding
  if (loading) {
    return (
      <div className="h-screen flex-center" style={{ flexDirection: 'column', gap: 'var(--space-4)', background: 'var(--color-bg-base)' }}>
        <Loader2 size={32} color="var(--color-brand-primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <p className="text-secondary text-sm">Loading…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not authenticated → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → go to dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
