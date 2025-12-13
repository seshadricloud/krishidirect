import axios from 'axios';

const STORAGE_KEY = 'krishi_token';
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEY);
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) localStorage.removeItem(STORAGE_KEY);
    return Promise.reject(err);
  }
);

export function setAuthToken(token: string) { localStorage.setItem(STORAGE_KEY, token); }
export function clearAuthToken() { localStorage.removeItem(STORAGE_KEY); }
export default api;