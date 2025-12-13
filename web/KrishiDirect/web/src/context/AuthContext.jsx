import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, getProfile as getProfileService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('krishi_token'));

    useEffect(() => {
        if (token) {
            getProfile();
        }
    }, [token]);

    const login = async (credentials) => {
        const { user, token } = await loginService(credentials);
        setUser(user);
        setToken(token);
        localStorage.setItem('krishi_token', token);
    };

    const register = async (userData) => {
        const { user, token } = await registerService(userData);
        setUser(user);
        setToken(token);
        localStorage.setItem('krishi_token', token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('krishi_token');
    };

    const getProfile = async () => {
        const userProfile = await getProfileService();
        setUser(userProfile);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};

export default AuthContext;