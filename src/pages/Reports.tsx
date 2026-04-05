import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';
import { Calendar, FileDown, Filter } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', income: 4200, expense: 2100 },
  { month: 'Feb', income: 3800, expense: 1900 },
  { month: 'Mar', income: 5100, expense: 3200 },
  { month: 'Apr', income: 4700, expense: 2800 },
  { month: 'May', income: 3900, expense: 4100 },
  { month: 'Jun', income: 5600, expense: 3000 },
  { month: 'Jul', income: 6200, expense: 3500 },
  { month: 'Aug', income: 5800, expense: 2900 },
  { month: 'Sep', income: 4400, expense: 3100 },
  { month: 'Oct', income: 5200, expense: 2700 },
  { month: 'Nov', income: 4900, expense: 2400 },
  { month: 'Dec', income: 6500, expense: 3800 },
];

const categoryBreakdown = [
  { category: 'Salary',     amount: 38000 },
  { category: 'Freelance',  amount: 8400  },
  { category: 'Investment', amount: 5200  },
  { category: 'Rent',       amount: 18000 },
  { category: 'Food',       amount: 4200  },
  { category: 'Utilities',  amount: 2100  },
];

const tooltipStyle = {
  contentStyle: {
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text-primary)',
    fontSize: '13px',
    boxShadow: 'var(--shadow-md)',
  },
  itemStyle: { color: 'var(--color-text-primary)' },
  labelStyle: { color: 'var(--color-text-secondary)' },
};

const Reports: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-12-31');

  const totalIncome  = monthlyData.reduce((s, d) => s + d.income, 0);
  const totalExpense = monthlyData.reduce((s, d) => s + d.expense, 0);
  const net = totalIncome - totalExpense;
  const savingsRate = ((net / totalIncome) * 100).toFixed(1);

  return (
    <div className="animate-fade-in flex-column" style={{ gap: '40px' }}>
      {/* Header */}
      <div className="flex-between items-center" style={{ marginBottom: '-var(--space-2)' }}>
        <div>
          <h1 style={{ letterSpacing: '-0.02em', fontSize: 'var(--font-size-2xl)' }}>Reports</h1>
          <p className="text-secondary text-sm" style={{ marginTop: '4px' }}>Date-range analytics and exportable summaries.</p>
        </div>
        <button className="btn btn-primary btn-lg" style={{ padding: '0.75rem 1.75rem' }}>
          <FileDown size={18} /> Export PDF
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="card shadow-sm" style={{ padding: '32px' }}>
        <div className="d-flex items-center gap-8 flex-wrap">
          <div className="d-flex items-center gap-3">
            <div style={{ padding: '10px', background: 'rgba(59,130,246,0.1)', borderRadius: '10px' }}>
              <Calendar size={20} color="var(--color-brand-primary)" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>
              Data Analysis Window
            </span>
          </div>
          <div className="d-flex items-center gap-6">
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="form-input"
                style={{ width: 180, background: '#f8fafc', padding: '10px 14px', borderRadius: '10px' }}
              />
            </div>
            <div style={{ color: '#cbd5e1', marginTop: 24, fontWeight: '700' }}>→</div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="form-input"
                style={{ width: 180, background: '#f8fafc', padding: '10px 14px', borderRadius: '10px' }}
              />
            </div>
          </div>
          <button className="btn btn-secondary btn-lg" style={{ marginTop: 24, padding: '10px 24px', borderRadius: '10px' }}>
            <Filter size={16} /> Apply Analysis
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-8)' }}>
        {[
          { label: 'Total Income',   value: `$${totalIncome.toLocaleString()}`,  color: '#3bb85e' },
          { label: 'Total Expenses', value: `$${totalExpense.toLocaleString()}`, color: '#ef5050' },
          { label: 'Net Savings',    value: `$${net.toLocaleString()}`,           color: '#2a82e4' },
          { label: 'Savings Rate',   value: `${savingsRate}%`,                   color: '#f6b53d' },
        ].map((s) => (
          <div key={s.label} className="card shadow-sm" style={{ padding: '24px' }}>
            <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800', marginBottom: '8px' }}>
              {s.label}
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>
              {s.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>

        {/* Bar Chart */}
        <div className="card shadow-sm" style={{ padding: '32px', height: 420 }}>
          <p style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '32px' }}>Monthly Income vs Expenses</p>
          <ResponsiveContainer width="100%" height="82%">
            <BarChart data={monthlyData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 30 }}
                formatter={(val) => <span style={{ color: '#64748b', fontSize: 12, fontWeight: '600' }}>{val}</span>}
              />
              <Bar dataKey="income" name="Income" fill="#3bb85e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#ef5050" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="card shadow-sm" style={{ padding: '32px', height: 420 }}>
          <p style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '32px' }}>Savings Trend</p>
          <ResponsiveContainer width="100%" height="82%">
            <LineChart
              data={monthlyData.map((d) => ({ ...d, savings: d.income - d.expense }))}
              margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 30 }} />
              <Line
                type="monotone"
                dataKey="savings"
                name="Net Savings"
                stroke="#2a82e4"
                strokeWidth={3}
                dot={{ r: 4, fill: '#2a82e4' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="card shadow-md" style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border-default)' }}>
          <p style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Category Allocation</p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border-default)' }}>
              {['Category', 'Amount', 'Share', 'Intensity'].map((h) => (
                <th key={h} style={{
                  padding: '20px 32px',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categoryBreakdown.map((row, i) => {
              const max = Math.max(...categoryBreakdown.map((r) => r.amount));
              const pct = ((row.amount / max) * 100).toFixed(0);
              return (
                <tr
                  key={row.category}
                  style={{
                    borderBottom: i < categoryBreakdown.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--color-bg-hover)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                >
                  <td style={{ padding: '24px 32px', fontSize: '14px', fontWeight: '700', color: '#334155' }}>
                    {row.category}
                  </td>
                  <td style={{ padding: '24px 32px', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                    ${row.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '24px 32px', fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
                    {pct}%
                  </td>
                  <td style={{ padding: '24px 32px', width: 280 }}>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'var(--gradient-brand)',
                        borderRadius: '10px',
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
