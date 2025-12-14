import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { clearAuthToken } from '../api';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem('krishi_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Auth check failed:', err);
      clearAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearAuthToken();
    setUser(null);
    navigate('/login');
  }

  return { user, setUser, loading, logout, refreshAuth: checkAuth };
}
