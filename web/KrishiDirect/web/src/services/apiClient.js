import axios from 'axios';

const STORAGE_KEY = 'krishi_token';
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Request interceptor to add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEY);
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) localStorage.removeItem(STORAGE_KEY);
    return Promise.reject(err);
  }
);

// Function to set authentication token
export function setAuthToken(token) { localStorage.setItem(STORAGE_KEY, token); }

// Function to clear authentication token
export function clearAuthToken() { localStorage.removeItem(STORAGE_KEY); }

export default api;