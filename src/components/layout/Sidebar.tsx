import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowRightLeft,
  BarChart3,
  Settings,
  Users,
  LogOut,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';

export const Sidebar: React.FC = () => {
  const { hasPermission, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* ── Logo ────────────────────────────────────────── */}
      <div className="sidebar-header">
        <div className="d-flex items-center gap-3">
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <TrendingUp size={22} color="#fff" />
          </div>
          <h2 className="sidebar-logo">FinanceDashboard</h2>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────── */}
      <nav className="nav-menu">
        
        {hasPermission(['ADMIN', 'ANALYST', 'VIEWER']) && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
        )}

        {hasPermission(['ADMIN', 'ANALYST']) && (
          <NavLink
            to="/transactions"
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <ArrowRightLeft size={20} />
            <span>Transactions</span>
          </NavLink>
        )}

        {hasPermission(['ADMIN', 'ANALYST']) && (
          <NavLink
            to="/reports"
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <BarChart3 size={20} />
            <span>Reports</span>
          </NavLink>
        )}

        {hasPermission(['ADMIN']) && (
          <NavLink
            to="/users"
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <Users size={20} />
            <span>User Management</span>
          </NavLink>
        )}

        <NavLink
          to="/settings"
          className={({ isActive }) => clsx('nav-item', isActive && 'active')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* ── Footer ──────────────────────────────────────── */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
