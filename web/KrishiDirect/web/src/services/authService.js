import api from './apiClient';

// Function to register a new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to log in a user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to get the profile of the logged-in user
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export default {
  register,
  login,
  getProfile,
};