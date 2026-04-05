import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Plus,
  Download,
  MoreVertical,
  X,
  CreditCard,
  Tag,
  Calendar as CalendarIcon
} from 'lucide-react';

const mockTransactions = [
  { _id: '1', date: '2023-11-20', type: 'INCOME', category: 'Freelance', amount: 3500 },
  { _id: '2', date: '2023-11-18', type: 'EXPENSE', category: 'Groceries', amount: 150 },
  { _id: '3', date: '2023-11-15', type: 'EXPENSE', category: 'Utilities', amount: 320 },
  { _id: '4', date: '2023-11-05', type: 'INCOME', category: 'Salary', amount: 5000 },
  { _id: '5', date: '2023-11-01', type: 'EXPENSE', category: 'Rent', amount: 1200 },
];

const Transactions: React.FC = () => {
  const { token, user } = useAuth();
  const [testData, setTestData] = useState<any[]>(mockTransactions);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);

  // ── FILTER STATES ──────────────────────────────────────────
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({ date: '', type: 'INCOME', category: '', amount: '' });

  const fetchRecords = async () => {
    try {
      console.log('🔄 Syncing transactions with backend...');
      // Build query params for filtering
      const params = new URLSearchParams();
      if (filterType !== 'ALL') params.append('type', filterType);
      if (filterCategory) params.append('category', filterCategory);

      const baseApi = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${baseApi}/records?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('📡 Backend response status:', res.status);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        console.log('✅ Data fetched successfully:', data.data.length, 'records');
        setTestData(data.data);
      } else {
        console.log('💡 Using Premium Sample Records for display.');
        setTestData(mockTransactions);
      }
    } catch (e) {
      console.warn('❌ Critical Fetch Error:', e);
      setTestData(mockTransactions);
    }
  };

  useEffect(() => { if (token) fetchRecords(); }, [token, filterType, filterCategory]);

  const handleSave = async () => {
    const amt = parseFloat(form.amount);
    const method = editingRow && editingRow._id.length > 10 ? 'PUT' : 'POST';
    const baseApi = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const url = (editingRow && editingRow._id.length > 10) ? `${baseApi}/records/${editingRow._id}` : `${baseApi}/records`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...form, amount: amt })
      });
      if (res.ok) fetchRecords();
    } catch (e) {
      if (editingRow) {
        setTestData(testData.map(r => r._id === editingRow._id ? { ...r, ...form, amount: amt } : r));
      } else {
        setTestData([{ _id: Date.now().toString(), ...form, amount: amt }, ...testData]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const baseApi = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${baseApi}/records/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchRecords();
    } catch (e) {
      setTestData(testData.filter(r => r._id !== id));
    }
    setActiveMenu(null);
  };

  const openEdit = (row: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRow(row);
    setForm({ date: row.date.split('T')[0], type: row.type, category: row.category, amount: Math.abs(row.amount).toString() });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const isAdmin = user?.role === 'ADMIN';

  // Client-side search filtration
  const filteredRows = testData.filter(r =>
    String(r.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in v-rhythm" onClick={() => setActiveMenu(null)}>
      <div className="flex-between items-center">
        <div>
          <h1 style={{ letterSpacing: '-0.02em', fontSize: 'var(--font-size-2xl)' }}>Transactions</h1>
          <p className="text-secondary text-sm">Powerful record management with premium filtering.</p>
        </div>
        <div className="d-flex gap-4">
          <button className="btn btn-secondary btn-lg" style={{ padding: '0.75rem 1.75rem' }}><Download size={18} /> Export</button>
          {isAdmin && (
            <button className="btn btn-primary btn-lg" onClick={() => { setEditingRow(null); setIsModalOpen(true); }} style={{ padding: '0.75rem 1.75rem' }}>
              <Plus size={18} /> Add Record
            </button>
          )}
        </div>
      </div>

      <div className="card shadow-md" style={{ background: '#fff', borderRadius: '16px', overflow: 'visible' }}>
        <div style={{ padding: '32px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div className="flex-1" style={{ position: 'relative', minWidth: 300 }}>
            <SearchIcon size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input type="text" placeholder="Search by description..." className="form-input" style={{ width: '100%', paddingLeft: 46, background: '#f8fafc' }} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="d-flex gap-3 items-center">
            <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8' }}>Type:</label>
            {['ALL', 'INCOME', 'EXPENSE'].map(t => (
              <button key={t} onClick={(e) => { e.stopPropagation(); setFilterType(t); }} style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '11px', fontWeight: '800',
                background: filterType === t ? 'var(--color-brand-primary)' : '#f8fafc',
                color: filterType === t ? '#fff' : '#64748b', cursor: 'pointer', border: 'none'
              }}>{t}</button>
            ))}
          </div>
          <div className="d-flex gap-3 items-center">
            <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8' }}>Category:</label>
            <select className="form-input" style={{ padding: '8px 12px', fontSize: '12px', background: '#f8fafc' }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Freelance">Freelance</option>
              <option value="Rent">Rent</option>
              <option value="Food">Food</option>
              <option value="Utilities">Utilities</option>
            </select>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f8fafc' }}>{['Date', 'Type', 'Category', 'Amount', ''].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row._id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                <td style={tdStyle}>{new Date(row.date).toLocaleDateString()}</td>
                <td style={tdStyle}><span style={{ fontWeight: '700', fontSize: '11px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>{row.type}</span></td>
                <td style={tdStyle}>{row.category}</td>
                <td style={tdStyle}><div style={{ fontWeight: '800', color: row.type === 'INCOME' ? '#10b981' : '#ef4444' }}>
                  {row.type === 'INCOME' ? `+$${row.amount}` : `-$${row.amount}`}
                </div></td>
                <td style={{ ...tdStyle, textAlign: 'right', position: 'relative' }}>
                  {isAdmin && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === row._id ? null : row._id); }} style={iconBtnStyle}><MoreVertical size={20} /></button>
                      {activeMenu === row._id && (
                        <div className="dropdown shadow-lg animate-fade-in" style={{ position: 'absolute', right: '40px', top: '10px', zIndex: 100 }}>
                          <button className="menu-item" onClick={(e) => openEdit(row, e)}>Edit Record</button>
                          <button className="menu-item danger" onClick={(e) => handleDelete(row._id, e)}>Delete</button>
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
            <div className="flex-between mb-8"><h3>{editingRow ? 'Update' : 'Post'} Record</h3><button onClick={() => setIsModalOpen(false)} style={iconBtnStyle}><X size={24} /></button></div>
            <div className="flex-column gap-6">
              <div className="form-group"><label className="form-label d-flex gap-2"><CreditCard size={15} /> Type</label><select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="INCOME">Income</option><option value="EXPENSE">Expense</option></select></div>
              <div className="form-group"><label className="form-label d-flex gap-2"><Tag size={15} /> Category</label><input type="text" className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
              <div className="form-group"><label className="form-label d-flex gap-2"><CalendarIcon size={15} /> Date</label><input type="date" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Amount ($)</label><input type="number" className="form-input" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
              <button className="btn btn-primary w-full py-4 mt-4" style={{ borderRadius: '12px' }} onClick={handleSave}>{editingRow ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SearchIcon = ({ size, style }: any) => <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

const thStyle: React.CSSProperties = { padding: '20px 24px', fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' };
const tdStyle: React.CSSProperties = { padding: '20px 24px', fontSize: '14px', color: '#475569' };
const iconBtnStyle: React.CSSProperties = { background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '8px' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalContentStyle: React.CSSProperties = { background: '#fff', width: '100%', maxWidth: 450, padding: 48, borderRadius: 24 };

export default Transactions;
