import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { User, ChevronDown } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <Sidebar />
      
      <div className="flex-1 d-flex flex-column" style={{ overflow: 'hidden' }}>
        {/* ── Top Header ─────────────────────────────────── */}
        <header style={{
          height: 64,
          background: '#ffffff',
          borderBottom: '1px solid var(--color-border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-8)',
          flexShrink: 0
        }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
            Finance Dashboard
          </h2>

          <div 
            onClick={() => navigate('/settings')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-3)', 
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
              <p style={{ fontSize: '13px', fontWeight: 'var(--font-weight-medium)', margin: 0 }}>
                Welcome, {user?.name || user?.email.split('@')[0]}
              </p>
            </div>
            <div style={{
              width: 32, height: 32,
              borderRadius: '50%',
              background: '#e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden'
            }}>
               {/* Generic avatar placeholder like image */}
               <User size={20} color="#64748b" />
            </div>
            <ChevronDown size={14} color="#94a3b8" />
          </div>
        </header>

        {/* ── Main Content Area ─────────────────────────── */}
        <main className="main-content" style={{ overflowY: 'auto', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
