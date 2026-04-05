import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import Reports from '../pages/Reports';
import UserManagement from '../pages/UserManagement';
import Settings from '../pages/Settings';
import Login from '../pages/Login';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<MainLayout />}>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard accessible by ALL: Admin, Analyst, Viewer */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'ANALYST', 'VIEWER']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Transactions accessible by Admin, Analyst */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'ANALYST']} />}>
          <Route path="/transactions" element={<Transactions />} />
        </Route>

        {/* Reports accessible by Admin, Analyst */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'ANALYST']} />}>
          <Route path="/reports" element={<Reports />} />
        </Route>

        {/* User Management ONLY accessible by Admin */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/users" element={<UserManagement />} />
        </Route>

        {/* Settings accessible by ALL */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'ANALYST', 'VIEWER']} />}>
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
