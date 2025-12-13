// Custom hook for authentication logic
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/auth/profile');
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            setUser(response.data.user);
            navigate('/dashboard'); // Redirect to dashboard after login
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            navigate('/'); // Redirect to home after logout
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return { user, loading, login, logout };
};

export default useAuth;