// filepath: KrishiDirect/KrishiDirect/web/src/services/config.js
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  storageKey: 'krishi_token',
};

export default config;