import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api';
import '../styles/auth.css';

export default function SignUp(): JSX.Element {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate() {
    if (!name || !email || !password) return 'Fill all fields';
    if (password.length < 6) return 'Password must be >= 6 characters';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) return setError(v);
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      const token = res?.data?.token;
      if (token) {
        setAuthToken(token);
        // Small delay to ensure token is saved
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page container">
      <div className="auth-panel">
        <h1>Create your account</h1>
        <p>Sign up as a farmer or buyer to get started.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="form-error">{error}</div>}

          <label>
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value as any)}>
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
            </select>
          </label>

          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create account'}
            </button>
            <Link to="/login" style={{ alignSelf: 'center', color: 'var(--muted)' }}>Already have an account?</Link>
          </div>
        </form>
      </div>

      <aside className="auth-illustration">
        <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80" alt="Fresh vegetables" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
      </aside>
    </div>
  );
}