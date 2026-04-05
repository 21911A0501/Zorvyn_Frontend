import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Shield, Bell, Palette, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    username: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const roleBadgeClass =
    user?.role === 'ADMIN'
      ? 'badge badge-admin'
      : user?.role === 'ANALYST'
      ? 'badge badge-analyst'
      : 'badge badge-viewer';

  return (
    <div className="animate-fade-in flex-column" style={{ gap: '40px' }}>
      {/* Header */}
      {/* Header */}
      <div style={{ marginBottom: '-var(--space-4)' }}>
        <h1 style={{ letterSpacing: '-0.02em', fontSize: 'var(--font-size-2xl)' }}>Profile Settings</h1>
        <p className="text-secondary text-sm" style={{ marginTop: '4px' }}>Manage your account preferences and security.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px', alignItems: 'start' }}>

        {/* Left — Profile Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Avatar & identity */}
          {/* Avatar & identity */}
          <div className="card shadow-sm" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: '50%',
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: 32,
              fontWeight: '800',
              color: '#fff',
              boxShadow: 'var(--shadow-glow-brand)',
            }}>
              {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
              {user?.name || user?.email.split('@')[0]}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
              {user?.email}
            </p>
            <span className={roleBadgeClass} style={{ display: 'inline-flex', padding: '6px 16px', borderRadius: '8px' }}>
              {user?.role}
            </span>
          </div>

          {/* Quick nav */}
          {[
            { icon: User,    label: 'Profile Info', active: true },
            { icon: Lock,    label: 'Security', active: false },
            { icon: Bell,    label: 'Notifications', active: false },
            { icon: Palette, label: 'Appearance', active: false },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  background: item.active ? 'rgba(59,130,246,0.1)' : '#fff',
                  border: `1px solid ${item.active ? 'var(--color-brand-primary)' : 'var(--color-border-default)'}`,
                  color: item.active ? 'var(--color-brand-primary)' : '#64748b',
                  fontSize: '14px',
                  fontWeight: '700',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: item.active ? 'none' : 'var(--shadow-sm)',
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right — Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

          {/* Profile Section */}
          <div className="card shadow-md" style={{ padding: '32px 40px', background: '#fff', borderRadius: '16px' }}>
            <div className="d-flex items-center gap-3 mb-10" style={{ borderBottom: '1px solid var(--color-border-default)', paddingBottom: '24px' }}>
              <div style={{ padding: '10px', background: 'rgba(59,130,246,0.1)', borderRadius: '10px' }}>
                <User size={20} color="var(--color-brand-primary)" />
              </div>
              <p style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Profile Information</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-5)' }}>

                {/* Role (read-only) */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label d-flex items-center gap-2">
                    <Shield size={13} />
                    Role (Non-Editable)
                  </label>
                  <div className="form-input form-input-readonly d-flex items-center gap-2">
                    <span className={roleBadgeClass}>{user?.role}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                      Contact an admin to change your role
                    </span>
                  </div>
                </div>

                {/* Username */}
                <div className="form-group">
                  <label className="form-label d-flex items-center gap-2">
                    <User size={13} /> Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label d-flex items-center gap-2">
                    <Mail size={13} /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="divider" />

              {/* Security */}
              <div className="d-flex items-center gap-2 mb-6">
                <Lock size={18} color="var(--color-brand-primary)" />
                <p className="section-title" style={{ marginBottom: 0 }}>Change Password</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
                <div className="form-group">
                  <label className="form-label d-flex items-center gap-2">
                    <Lock size={13} /> New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label d-flex items-center gap-2">
                    <Lock size={13} /> Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat new password"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Save */}
              <div className="d-flex items-center gap-3">
                <button
                  type="submit"
                  className="btn btn-primary d-flex items-center gap-2"
                  style={{ minWidth: 160 }}
                >
                  <Save size={15} />
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
                {saved && (
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-success)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}>
                    ✓ Your changes have been saved
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="card card-padding" style={{ borderColor: 'var(--color-error-border)' }}>
            <p className="section-title" style={{ color: 'var(--color-error)' }}>Danger Zone</p>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)' }}>
              These actions are permanent and cannot be undone.
            </p>
            <button className="btn btn-danger btn-sm">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
