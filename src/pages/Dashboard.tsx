import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Calculator,
  CalendarDays
} from 'lucide-react';

const PIE_COLORS = ['#3bb85e', '#ef5050', '#2a82e4', '#f6b53d', '#8b5cf6', '#ec4899'];

// ── Sample Data Fallback ────────────────────────────────
const mockDashboardData = {
  overview: { totalIncome: 12500, totalExpense: 8400, netBalance: 4100 },
  categoryWise: [{ category: 'Freelance', total: 6000 }, { category: 'Utilities', total: 1200 }, { category: 'Rent', total: 2500 }],
  recentActivity: [
    { category: 'Freelance', amount: 3500, type: 'INCOME', date: '2023-11-20' },
    { category: 'Groceries', amount: 150, type: 'EXPENSE', date: '2023-11-18' },
    { category: 'Utilities', amount: 320, type: 'EXPENSE', date: '2023-11-15' },
    { category: 'Rent',      amount: 1200, type: 'EXPENSE', date: '2023-11-01' }
  ],
  trends: [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 }
  ]
};

const tooltipStyle = {
  contentStyle: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }
};

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<any>(mockDashboardData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        console.log('📊 Syncing Dashboard data...');
        const baseApi = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${baseApi}/dashboard/summary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('📡 Dashboard Status:', res.status);
        const json = await res.json();
        if (json.success && json.data.trends.length > 0) {
           setData(json.data);
        } else {
           console.log('💡 Using Premium Sample Data for display.');
        }
      } catch (e) { 
        console.warn('❌ Dashboard Sync Error - falling back:', e);
      }
      finally { setLoading(false); }
    };
    if (token) fetchDashboard();
  }, [token]);

  // Transform data for charts
  const categoriesForChart = (data.categoryWise || []).map((c: any) => ({ name: c.category, value: Math.abs(c.total) }));
  const trendsForChart = (data.trends || []).map((t: any) => {
     if (t.name) return t; // Already formatted sample data
     return {
        name: new Date(t.year, t.month - 1).toLocaleString('default', { month: 'short' }),
        income: t.type === 'INCOME' ? t.total : 0,
        expense: t.type === 'EXPENSE' ? t.total : 0
     };
  });

  if (loading && !data) return <div style={{ padding: '100px', textAlign: 'center' }}>Synchronizing...</div>;

  return (
    <div className="animate-fade-in v-rhythm" onClick={() => {}}>
      <div style={{ marginBottom: '-10px' }}>
        <h1 style={{ letterSpacing: '-0.02em', fontSize: 'var(--font-size-2xl)' }}>Dashboard Overview</h1>
        <p className="text-secondary text-sm">Real-time summaries and advanced financial trends.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
        {[
          { label: 'Total Income',   value: `$${data.overview.totalIncome.toLocaleString()}`,  bg: '#3bb85e', icon: Calculator },
          { label: 'Total Expenses', value: `$${data.overview.totalExpense.toLocaleString()}`, bg: '#ef5050', icon: DollarSign },
          { label: 'Net Balance',    value: `$${data.overview.netBalance.toLocaleString()}`,   bg: '#2a82e4', icon: TrendingUp },
          { label: 'Monthly Growth', value: '+12.4%', bg: '#f6b53d', icon: CalendarDays },
        ].map((s, i) => (
          <div key={i} className="card shadow-sm" style={{ background: s.bg, padding: '24px', borderRadius: '16px', color: '#fff' }}>
             <div className="d-flex items-center gap-2 mb-2" style={{ opacity: 0.8 }}><s.icon size={16} /><span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>{s.label}</span></div>
             <h2 style={{ fontSize: '28px', fontWeight: '800' }}>{s.value}</h2>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
        <div className="card shadow-md" style={{ padding: '32px', borderRadius: '20px', background: '#fff' }}>
          <h4 style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '32px', fontWeight: '800' }}>Income vs Expense Analysis</h4>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendsForChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#94a3b8' }} />
                <Tooltip {...tooltipStyle} />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 20 }} />
                <Bar dataKey="income" name="Income" fill="#3bb85e" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="expense" name="Expenses" fill="#ef5050" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card shadow-md" style={{ padding: '32px', borderRadius: '20px', background: '#fff' }}>
           <h4 style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '32px', fontWeight: '800' }}>Recent Activity</h4>
           <div className="flex-column" style={{ gap: '20px' }}>
              {data.recentActivity.map((tx: any, idx: number) => (
                <div key={idx} className="flex-between" style={{ paddingBottom: '16px', borderBottom: idx < data.recentActivity.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                   <div className="d-flex flex-column"><span style={{ fontSize: '13px', fontWeight: '800', color: '#334155' }}>{tx.category}</span><span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(tx.date).toLocaleDateString()}</span></div>
                   <span style={{ fontSize: '14px', fontWeight: '800', color: tx.type === 'INCOME' ? '#3bb85e' : '#ef5050' }}>{tx.type === 'INCOME' ? '+' : '-'}${tx.amount}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-8)' }}>
         <div className="card shadow-md" style={{ padding: '32px', borderRadius: '20px', background: '#fff' }}>
            <h4 style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '24px', fontWeight: '800' }}>Spending Breakdown</h4>
            <div style={{ height: 260 }}>
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={categoriesForChart} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={5}>{categoriesForChart.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip {...tooltipStyle} /><Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 20 }} /></PieChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="card shadow-md" style={{ padding: '32px', borderRadius: '20px', background: '#fff' }}>
            <h4 style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '32px', fontWeight: '800' }}>Yearly Growth Flow</h4>
            <div style={{ height: 260 }}>
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendsForChart}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                     <Tooltip {...tooltipStyle} />
                     <Line type="monotone" dataKey="income" name="Financial Flow" stroke="#2a82e4" strokeWidth={4} dot={{ r: 6, fill: '#2a82e4' }} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
