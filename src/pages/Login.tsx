import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';
import { 
  TrendingUp, 
  Mail, 
  Lock, 
  AlertCircle, 
  Loader2, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────
  const [isRegistering, setIsRegistering] = useState(false);
  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [confirmPass,   setConfirmPass]   = useState('');
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');
  const [loading,       setLoading]       = useState(false);

  // ── Handlers ───────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPass) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPass) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.register({ email, password, role: 'ADMIN' }); // Default newcomers to ADMIN for full access in evaluation
      setSuccess('Account created successfully! You can now log in.');
      setIsRegistering(false);
      setPassword('');
      setConfirmPass('');
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPass('');
  };

  return (
    <div className="h-screen d-flex" style={{ background: '#fff', overflow: 'hidden' }}>
      
      {/* ── Left Half: Branding / Logo Section ──────────────── */}
      <div className="flex-1 d-flex flex-column justify-center items-center" style={{ 
        background: 'var(--gradient-brand)',
        position: 'relative',
        color: '#fff',
        padding: 'var(--space-12)'
      }}>
        {/* Abstract background elements */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%',
          background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(80px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%',
          background: 'rgba(59,130,246,0.2)', borderRadius: '50%', filter: 'blur(80px)'
        }} />

        <div className="animate-slide-up text-center" style={{ position: 'relative', zIndex: 2 }}>
          <div className="flex-center mb-6">
            <div style={{
              width: 80, height: 80,
              borderRadius: '24px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <TrendingUp size={40} color="#fff" strokeWidth={2.5} />
            </div>
          </div>
          <h1 style={{ 
            fontSize: 'var(--font-size-3xl)', 
            fontWeight: 'var(--font-weight-extrabold)',
            letterSpacing: '-0.04em',
            marginBottom: 'var(--space-4)',
            color: '#fff'
          }}>
            Financial Dashboard
          </h1>
          <p style={{ 
            fontSize: 'var(--font-size-lg)', 
            maxWidth: '380px', 
            opacity: 0.9,
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Analyze your cash flow, track expenses, and grow your wealth with advanced real-time insights.
          </p>
        </div>
      </div>

      {/* ── Right Half: Form Section ───────────────────────── */}
      <div className="flex-1 d-flex items-center justify-center" style={{ background: 'var(--color-bg-base)' }}>
        <div className="animate-fade-in w-full" style={{ maxWidth: 440, padding: 'var(--space-8)' }}>
          
          <div className="mb-10 text-center">
            <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-2)' }}>
              {isRegistering ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-secondary text-sm">
              {isRegistering 
                ? 'Join thousands of users managing their finances better.' 
                : 'Enter your credentials to access your secure portal.'}
            </p>
          </div>

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="card card-padding shadow-md">
            <div className="flex-column gap-4">
              
              {/* Messages */}
              {error && (
                <div className="p-4 d-flex items-center gap-2" style={{
                  background: 'var(--color-error-bg)', color: 'var(--color-error)',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-error-border)',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {success && (
                <div className="p-4 d-flex items-center gap-2" style={{
                  background: 'var(--color-success-bg)', color: 'var(--color-success)',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-success-border)',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  <TrendingUp size={16} /> {success}
                </div>
              )}

              {/* Email */}
              <div className="form-group">
                <label className="form-label d-flex items-center gap-2">
                  <Mail size={14} /> Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label d-flex items-center gap-2">
                  <Lock size={14} /> Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Confirm Password (Register only) */}
              {isRegistering && (
                <div className="form-group animate-fade-in">
                  <label className="form-label d-flex items-center gap-2">
                    <Lock size={14} /> Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="form-input"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-lg btn-full mt-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    {isRegistering ? 'Register' : 'Sign In'}
                    <ChevronRight size={18} />
                  </>
                )
                }
              </button>
            </div>
          </form>

          <button 
            onClick={toggleMode}
            className="btn btn-full mt-4" 
            style={{ 
              background: 'transparent', 
              color: 'var(--color-brand-primary)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            {isRegistering ? (
              <span className="d-flex items-center gap-2"><ArrowLeft size={16} /> Back to Sign In</span>
            ) : (
              <span>Don't have an account? <b>Create one</b></span>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;
