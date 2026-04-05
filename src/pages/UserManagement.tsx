import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, MoreHorizontal, X, Shield } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { token, user: activeUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [form, setForm] = useState({ role: 'ANALYST' });

  // ── Backend Sync ──────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      const baseApi = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${baseApi}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (e) { console.error('Fetch error:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchRecords(); }, [token]);

  // Temporary function for lint-free fetch call (mapped to existing fetchUsers logic)
  const fetchRecords = fetchUsers;

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      const baseApi = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await fetch(`${baseApi}/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role })
      });
      fetchUsers();
    } catch (e) { console.error('Update error:', e); }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, clickEvent: React.MouseEvent) => {
    clickEvent.stopPropagation();
    try {
      const baseApi = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await fetch(`${baseApi}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchUsers();
    } catch (e) { console.error('Delete error:', e); }
    setActiveMenu(null);
  };

  const isAdmin = activeUser?.role === 'ADMIN';
  const filtered = users.filter((u) => {
    const emailStr = String(u.email || '').toLowerCase();
    return emailStr.includes(search.toLowerCase()) && (filterRole === 'all' || String(u.role || '').toLowerCase() === filterRole.toLowerCase());
  });

  return (
    <div className="animate-fade-in v-rhythm" onClick={() => setActiveMenu(null)}>
      <div className="flex-between items-center">
        <div>
          <h1 style={{ letterSpacing: '-0.02em', fontSize: 'var(--font-size-2xl)' }}>User Management</h1>
          <p className="text-secondary text-sm">System-level access control for admins.</p>
        </div>
      </div>

      <div className="card shadow-md" style={{ background: '#fff', borderRadius: '16px', overflow: 'visible' }}>
        <div style={{ padding: '24px 32px 40px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '20px' }}>
          <div style={{ position: 'relative', width: 400 }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input type="text" placeholder="Search system accounts..." className="form-input" style={{ width: '100%', paddingLeft: 46, background: '#f8fafc' }} value={search} onChange={val => setSearch(val.target.value)} />
          </div>
          <div className="d-flex gap-3">
            {['all', 'admin', 'analyst', 'viewer'].map(r => (
              <button key={r} onClick={(btnEvent) => { btnEvent.stopPropagation(); setFilterRole(r); }} style={{
                padding: '8px 18px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
                background: filterRole === r ? 'var(--color-brand-primary)' : '#f8fafc',
                color: filterRole === r ? '#fff' : '#64748b', border: 'none', cursor: 'pointer'
              }}>{r}</button>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}><tr>{['Member', 'Role', 'Joined', ''].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Syncing user data...</td></tr>
            ) : filtered.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                <td style={tdStyle}>
                  <div className="d-flex items-center gap-4">
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gradient-brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>{String(u.email || 'U').charAt(0).toUpperCase()}</div>
                    <div className="d-flex flex-column"><span style={{ fontWeight: '800', fontSize: '14px', color: '#1e293b' }}>{String(u.email || '').split('@')[0]}</span><span style={{ fontSize: '12px', color: '#94a3b8' }}>{u.email}</span></div>
                  </div>
                </td>
                <td style={tdStyle}><span className={`badge badge-${String(u.role || '').toLowerCase()}`} style={{ padding: '6px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '10px' }}>{u.role}</span></td>
                <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ ...tdStyle, textAlign: 'right', position: 'relative' }}>
                  {isAdmin && u._id !== activeUser?.id && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === u._id ? null : u._id); }} style={iconBtnStyle}><MoreHorizontal size={20} /></button>
                      {activeMenu === u._id && (
                        <div className="dropdown shadow-lg animate-fade-in" style={{ position: 'absolute', right: '40px', top: '10px' }}>
                          <button className="menu-item" onClick={(e) => { e.stopPropagation(); setEditingUser(u); setForm({ role: u.role }); setIsModalOpen(true); setActiveMenu(null); }}>Permissions</button>
                          <button className="menu-item danger" onClick={(e) => handleDelete(u._id, e)}>Suspend</button>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle} onClick={(e) => e.stopPropagation()}>
          <div className="card shadow-xl animate-fade-in" style={modalContentStyle}>
            <div className="flex-between mb-10"><h3>Admin Actions</h3><button onClick={() => setIsModalOpen(false)} style={iconBtnStyle}><X size={24} /></button></div>
            <div className="flex-column gap-6">
              <div className="form-group"><label className="form-label d-flex gap-2">Member Email</label><input type="email" className="form-input" value={editingUser?.email || ''} readOnly /></div>
              <div className="form-group"><label className="form-label d-flex gap-2"><Shield size={15} /> Change Role</label><select className="form-input" value={form.role} onChange={val => setForm({ ...form, role: val.target.value })}><option value="ADMIN">System Admin</option><option value="ANALYST">Finance Analyst</option><option value="VIEWER">Guest Viewer</option></select></div>
              <button className="btn btn-primary w-full py-4 mt-6" style={{ borderRadius: '12px' }} onClick={() => handleUpdateRole(editingUser._id, form.role)}>Sync Permissions</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle: React.CSSProperties = { padding: '20px 24px', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' };
const tdStyle: React.CSSProperties = { padding: '24px 24px', fontSize: '14px', color: '#475569' };
const iconBtnStyle: React.CSSProperties = { background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '10px' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalContentStyle: React.CSSProperties = { background: '#fff', width: '100%', maxWidth: 450, padding: 48, borderRadius: 24 };

export default UserManagement;
