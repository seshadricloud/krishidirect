import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api';
import '../styles/auth.css';

export default function SignIn(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError('Enter email and password.');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res?.data?.token;
      if (token) {
        setAuthToken(token);
        // Small delay to ensure token is saved
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page container">
      <div className="auth-panel">
        <h1>Sign in</h1>
        <p>Access your KrishiDirect account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="form-error">{error}</div>}

          <label>
            Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            <Link to="/forgot" style={{ color: 'var(--muted)', marginLeft: 'auto' }}>Forgot password?</Link>
          </div>
        </form>

        <p style={{ marginTop: 16 }}>
          New to KrishiDirect? <Link to="/signup">Create an account</Link>
        </p>
      </div>

      <aside className="auth-illustration">
        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80" alt="Farmers using app" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
      </aside>
    </div>
  );
}