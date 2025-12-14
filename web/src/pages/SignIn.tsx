import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api';
import '../styles/auth.css';

export default function SignIn(): JSX.Element {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!phone || phone.length !== 10) {
      return setError('Enter valid 10-digit phone number');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { phone });
      setOtpSent(true);
      
      // In development, show OTP
      if (res.data.otp) {
        console.log('Development OTP:', res.data.otp);
        setDevOtp(res.data.otp);
        setSuccess('OTP sent successfully!');
      } else {
        setSuccess('OTP sent successfully! Check your phone.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!otp || otp.length !== 6) {
      return setError('Enter valid 6-digit OTP');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { phone, otp });
      const token = res?.data?.token;
      if (token) {
        setAuthToken(token);
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    const loginData = loginMethod === 'email' 
      ? { email, password }
      : { phone, password };

    if ((loginMethod === 'email' && !email) || (loginMethod === 'phone' && !phone) || !password) {
      return setError(`Enter ${loginMethod} and password.`);
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', loginData);
      const token = res?.data?.token;
      if (token) {
        setAuthToken(token);
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

        {loginMethod !== 'otp' ? (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="form-error">{error}</div>}

            {/* Login Method Toggle */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                style={{
                  flex: 1,
                  padding: 12,
                  background: loginMethod === 'email' ? '#10b981' : '#f3f4f6',
                  color: loginMethod === 'email' ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 14
                }}
              >
                📧 Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                style={{
                  flex: 1,
                  padding: 12,
                  background: loginMethod === 'phone' ? '#10b981' : '#f3f4f6',
                  color: loginMethod === 'phone' ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 14
                }}
              >
                📱 Phone
              </button>
            </div>

            {loginMethod === 'email' ? (
              <label>
                Email
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </label>
            ) : (
              <label>
                Phone Number
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  required 
                />
                <small style={{ color: '#6b7280', fontSize: 12, marginTop: 4, display: 'block' }}>
                  Enter 10-digit mobile number
                </small>
              </label>
            )}

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

            {/* OTP Login Link */}
            <div style={{ 
              marginTop: 16, 
              padding: 12, 
              background: '#f0fdf4', 
              borderRadius: 8,
              textAlign: 'center',
              border: '1px solid #bbf7d0'
            }}>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('otp');
                  setError(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#10b981',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                🔐 Login with OTP instead
              </button>
            </div>
          </form>
        ) : (
          /* OTP Login Form */
          <div className="auth-form">
            {error && <div className="form-error">{error}</div>}
            {success && (
              <div style={{ 
                padding: 12, 
                background: '#d1fae5', 
                color: '#065f46', 
                borderRadius: 8,
                marginBottom: 16,
                fontSize: 14
              }}>
                {success}
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <label>
                  Phone Number
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="Enter your 10-digit phone number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required 
                  />
                  <small style={{ color: '#6b7280', fontSize: 12, marginTop: 4, display: 'block' }}>
                    We'll send you a 6-digit OTP
                  </small>
                </label>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Sending OTP…' : 'Send OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email');
                    setError(null);
                    setSuccess(null);
                  }}
                  style={{
                    marginTop: 12,
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: 14,
                    width: '100%'
                  }}
                >
                  ← Back to password login
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                {/* Development OTP Display */}
                {devOtp && (
                  <div style={{ 
                    padding: 16, 
                    background: '#fef3c7', 
                    borderRadius: 8,
                    marginBottom: 16,
                    border: '2px solid #fbbf24',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 12, color: '#92400e', marginBottom: 4, fontWeight: 600 }}>
                      🔧 DEVELOPMENT MODE
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#92400e', letterSpacing: 4 }}>
                      {devOtp}
                    </div>
                    <div style={{ fontSize: 11, color: '#92400e', marginTop: 4 }}>
                      (Check backend console or use this OTP)
                    </div>
                  </div>
                )}

                <label>
                  Enter OTP
                  <input 
                    type="text" 
                    value={otp} 
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                    style={{ fontSize: 20, letterSpacing: 8, textAlign: 'center' }}
                  />
                  <small style={{ color: '#6b7280', fontSize: 12, marginTop: 4, display: 'block' }}>
                    OTP sent to {phone}
                  </small>
                </label>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Verifying…' : 'Verify & Login'}
                </button>

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                      setDevOtp(null);
                      setError(null);
                      setSuccess(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: 'none',
                      border: '1px solid #d1d5db',
                      borderRadius: 6,
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: 14
                    }}
                  >
                    Change Number
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSendOtp(e as any);
                    }}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: 'none',
                      border: '1px solid #10b981',
                      borderRadius: 6,
                      color: '#10b981',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: 14,
                      opacity: loading ? 0.5 : 1
                    }}
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

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