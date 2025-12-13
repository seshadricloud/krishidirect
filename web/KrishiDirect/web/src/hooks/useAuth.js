import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const useAuth = () => {
  const { user, setUser, setToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const { token, user } = await authService.login(credentials);
      setToken(token);
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { token, user } = await authService.register(userData);
      setToken(token);
      setUser(user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('krishi_token');
  };

  const getProfile = async () => {
    if (!user) return;
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout();
    }
  };

  useEffect(() => {
    getProfile();
    setLoading(false);
  }, []);

  return { user, loading, login, register, logout };
};

export default useAuth;