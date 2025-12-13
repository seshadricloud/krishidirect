import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api';

export default function Profile(): JSX.Element {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'earnings'>('profile');
  
  // Profile form
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [profileImage, setProfileImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Stats
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      setProfileImage(user.profileImage || '');
      setImagePreview(user.profileImage || '');
      
      if (user.role === 'farmer') {
        fetchStats();
      }
    }
  }, [user]);

  async function fetchStats() {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders')
      ]);
      
      const myProducts = productsRes.data.filter((p: any) => p.userId === user?.id);
      const acceptedOrders = ordersRes.data.filter((o: any) => o.status === 'accepted');
      const revenue = acceptedOrders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
      
      setStats({
        totalProducts: myProducts.length,
        totalOrders: acceptedOrders.length,
        totalSales: acceptedOrders.length,
        revenue
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }

  function handleProfileChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await api.patch('/auth/profile', {
        ...profileData,
        profileImage
      });
      
      setUser(response.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setError('New passwords do not match');
    }

    if (passwordData.newPassword.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await api.patch('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ marginBottom: 8 }}>My Profile</h1>
        <p style={{ color: '#6b7280' }}>Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div style={{
        borderBottom: '2px solid #e5e7eb',
        marginBottom: 32,
        display: 'flex',
        gap: 24
      }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '12px 0',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'profile' ? '3px solid #10b981' : '3px solid transparent',
            color: activeTab === 'profile' ? '#10b981' : '#6b7280',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          👤 Profile Info
        </button>
        <button
          onClick={() => setActiveTab('password')}
          style={{
            padding: '12px 0',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'password' ? '3px solid #10b981' : '3px solid transparent',
            color: activeTab === 'password' ? '#10b981' : '#6b7280',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🔒 Password
        </button>
        {user.role === 'farmer' && (
          <button
            onClick={() => setActiveTab('earnings')}
            style={{
              padding: '12px 0',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'earnings' ? '3px solid #10b981' : '3px solid transparent',
              color: activeTab === 'earnings' ? '#10b981' : '#6b7280',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            💰 Earnings
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div style={{
          padding: 16,
          background: '#fee2e2',
          color: '#dc2626',
          borderRadius: 12,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span>⚠️</span> {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: 16,
          background: '#d1fae5',
          color: '#065f46',
          borderRadius: 12,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span>✅</span> {success}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} style={{ maxWidth: 600 }}>
          {/* Profile Image */}
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <div style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 16px',
              border: '4px solid #e5e7eb',
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 48 }}>👤</span>
              )}
            </div>
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => document.getElementById('profileImageInput')?.click()}
              style={{
                padding: '8px 16px',
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Change Photo
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Full Name *</span>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 10,
                  fontSize: 16
                }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Email *</span>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 10,
                  fontSize: 16
                }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Phone Number</span>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                placeholder="+91 1234567890"
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 10,
                  fontSize: 16
                }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Address</span>
              <textarea
                name="address"
                value={profileData.address}
                onChange={handleProfileChange}
                rows={3}
                placeholder="Your address"
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 10,
                  fontSize: 16,
                  fontFamily: 'inherit'
                }}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px 24px',
                background: loading ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 8
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit} style={{ maxWidth: 600 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Current Password *</span>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 10,
                  fontSize: 16
                }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>New Password *</span>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 10,
                  fontSize: 16
                }}
              />
              <span style={{ fontSize: 13, color: '#6b7280' }}>
                At least 6 characters
              </span>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontWeight: 600 }}>Confirm New Password *</span>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 10,
                  fontSize: 16
                }}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px 24px',
                background: loading ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 8
              }}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      )}

      {/* Earnings Tab (Farmers only) */}
      {activeTab === 'earnings' && user.role === 'farmer' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
            <div style={{
              padding: 24,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 12,
              color: 'white'
            }}>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Total Products</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.totalProducts}</div>
            </div>
            <div style={{
              padding: 24,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: 12,
              color: 'white'
            }}>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Total Orders</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.totalOrders}</div>
            </div>
            <div style={{
              padding: 24,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: 12,
              color: 'white'
            }}>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Total Sales</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.totalSales}</div>
            </div>
            <div style={{
              padding: 24,
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: 12,
              color: 'white'
            }}>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Total Revenue</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>₹{stats.revenue.toFixed(2)}</div>
            </div>
          </div>

          <div style={{
            background: '#eff6ff',
            border: '2px solid #bfdbfe',
            borderRadius: 12,
            padding: 24,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h3 style={{ marginBottom: 8 }}>Great Work!</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Keep listing quality products to grow your business
            </p>
          </div>
        </div>
      )}
    </div>
  );
}