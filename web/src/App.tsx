import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import NotificationBell from './components/NotificationBell';
import { useAuth } from './hooks/useAuth';

export default function App(): JSX.Element {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <header style={{
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/images/logo.svg" alt="KrishiDirect" style={{ height: 40 }} />
        </Link>
        
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#64748B', fontWeight: 500 }}>Home</Link>
          <Link to="/products" style={{ textDecoration: 'none', color: '#64748B', fontWeight: 500 }}>Products</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: '#64748B', fontWeight: 500 }}>Dashboard</Link>
              <Link to="/profile" style={{ textDecoration: 'none', color: '#64748B', fontWeight: 500 }}>Profile</Link>
              <NotificationBell />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#2F9E44', fontWeight: 600 }}>👋 {user.name}</span>
                <button
                  onClick={logout}
                  style={{
                    padding: '8px 20px',
                    background: 'transparent',
                    border: '2px solid #E2E8F0',
                    borderRadius: 12,
                    color: '#64748B',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                style={{
                  textDecoration: 'none',
                  color: '#2F9E44',
                  fontWeight: 600
                }}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg,#2F9E44 0%,#4CAF50 100%)',
                  color: 'white',
                  borderRadius: 12,
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home userName={user?.name} />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<AddProduct />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}